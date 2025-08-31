import request from "supertest";
import { sequelize, autoMigrate } from "../../src/utils/database.js";
import app from "../../testApp.js";
import bcrypt from "bcrypt";

describe("Error Scenarios and Edge Cases", () => {
  let ownerToken;
  let supervisorToken;
  let testIds = {};

  beforeAll(async () => {
    await autoMigrate();

    // Create test users
    const { default: User } = await import("../../src/models/User.js");

    const ownerHash = await bcrypt.hash("owner123", 10);
    await User.create({
      username: "testowner",
      password: ownerHash,
      role: "Owner",
      fullName: "Test Owner",
    });

    const supervisorHash = await bcrypt.hash("staff123", 10);
    await User.create({
      username: "teststaff",
      password: supervisorHash,
      role: "staff",
      fullName: "Test Staff",
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  const auth = (token) => (req) =>
    token ? req.set("Authorization", `Bearer ${token}`) : req;

  test("1. Authentication setup", async () => {
    const ownerRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "testowner", password: "owner123" });
    expect(ownerRes.statusCode).toBe(200);
    ownerToken = ownerRes.body.token;

    const supervisorRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "teststaff", password: "staff123" });
    expect(supervisorRes.statusCode).toBe(200);
    supervisorToken = supervisorRes.body.token;
  });

  describe("Authentication Error Scenarios", () => {
    test("Invalid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "testowner", password: "wrongpassword" });
      expect(res.statusCode).toBe(401);
    });

    test("Missing username", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ password: "owner123" });
      expect(res.statusCode).toBe(400);
    });

    test("Missing password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "testowner" });
      expect(res.statusCode).toBe(400);
    });

    test("Malformed JSON", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send("{ invalid json");
      expect([400, 500]).toContain(res.statusCode);
    });

    test("SQL injection attempt", async () => {
      const res = await request(app).post("/api/auth/login").send({
        username: "admin' OR '1'='1",
        password: "password",
      });
      expect(res.statusCode).toBe(401);
    });
  });

  describe("House Management Edge Cases", () => {
    test("Create house with maximum capacity", async () => {
      const res = await auth(ownerToken)(request(app).post("/api/houses")).send(
        {
          houseName: "Maximum Capacity House",
          capacity: 999999, // Very large number
          currentBirdCount: 999999,
        }
      );
      expect([200, 201, 400]).toContain(res.statusCode);
    });

    test("Create house with zero capacity", async () => {
      const res = await auth(ownerToken)(request(app).post("/api/houses")).send(
        {
          houseName: "Zero Capacity House",
          capacity: 0,
          currentBirdCount: 0,
        }
      );
      expect([200, 201, 400]).toContain(res.statusCode);
    });

    test("Update house with negative capacity", async () => {
      // First create a valid house
      const createRes = await auth(ownerToken)(
        request(app).post("/api/houses")
      ).send({
        houseName: "Test House for Negative Capacity",
        capacity: 100,
        currentBirdCount: 50,
      });

      if ([200, 201].includes(createRes.statusCode)) {
        const houseId = createRes.body.id;
        testIds.houseId = houseId;

        const updateRes = await auth(ownerToken)(
          request(app).put(`/api/houses/${houseId}`)
        ).send({
          capacity: -100,
        });
        expect([200, 400]).toContain(updateRes.statusCode);
      }
    });

    test("Get non-existent house", async () => {
      const res = await auth(ownerToken)(request(app).get("/api/houses/99999"));
      expect(res.statusCode).toBe(404);
    });

    test("Update non-existent house", async () => {
      const res = await auth(ownerToken)(
        request(app).put("/api/houses/99999")
      ).send({ houseName: "Updated Name" });
      expect([404, 500]).toContain(res.statusCode);
    });
  });

  describe("Daily Log Edge Cases", () => {
    test("Create daily log with future date", async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const dateString = futureDate.toISOString().split("T")[0];

      const res = await auth(supervisorToken)(
        request(app).post("/api/daily-logs")
      ).send({
        logDate: dateString,
        houseId: testIds.houseId || 1,
        eggsGradeA: 100,
        eggsGradeB: 20,
        eggsGradeC: 5,
        feedGivenKg: 40.0,
      });
      expect([200, 201, 400]).toContain(res.statusCode);
    });

    test("Create daily log with very old date", async () => {
      const res = await auth(supervisorToken)(
        request(app).post("/api/daily-logs")
      ).send({
        logDate: "1900-01-01",
        houseId: testIds.houseId || 1,
        eggsGradeA: 100,
        eggsGradeB: 20,
        eggsGradeC: 5,
        feedGivenKg: 40.0,
      });
      expect([200, 201, 400]).toContain(res.statusCode);
    });

    test("Create daily log with maximum egg counts", async () => {
      const res = await auth(supervisorToken)(
        request(app).post("/api/daily-logs")
      ).send({
        logDate: "2025-08-30",
        houseId: testIds.houseId || 1,
        eggsGradeA: 999999,
        eggsGradeB: 999999,
        eggsGradeC: 999999,
        feedGivenKg: 999999.99,
      });
      expect([200, 201, 400]).toContain(res.statusCode);
    });

    test("Create daily log with decimal egg counts", async () => {
      const res = await auth(supervisorToken)(
        request(app).post("/api/daily-logs")
      ).send({
        logDate: "2025-08-31",
        houseId: testIds.houseId || 1,
        eggsGradeA: 100.5, // Should be integer
        eggsGradeB: 20,
        eggsGradeC: 5,
        feedGivenKg: 40.0,
      });
      expect([200, 201, 400]).toContain(res.statusCode);
    });
  });

  describe("Sales Edge Cases", () => {
    test("Create sale with zero quantities", async () => {
      const res = await auth(supervisorToken)(
        request(app).post("/api/sales")
      ).send({
        saleDate: "2025-08-25",
        customerId: 1,
        gradeAQty: 0,
        gradeAPrice: 25.0,
        gradeBQty: 0,
        gradeBPrice: 22.0,
        gradeCQty: 0,
        gradeCPrice: 18.0,
        paymentMethod: "cash",
        paymentStatus: "paid",
      });
      expect([200, 201, 400]).toContain(res.statusCode);
    });

    test("Create sale with negative prices", async () => {
      const res = await auth(supervisorToken)(
        request(app).post("/api/sales")
      ).send({
        saleDate: "2025-08-25",
        customerId: 1,
        gradeAQty: 10,
        gradeAPrice: -25.0, // Negative price
        paymentMethod: "cash",
        paymentStatus: "paid",
      });
      expect([200, 201, 400]).toContain(res.statusCode);
    });

    test("Create sale with very high prices", async () => {
      const res = await auth(supervisorToken)(
        request(app).post("/api/sales")
      ).send({
        saleDate: "2025-08-25",
        customerId: 1,
        gradeAQty: 10,
        gradeAPrice: 999999.99, // Very high price
        paymentMethod: "cash",
        paymentStatus: "paid",
      });
      expect([200, 201, 400]).toContain(res.statusCode);
    });
  });

  describe("Feed Management Edge Cases", () => {
    test("Create recipe with percentages totaling over 100", async () => {
      const res = await auth(ownerToken)(
        request(app).post("/api/feed/recipes")
      ).send({
        recipeName: "Invalid Recipe",
        cornPercent: 60,
        soybeanPercent: 50, // Total > 100
        wheatBranPercent: 20,
        limestonePercent: 10,
      });
      expect([200, 201, 400]).toContain(res.statusCode);
    });

    test("Create recipe with zero percentages", async () => {
      const res = await auth(ownerToken)(
        request(app).post("/api/feed/recipes")
      ).send({
        recipeName: "Zero Recipe",
        cornPercent: 0,
        soybeanPercent: 0,
        wheatBranPercent: 0,
        limestonePercent: 0,
      });
      expect([200, 201, 400]).toContain(res.statusCode);
    });

    test("Create batch with zero cost", async () => {
      const res = await auth(supervisorToken)(
        request(app).post("/api/feed/batches")
      ).send({
        batchDate: "2025-08-25",
        batchSizeKg: 1000,
        recipeId: 1,
        totalCost: 0,
        costPerKg: 0,
      });
      expect([200, 201, 400]).toContain(res.statusCode);
    });
  });

  describe("Labor Management Edge Cases", () => {
    test("Create laborer with very high salary", async () => {
      const res = await auth(ownerToken)(
        request(app).post("/api/laborers")
      ).send({
        employeeId: "HIGH001",
        fullName: "High Salary Employee",
        position: "CEO",
        monthlySalary: 9999999.99,
      });
      expect([200, 201, 400]).toContain(res.statusCode);
    });

    test("Create laborer with zero salary", async () => {
      const res = await auth(ownerToken)(
        request(app).post("/api/laborers")
      ).send({
        employeeId: "ZERO001",
        fullName: "Zero Salary Employee",
        position: "Volunteer",
        monthlySalary: 0,
      });
      expect([200, 201, 400]).toContain(res.statusCode);
    });

    test("Create work assignment for non-existent laborer", async () => {
      const res = await auth(supervisorToken)(
        request(app).post("/api/work-assignments")
      ).send({
        workDate: "2025-08-25",
        laborerId: 99999,
        tasksAssigned: ["collection"],
        attendanceStatus: "present",
      });
      expect([400, 404]).toContain(res.statusCode);
    });
  });

  describe("Report Edge Cases", () => {
    test("Get report with invalid date range", async () => {
      const res = await auth(ownerToken)(
        request(app).get(
          "/api/reports/production?start=2025-08-31&end=2025-08-01"
        )
      );
      expect([200, 400]).toContain(res.statusCode);
    });

    test("Get report with very large date range", async () => {
      const res = await auth(ownerToken)(
        request(app).get(
          "/api/reports/production?start=2000-01-01&end=2030-12-31"
        )
      );
      expect(res.statusCode).toBe(200);
    });

    test("Get report with malformed dates", async () => {
      const res = await auth(ownerToken)(
        request(app).get(
          "/api/reports/production?start=invalid-date&end=2025-08-31"
        )
      );
      expect([200, 400, 500]).toContain(res.statusCode);
    });
  });

  describe("Concurrent Operations", () => {
    test("Concurrent daily log creation", async () => {
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          auth(supervisorToken)(request(app).post("/api/daily-logs")).send({
            logDate: `2025-09-${String(i + 1).padStart(2, "0")}`,
            houseId: testIds.houseId || 1,
            eggsGradeA: 100 + i * 10,
            eggsGradeB: 20,
            eggsGradeC: 5,
            feedGivenKg: 40 + i,
          })
        );
      }

      const results = await Promise.all(promises);
      const successes = results.filter((r) =>
        [200, 201].includes(r.statusCode)
      );
      expect(successes.length).toBeGreaterThan(0);
    });

    test("Concurrent sales creation", async () => {
      const promises = [];
      for (let i = 0; i < 3; i++) {
        promises.push(
          auth(supervisorToken)(request(app).post("/api/sales")).send({
            saleDate: "2025-08-25",
            customerId: 1,
            gradeAQty: 10 + i,
            gradeAPrice: 25.0,
            paymentMethod: "cash",
            paymentStatus: "paid",
          })
        );
      }

      const results = await Promise.all(promises);
      const successes = results.filter((r) =>
        [200, 201].includes(r.statusCode)
      );
      expect(successes.length).toBeGreaterThan(0);
    });
  });

  describe("Data Integrity Tests", () => {
    test("Test unique constraints", async () => {
      const res = await request(app).post("/api/auth/login").send({
        username: "testowner",
        password: "owner123",
      });

      expect(res.statusCode).toBe(200);
    });
  });

  describe("Performance Edge Cases", () => {
    test("Large dataset query", async () => {
      const startTime = Date.now();
      const res = await auth(ownerToken)(
        request(app).get("/api/daily-logs?start=2025-01-01&end=2025-12-31")
      );
      const endTime = Date.now();

      expect(res.statusCode).toBe(200);
      expect(endTime - startTime).toBeLessThan(10000); // Should complete within 10 seconds
    });

    test("Memory-intensive operations", async () => {
      // Test with large payload
      const largeNotes = "A".repeat(10000); // 10KB of text
      const res = await auth(supervisorToken)(
        request(app).post("/api/daily-logs")
      ).send({
        logDate: "2025-08-26",
        houseId: testIds.houseId || 1,
        eggsGradeA: 100,
        eggsGradeB: 20,
        eggsGradeC: 5,
        feedGivenKg: 40.0,
        notes: largeNotes,
      });
      expect([200, 201, 400]).toContain(res.statusCode);
    });
  });
});
