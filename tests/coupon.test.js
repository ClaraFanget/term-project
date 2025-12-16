const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Coupon = require("../src/models/coupon.model");

describe("COUPON API", () => {
  let adminToken;
  let adminUser;

  beforeEach(async () => {
    adminUser = await User.create({
      first_name: "Admin",
      last_name: "User",
      birth_date: new Date("1990-01-01"),
      email: "admin@test.com",
      password: "Admin123!",
      phone_number: "0600000001",
      is_admin: true,
      is_active: true,
    });

    const loginRes = await request(app).post("/auth/login").send({
      email: "admin@test.com",
      password: "Admin123!",
    });

    adminToken = loginRes.body.accessToken;
  });

  // ============================
  // CREATE COUPON – SUCCESS
  // ============================
  it("POST /coupons → create coupon (ADMIN)", async () => {
    const res = await request(app)
      .post("/coupons")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        code: "PROMO10",
        discount_rate: 10,
        start_at: new Date("2025-01-01"),
        end_at: new Date("2025-12-31"),
        is_valid: true,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Coupon successfully created");
    expect(res.body.data).toHaveProperty("code", "PROMO10");
    expect(res.body.data).toHaveProperty("created_by");
  });

  // ============================
  // GET COUPONS – SUCCESS
  // ============================
  it("GET /coupons → retrieve all coupons", async () => {
    await Coupon.create({
      created_by: adminUser._id,
      code: "PROMO20",
      discount_rate: 20,
      start_at: new Date("2025-01-01"),
      end_at: new Date("2025-12-31"),
      is_valid: true,
    });

    const res = await request(app)
      .get("/coupons")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.data.content)).toBe(true);
    expect(res.body.data.content.length).toBe(1);
    expect(res.body.data.content[0]).toHaveProperty("code", "PROMO20");
  });

  // ============================
  // UPDATE COUPON – SUCCESS
  // ============================
  it("PATCH /coupons/:id → update coupon", async () => {
    const coupon = await Coupon.create({
      created_by: adminUser._id,
      code: "PROMO30",
      discount_rate: 30,
      start_at: new Date("2025-01-01"),
      end_at: new Date("2025-12-31"),
      is_valid: true,
    });

    const res = await request(app)
      .patch(`/coupons/${coupon._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        discount_rate: 50,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Coupon successfully updated");
    expect(res.body.data.discount_rate).toBe(50);
  });

  // ============================
  // UPDATE COUPON – NOT FOUND
  // ============================
  it("PATCH /coupons/:id → fail if coupon not found", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const res = await request(app)
      .patch(`/coupons/${fakeId}`) // ✅ PATCH
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ discount_rate: 50 });

    expect(res.statusCode).toBe(404);
  });

  // ============================
  // DELETE COUPON – SUCCESS
  // ============================
  it("DELETE /coupons/:id → delete coupon", async () => {
    const coupon = await Coupon.create({
      created_by: adminUser._id,
      code: "PROMO40",
      discount_rate: 40,
      start_at: new Date("2025-01-01"),
      end_at: new Date("2025-12-31"),
      is_valid: true,
    });

    const res = await request(app)
      .delete(`/coupons/${coupon._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Coupon successfully deleted");
  });

  // ============================
  // DELETE COUPON – NOT FOUND
  // ============================
  it("DELETE /coupons/:id → fail if coupon not found", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const res = await request(app)
      .delete(`/coupons/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });
});
