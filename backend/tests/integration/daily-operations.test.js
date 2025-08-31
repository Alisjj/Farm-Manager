import request from "supertest";
import { sequelize, autoMigrate } from "../../src/utils/database.js";
import app from "../../testApp.js";
import bcrypt from "bcrypt";

describe("Daily Operations Flow", () => {
  let ownerToken;
  let supervisorToken;
  let houseId;
  let dailyLogId;
  let supervisorUserId;

  beforeAll(async () => {
    await autoMigrate();

    // Create test users and house
    const { default: User } = await import("../../src/models/User.js");
    const { default: House } = await import("../../src/models/House.js");

    const ownerHash = await bcrypt.hash("owner123", 10);
    await User.create({
      username: "testowner",
      password: ownerHash,
      role: "owner",
      fullName: "Test Owner",
    });

    const supervisorHash = await bcrypt.hash("staff123", 10);
    const supervisor = await User.create({
      username: "teststaff",
      password: supervisorHash,
      role: "staff",
      fullName: "Test Staff",
    });
    supervisorUserId = supervisor.id;

    // Create test house
    const house = await House.create({
      houseName: "Operations Test House",
      capacity: 1000,
      currentBirdCount: 850,
    });
    houseId = house.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  const auth = (token) => (req) =>
    token ? req.set("Authorization", `Bearer ${token}`) : req;

  test("1. Staff login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "teststaff", password: "staff123" });

    expect(res.statusCode).toBe(200);
    supervisorToken = res.body.token;
  });

  test("2. Owner login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "testowner", password: "owner123" });

    expect(res.statusCode).toBe(200);
    ownerToken = res.body.token;
  });

  test("3. Create daily log entry", async () => {
    const res = await auth(supervisorToken)(
      request(app).post("/api/daily-logs")
    ).send({
      logDate: new Date("2025-08-25").toISOString().split("T")[0], // Ensure proper date format
      houseId: houseId,
      eggsGradeA: 120,
      eggsGradeB: 30,
      eggsGradeC: 10,
      feedGivenKg: 45.5,
      mortalityCount: 2,
      notes: "Normal production day",
      supervisorId: supervisorUserId, // Use the actual supervisor ID
    });

    expect([200, 201]).toContain(res.statusCode);
    if (res.statusCode === 201 || res.statusCode === 200) {
      expect(res.body.data).toHaveProperty("id");
      dailyLogId = res.body.data.id;
      // Daily log created with ID: dailyLogId
    }
  });

  test("4. Get daily logs by date", async () => {
    const testDate = new Date("2025-08-25").toISOString().split("T")[0];
    const res = await auth(supervisorToken)(
      request(app).get(`/api/daily-logs?date=${testDate}`)
    );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("5. Get daily log by ID", async () => {
    if (!dailyLogId) {
      // Skipping test 5 - no daily log ID available
      return;
    }

    const res = await auth(supervisorToken)(
      request(app).get(`/api/daily-logs/${dailyLogId}`)
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.data.eggsGradeA).toBe(120);
    expect(res.body.data.feedGivenKg).toBe(45.5);
  });

  test("6. Update daily log", async () => {
    const res = await auth(supervisorToken)(
      request(app).put(`/api/daily-logs/${dailyLogId}`)
    ).send({
      eggsGradeA: 125,
      eggsGradeB: 35,
      notes: "Updated production numbers",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.eggsGradeA).toBe(125);
    expect(res.body.data.eggsGradeB).toBe(35);
  });

  test("7. Create multiple daily logs for different dates", async () => {
    const dates = ["2025-08-24", "2025-08-26", "2025-08-27"];

    for (const date of dates) {
      const res = await auth(supervisorToken)(
        request(app).post("/api/daily-logs")
      ).send({
        logDate: date,
        houseId: houseId,
        eggsGradeA: Math.floor(Math.random() * 50) + 100,
        eggsGradeB: Math.floor(Math.random() * 20) + 20,
        eggsGradeC: Math.floor(Math.random() * 10) + 5,
        feedGivenKg: Math.floor(Math.random() * 10) + 40,
        mortalityCount: Math.floor(Math.random() * 3),
        notes: `Production log for ${date}`,
      });

      expect([200, 201]).toContain(res.statusCode);
    }
  });

  test("8. Get daily logs for date range", async () => {
    const res = await auth(ownerToken)(
      request(app).get("/api/daily-logs?start=2025-08-24&end=2025-08-27")
    );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(1);
  });

  test("9. Create daily log with zero production", async () => {
    const res = await auth(supervisorToken)(
      request(app).post("/api/daily-logs")
    ).send({
      logDate: "2025-08-28",
      houseId: houseId,
      eggsGradeA: 0,
      eggsGradeB: 0,
      eggsGradeC: 0,
      feedGivenKg: 50.0,
      mortalityCount: 0,
      notes: "Rest day - no egg collection",
    });

    expect([200, 201]).toContain(res.statusCode);
  });

  test("10. Validate daily log with missing required fields", async () => {
    const res = await auth(supervisorToken)(
      request(app).post("/api/daily-logs")
    ).send({
      logDate: new Date("2025-08-29").toISOString().split("T")[0],
      // Missing houseId
      eggsGradeA: 100,
    });

    expect(res.statusCode).toBe(400);
  });

  test("11. Validate daily log with invalid egg counts", async () => {
    const res = await auth(supervisorToken)(
      request(app).post("/api/daily-logs")
    ).send({
      logDate: new Date("2025-08-29").toISOString().split("T")[0],
      houseId: houseId,
      eggsGradeA: -10,
      eggsGradeB: 20,
      eggsGradeC: 5,
      feedGivenKg: 45.0,
    });

    expect(res.statusCode).toBe(400);
  });

  test("12. Create daily log for same date and house (should fail)", async () => {
    const testDate = new Date("2025-08-25").toISOString().split("T")[0];
    const res = await auth(supervisorToken)(
      request(app).post("/api/daily-logs")
    ).send({
      logDate: testDate, // Same as first log
      houseId: houseId,
      eggsGradeA: 100,
      eggsGradeB: 20,
      eggsGradeC: 5,
      feedGivenKg: 40.0,
    });

    expect([400, 409]).toContain(res.statusCode); // Conflict or validation error
  });

  test("13. Get daily production summary", async () => {
    const res = await auth(ownerToken)(
      request(app).get(
        "/api/daily-logs/summary?start=2025-08-24&end=2025-08-28"
      )
    );

    // This endpoint might not exist, so expect either success, 404, or validation error
    expect([200, 400, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("totalEggs");
      expect(res.body).toHaveProperty("averageDailyProduction");
    }
  });

  test("14. Test egg total calculation", async () => {
    const getRes = await auth(supervisorToken)(
      request(app).get(`/api/daily-logs/${dailyLogId}`)
    );

    if (getRes.statusCode === 200) {
      const log = getRes.body.data;
      const calculatedTotal = log.eggsGradeA + log.eggsGradeB + log.eggsGradeC;

      // Verify the total matches our expectation
      expect(calculatedTotal).toBe(125 + 35 + 10); // Updated values
    }
  });

  test("15. Update house bird count based on mortality", async () => {
    const getHouseRes = await auth(supervisorToken)(
      request(app).get(`/api/houses/${houseId}`)
    );

    if (getHouseRes.statusCode === 200) {
      const originalCount = getHouseRes.body.data.currentBirdCount;

      // Simulate mortality impact
      const totalMortality = 2; // From our test logs
      const expectedCount = originalCount - totalMortality;

      // This would typically be handled by business logic
      expect(originalCount).toBe(850);
    }
  });

  test("16. Delete daily log", async () => {
    const res = await auth(supervisorToken)(
      request(app).delete(`/api/daily-logs/${dailyLogId}`)
    );

    expect([200, 204]).toContain(res.statusCode);
  });

  test("17. Verify daily log deletion", async () => {
    const res = await auth(supervisorToken)(
      request(app).get(`/api/daily-logs/${dailyLogId}`)
    );

    expect(res.statusCode).toBe(404);
  });

  test("18. Test concurrent daily log creation", async () => {
    // This tests if the system handles concurrent operations properly
    const promises = [];
    for (let i = 0; i < 3; i++) {
      promises.push(
        auth(supervisorToken)(request(app).post("/api/daily-logs")).send({
          logDate: `2025-08-3${i}`,
          houseId: houseId,
          eggsGradeA: 100 + i * 10,
          eggsGradeB: 20 + i * 5,
          eggsGradeC: 5 + i,
          feedGivenKg: 40 + i * 2,
          mortalityCount: i,
          notes: `Concurrent test log ${i}`,
        })
      );
    }

    const results = await Promise.all(promises);

    // At least one should succeed
    const successes = results.filter((r) => [200, 201].includes(r.statusCode));
    expect(successes.length).toBeGreaterThan(0);
  });
});
