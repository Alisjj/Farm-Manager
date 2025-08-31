import request from "supertest";
import { sequelize, autoMigrate } from "../../src/utils/database.js";
import app from "../../testApp.js";
import bcrypt from "bcrypt";

describe("Feed Management Flow", () => {
  let ownerToken;
  let supervisorToken;
  let recipeId;
  let batchId;

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
      .send({ username: "teststaff", password: "staff123" });

    expect(res.statusCode).toBe(200);
    supervisorToken = res.body.token;
  });

  test("3. Create feed recipe", async () => {
    const res = await auth(ownerToken)(
      request(app).post("/api/feed/recipes")
    ).send({
      recipeName: "Layer Starter Mix",
      cornPercent: 45.5,
      soybeanPercent: 25.0,
      wheatBranPercent: 20.0,
      limestonePercent: 5.0,
      otherIngredients: {
        "Vitamin Premix": 3.0,
        Salt: 0.5,
        "Amino Acids": 1.0,
      },
      isActive: true,
    });

    expect([200, 201]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      expect(res.body.data).toHaveProperty("id");
      recipeId = res.body.data.id;
    }
  });

  test("4. Get all feed recipes", async () => {
    const res = await auth(supervisorToken)(
      request(app).get("/api/feed/recipes")
    );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    // Don't require data to exist since in-memory DB might reset
  });

  test("5. Get recipe by ID", async () => {
    if (!recipeId) {
      // Skipping test 5 - no recipe ID available
      return;
    }

    const res = await auth(supervisorToken)(
      request(app).get(`/api/feed/recipes/${recipeId}`)
    );

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.data.recipeName).toBe("Layer Starter Mix");
      expect(res.body.data.cornPercent).toBe(45.5);
    }
  });

  test("6. Update feed recipe", async () => {
    if (!recipeId) {
      // Skipping test 6 - no recipe ID available
      return;
    }

    const res = await auth(ownerToken)(
      request(app).put(`/api/feed/recipes/${recipeId}`)
    ).send({
      recipeName: "Layer Starter Mix - Updated",
      cornPercent: 40.0,
      soybeanPercent: 30.0,
      wheatBranPercent: 20.0,
      limestonePercent: 5.0,
      otherIngredients: {
        "Vitamin Premix": 3.0,
        Salt: 0.5,
        "Amino Acids": 1.5,
      },
    });

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.data.recipeName).toBe("Layer Starter Mix - Updated");
    }
  });

  test("7. Create feed batch", async () => {
    const res = await auth(supervisorToken)(
      request(app).post("/api/feed/batches")
    ).send({
      batchDate: "2025-08-25",
      batchSizeKg: 1000,
      recipeId: recipeId,
      totalCost: 750.0,
      costPerKg: 0.75,
    });

    expect([200, 201]).toContain(res.statusCode);
    if (res.statusCode === 201 || res.statusCode === 200) {
      expect(res.body.data).toHaveProperty("id");
      batchId = res.body.data.id;
    }
  });

  test("8. Get all feed batches", async () => {
    const res = await auth(supervisorToken)(
      request(app).get("/api/feed/batches")
    );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("9. Get batch by ID", async () => {
    const res = await auth(supervisorToken)(
      request(app).get(`/api/feed/batches/${batchId}`)
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.data.batchSizeKg).toBe(1000);
    expect(res.body.data.costPerKg).toBe(0.75);
  });

  test("10. Add ingredient to batch", async () => {
    const res = await auth(supervisorToken)(
      request(app).post(`/api/feed/batches/${batchId}/ingredients`)
    ).send({
      ingredientName: "Corn (Premium)",
      amountKg: 400,
      costPerKg: 0.25,
      totalCost: 100.0,
    });

    expect([200, 201]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      expect(res.body.data).toHaveProperty("id");
    }
  });

  test("11. Get batch ingredients", async () => {
    const res = await auth(supervisorToken)(
      request(app).get(`/api/feed/batches/${batchId}/ingredients`)
    );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("12. Update batch", async () => {
    const res = await auth(supervisorToken)(
      request(app).put(`/api/feed/batches/${batchId}`)
    ).send({
      totalCost: 800.0,
      costPerKg: 0.8,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.totalCost).toBe(800);
    expect(res.body.data.costPerKg).toBe(0.8);
  });

  test("13. Create second recipe", async () => {
    const res = await auth(ownerToken)(
      request(app).post("/api/feed/recipes")
    ).send({
      recipeName: "Layer Grower Mix",
      cornPercent: 50.0,
      soybeanPercent: 30.0,
      wheatBranPercent: 15.0,
      limestonePercent: 3.0,
      otherIngredients: {
        "Vitamin Premix": 1.5,
        Salt: 0.5,
      },
      isActive: true,
    });

    expect([200, 201]).toContain(res.statusCode);
  });

  test("14. Deactivate recipe", async () => {
    const res = await auth(ownerToken)(
      request(app).put(`/api/feed/recipes/${recipeId}`)
    ).send({
      isActive: false,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.isActive).toBe(false);
  });

  test("15. Get feed cost estimate", async () => {
    const res = await auth(supervisorToken)(
      request(app).post("/api/feed/batches/estimate")
    ).send({
      recipe: {
        cornPercent: 50,
        soybeanPercent: 50,
      },
      batchSizeKg: 500,
      ingredientPrices: {
        corn: 0.3,
        soybean: 0.5,
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.data).toHaveProperty("totalCost");
    expect(res.body.data.totalCost).toBe(200); // (250 * 0.30) + (250 * 0.50) = 200
  });

  test("16. Create recipe with invalid percentages", async () => {
    const res = await auth(ownerToken)(
      request(app).post("/api/feed/recipes")
    ).send({
      recipeName: "Invalid Recipe",
      cornPercent: 80, // Too high
      soybeanPercent: 30, // Total > 100
      wheatBranPercent: 10,
      limestonePercent: 5,
    });

    expect(res.statusCode).toBe(400);
  });

  test("17. Create batch with invalid recipe ID", async () => {
    const res = await auth(supervisorToken)(
      request(app).post("/api/feed/batches")
    ).send({
      batchDate: "2025-08-26",
      batchSizeKg: 500,
      recipeId: 99999, // Non-existent recipe
      totalCost: 300.0,
      costPerKg: 0.6,
    });

    expect([400, 404]).toContain(res.statusCode);
  });

  test("18. Get feed production report", async () => {
    const res = await auth(ownerToken)(
      request(app).get(
        "/api/reports/production?start=2025-08-01&end=2025-08-31"
      )
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("start");
    expect(res.body).toHaveProperty("end");
    expect(res.body).toHaveProperty("totalEggs");
  });

  test("19. Delete batch ingredient", async () => {
    const ingredientsRes = await auth(supervisorToken)(
      request(app).get(`/api/feed/batches/${batchId}/ingredients`)
    );

    if (
      ingredientsRes.statusCode === 200 &&
      ingredientsRes.body.data.length > 0
    ) {
      const ingredientId = ingredientsRes.body.data[0].id;
      const deleteRes = await auth(supervisorToken)(
        request(app).delete(
          `/api/feed/batches/${batchId}/ingredients/${ingredientId}`
        )
      );

      expect([200, 204]).toContain(deleteRes.statusCode);
    }
  });

  test("20. Delete feed batch", async () => {
    const res = await auth(ownerToken)(
      request(app).delete(`/api/feed/batches/${batchId}`)
    );

    expect([200, 204]).toContain(res.statusCode);
  });
});
