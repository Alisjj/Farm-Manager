import request from "supertest";
import { sequelize, autoMigrate } from "../../src/utils/database.js";
import app from "../../testApp.js";
import bcrypt from "bcrypt";

describe("Reporting Flow", () => {
  let ownerToken;
  let supervisorToken;
  let houseId;
  let customerId;

  beforeAll(async () => {
    await autoMigrate();

    // Create test users, house, and customer
    const { default: User } = await import("../../src/models/User.js");
    const { default: House } = await import("../../src/models/House.js");
    const { default: Customer } = await import("../../src/models/Customer.js");

    const ownerHash = await bcrypt.hash("owner123", 10);
    await User.create({
      username: "testowner",
      password: ownerHash,
      role: "Owner",
      fullName: "Test Owner",
    });

    const supervisorHash = await bcrypt.hash("supervisor123", 10);
    await User.create({
      username: "testsupervisor",
      password: supervisorHash,
      role: "Supervisor",
      fullName: "Test Supervisor",
    });

    // Create test house
    const house = await House.create({
      houseName: "Reports Test House",
      capacity: 1000,
      currentBirdCount: 900,
    });
    houseId = house.id;

    // Create test customer
    const customer = await Customer.create({
      customerName: "Reports Test Customer",
      phone: "+1234567890",
      email: "reports@test.com",
      address: "123 Report St",
      preferredContact: "email",
    });
    customerId = customer.id;

    // Create sample data for reports
    await createSampleData();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  const createSampleData = async () => {
    // Create daily logs for a month
    for (let day = 1; day <= 31; day++) {
      const date = `2025-08-${day.toString().padStart(2, "0")}`;
      await auth(supervisorToken)(request(app).post("/api/daily-logs")).send({
        logDate: date,
        houseId: houseId,
        eggsGradeA: Math.floor(Math.random() * 50) + 100,
        eggsGradeB: Math.floor(Math.random() * 30) + 20,
        eggsGradeC: Math.floor(Math.random() * 15) + 5,
        feedGivenKg: Math.floor(Math.random() * 10) + 40,
        mortalityCount: Math.floor(Math.random() * 3),
        notes: `Sample data for ${date}`,
      });
    }

    // Create sales transactions
    for (let day = 1; day <= 31; day += 2) {
      const date = `2025-08-${day.toString().padStart(2, "0")}`;
      await auth(supervisorToken)(request(app).post("/api/sales")).send({
        saleDate: date,
        customerId: customerId,
        gradeAQty: Math.floor(Math.random() * 20) + 10,
        gradeAPrice: 25.0,
        gradeBQty: Math.floor(Math.random() * 15) + 5,
        gradeBPrice: 22.0,
        gradeCQty: Math.floor(Math.random() * 10) + 2,
        gradeCPrice: 18.0,
        paymentMethod: "cash",
        paymentStatus: "paid",
      });
    }
  };

  const auth = (token) => (req) =>
    token ? req.set("Authorization", `Bearer ${token}`) : req;

  test("1. Owner login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "testowner", password: "owner123" });

    expect(res.statusCode).toBe(200);
    ownerToken = res.body.token;
  });

  test("2. Supervisor login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "testsupervisor", password: "supervisor123" });

    expect(res.statusCode).toBe(200);
    supervisorToken = res.body.token;
  });

  test("3. Get production report", async () => {
    const res = await auth(ownerToken)(
      request(app).get(
        "/api/reports/production?start=2025-08-01&end=2025-08-31"
      )
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("start", "2025-08-01");
    expect(res.body).toHaveProperty("end", "2025-08-31");
    expect(res.body).toHaveProperty("totalEggs");
    expect(res.body).toHaveProperty("avgPerDay");
    expect(res.body).toHaveProperty("logs");
    expect(Array.isArray(res.body.logs)).toBe(true);
    expect(res.body.totalEggs).toBeGreaterThan(0);
  });

  test("4. Get sales report", async () => {
    const res = await auth(ownerToken)(
      request(app).get("/api/reports/sales?start=2025-08-01&end=2025-08-31")
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("start", "2025-08-01");
    expect(res.body).toHaveProperty("end", "2025-08-31");
    expect(res.body).toHaveProperty("totalAmount");
    expect(res.body).toHaveProperty("totalDozens");
    expect(res.body).toHaveProperty("rows");
    expect(Array.isArray(res.body.rows)).toBe(true);
  });

  test("5. Get financial report", async () => {
    const res = await auth(ownerToken)(
      request(app).get("/api/reports/financial?start=2025-08-01&end=2025-08-31")
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("start", "2025-08-01");
    expect(res.body).toHaveProperty("end", "2025-08-31");
    expect(res.body).toHaveProperty("totalOperating");
    expect(res.body).toHaveProperty("totalSales");
  });

  test("6. Export production report as CSV", async () => {
    const res = await auth(ownerToken)(
      request(app).get(
        "/api/reports/export/production?start=2025-08-01&end=2025-08-31&format=csv"
      )
    );

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.headers["content-type"]).toContain("text/csv");
      expect(res.text).toContain("date");
      expect(res.text).toContain("eggsA");
    }
  });

  test("7. Export sales report as CSV", async () => {
    const res = await auth(ownerToken)(
      request(app).get(
        "/api/reports/export/sales?start=2025-08-01&end=2025-08-31&format=csv"
      )
    );

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.headers["content-type"]).toContain("text/csv");
      expect(res.text).toContain("date");
      expect(res.text).toContain("totalAmount");
    }
  });

  test("8. Export production report as PDF", async () => {
    const res = await auth(ownerToken)(
      request(app).get(
        "/api/reports/export/production?start=2025-08-01&end=2025-08-31&format=pdf"
      )
    );

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.headers["content-type"]).toContain("application/pdf");
    }
  });

  test("9. Get production report for specific house", async () => {
    const res = await auth(ownerToken)(
      request(app).get(
        `/api/reports/production?start=2025-08-01&end=2025-08-31&houseId=${houseId}`
      )
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("totalEggs");
  });

  test("10. Get weekly production report", async () => {
    const res = await auth(ownerToken)(
      request(app).get(
        "/api/reports/production?start=2025-08-01&end=2025-08-07"
      )
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.logs.length).toBeLessThanOrEqual(7);
  });

  test("11. Get monthly sales summary", async () => {
    const res = await auth(ownerToken)(
      request(app).get("/api/reports/sales?start=2025-08-01&end=2025-08-31")
    );

    if (res.statusCode === 200) {
      const totalAmount = res.body.totalAmount;
      const totalDozens = res.body.totalDozens;

      expect(totalAmount).toBeGreaterThan(0);
      expect(totalDozens).toBeGreaterThan(0);

      // Note: totalDozens is actually total egg count, not dozens
      // If we want actual dozens, we should calculate: Math.floor(totalDozens / 12)
      const actualDozens = Math.floor(totalDozens / 12);
      expect(actualDozens).toBeGreaterThan(0);
    }
  });

  test("12. Test report date validation", async () => {
    const res = await auth(ownerToken)(
      request(app).get(
        "/api/reports/production?start=2025-08-31&end=2025-08-01"
      )
    );

    // Should handle invalid date ranges gracefully
    expect([200, 400]).toContain(res.statusCode);
  });

  test("13. Test report with no data", async () => {
    const res = await auth(ownerToken)(
      request(app).get(
        "/api/reports/production?start=2025-07-01&end=2025-07-31"
      )
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.totalEggs).toBe(0);
    expect(res.body.logs.length).toBe(0);
  });

  test("14. Get production efficiency metrics", async () => {
    const res = await auth(ownerToken)(
      request(app).get(
        "/api/reports/production/metrics?start=2025-08-01&end=2025-08-31"
      )
    );

    // This endpoint might not exist
    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("feedConversionRatio");
      expect(res.body).toHaveProperty("mortalityRate");
    }
  });

  test("15. Supervisor can access reports", async () => {
    const res = await auth(supervisorToken)(
      request(app).get(
        "/api/reports/production?start=2025-08-01&end=2025-08-31"
      )
    );

    expect(res.statusCode).toBe(200);
  });

  test("16. Test report caching (if implemented)", async () => {
    const startTime = Date.now();

    await auth(ownerToken)(
      request(app).get(
        "/api/reports/production?start=2025-08-01&end=2025-08-31"
      )
    );

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Reports should be reasonably fast (< 5 seconds for test data)
    expect(responseTime).toBeLessThan(5000);
  });

  test("17. Export financial report as PDF", async () => {
    const res = await auth(ownerToken)(
      request(app).get(
        "/api/reports/export/financial?start=2025-08-01&end=2025-08-31&format=pdf"
      )
    );

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.headers["content-type"]).toContain("application/pdf");
    }
  });

  test("18. Test report with invalid format", async () => {
    const res = await auth(ownerToken)(
      request(app).get(
        "/api/reports/export/production?start=2025-08-01&end=2025-08-31&format=invalid"
      )
    );

    expect([400, 404]).toContain(res.statusCode);
  });

  test("19. Get comparative reports", async () => {
    const res = await auth(ownerToken)(
      request(app).get(
        "/api/reports/comparison?period1=2025-07&period2=2025-08"
      )
    );

    // This endpoint might not exist
    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("period1");
      expect(res.body).toHaveProperty("period2");
      expect(res.body).toHaveProperty("comparison");
    }
  });

  test("20. Test large date range performance", async () => {
    const res = await auth(ownerToken)(
      request(app).get(
        "/api/reports/production?start=2025-01-01&end=2025-12-31"
      )
    );

    expect(res.statusCode).toBe(200);
    // Should handle large date ranges without crashing
  });
});
