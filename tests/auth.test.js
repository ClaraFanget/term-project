const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");

describe("AUTH API", () => {
  const userPassword = "Password123!";
  const adminPassword = "Admin123!";

  // ============================
  // LOGIN SUCCESS
  // ============================
  it("POST /auth/login → success with valid credentials", async () => {
    await User.create({
      phone_number: "0782237789",
      birth_date: "2002-12-21",
      last_name: "Fng",
      first_name: "Clara",
      email: "user@test.com",
      password: userPassword,
      is_admin: false,
      is_active: true,
    });

    const res = await request(app).post("/auth/login").send({
      email: "user@test.com",
      password: userPassword,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Login successful");
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    expect(res.body.data.email).toBe("user@test.com");
  });

  // ============================
  // LOGIN FAIL – WRONG PASSWORD
  // ============================
  it("POST /auth/login → fail with wrong password", async () => {
    await User.create({
      phone_number: "0782237789",
      birth_date: "2002-12-21",
      last_name: "Fng",
      first_name: "Clara",
      email: "user@test.com",
      password: userPassword,
      is_admin: false,
      is_active: true,
    });

    const res = await request(app).post("/auth/login").send({
      email: "user@test.com",
      password: "WrongPassword",
    });

    expect(res.statusCode).toBe(401);
  });

  // ============================
  // LOGIN FAIL – USER NOT FOUND
  // ============================
  it("POST /auth/login → fail if user does not exist", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "ghost@test.com",
      password: userPassword,
    });

    expect(res.statusCode).toBe(404);
  });

  // ============================
  // ACCESS PROTECTED ROUTE – NO TOKEN
  // ============================
  it("GET /users/me → fail without token", async () => {
    const res = await request(app).get("/users/me");

    expect(res.statusCode).toBe(401);
  });

  // ============================
  // ACCESS PROTECTED ROUTE – WITH TOKEN
  // ============================
  it("GET /users/me → success with valid token", async () => {
    await User.create({
      phone_number: "0782237789",
      birth_date: "2002-12-21",
      last_name: "Fng",
      first_name: "Clara",
      email: "user@test.com",
      password: userPassword,
      is_admin: false,
      is_active: true,
    });

    const loginRes = await request(app).post("/auth/login").send({
      email: "user@test.com",
      password: userPassword,
    });

    const token = loginRes.body.accessToken;

    const res = await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("email", "user@test.com");
  });

  // ============================
  // ADMIN ROLE ACCESS
  // ============================
  it("ADMIN route → fail if user role is USER", async () => {
    await User.create({
      phone_number: "0782237789",
      birth_date: "2002-12-21",
      last_name: "Fng",
      first_name: "Clara",
      email: "user@test.com",
      password: userPassword,
      is_admin: false,
      is_active: true,
    });

    const loginRes = await request(app).post("/auth/login").send({
      email: "user@test.com",
      password: userPassword,
    });

    const token = loginRes.body.accessToken;

    const res = await request(app)
      .get("/users") // route admin-only
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });

  // ============================
  // ADMIN ROLE ACCESS – SUCCESS
  // ============================
  it("ADMIN route → success with ADMIN role", async () => {
    await User.create({
      phone_number: "0782237789",
      birth_date: "2002-12-21",
      last_name: "Fng",
      first_name: "Clara",
      email: "admin@test.com",
      password: adminPassword,
      is_admin: true,
      is_active: true,
    });

    const loginRes = await request(app).post("/auth/login").send({
      email: "admin@test.com",
      password: adminPassword,
    });

    const token = loginRes.body.accessToken;

    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
