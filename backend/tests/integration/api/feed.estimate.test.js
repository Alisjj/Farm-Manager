import request from "supertest";
import app from "../../../testApp.js";

describe("POST /api/feed/batches/estimate", () => {
  test("returns cost estimate for a valid recipe", async () => {
    const payload = {
      recipe: { cornPercent: 50, soybeanPercent: 50 },
      batchSizeKg: 1000,
      ingredientPrices: { corn: 2, soybean: 3 },
    };

    const res = await request(app)
      .post("/api/feed/batches/estimate")
      .send(payload)
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.data).toHaveProperty("totalCost");
  });
});
