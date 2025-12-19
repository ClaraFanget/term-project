const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Book = require("../src/models/book.model");
const Favorite = require("../src/models/favorite.model");

describe("FAVORITE API", () => {
  let userToken;
  let user;
  let book;
  const userPassword = "Password123!";

  beforeEach(async () => {
    user = await User.create({
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

    userToken = loginRes.body.accessToken;

    book = await Book.create({
      title: "Dune",
      author: "Frank Herbert",
      publication_date: new Date("1965-01-01"),
      literary_genre: "science fiction",
      summary: "Epic science fiction novel",
      publisher: "Chilton Books",
      price: 25,
      isbn: "9780441172719",
    });
  });

  // ============================
  // ADD FAVORITE – SUCCESS
  // ============================
  it("POST /:id/favorite → add book to favorites", async () => {
    const res = await request(app)
      .post(`/${book._id}/favorite`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Book added to favorites");
  });

  // ============================
  // ADD FAVORITE – INVALID BOOK ID
  // ============================
  it("POST /:id/favorite → fail if bookId is invalid", async () => {
    const res = await request(app)
      .post("/invalid-id/favorite")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("fail");
    expect(res.body.message).toBe("Invalid bookId");
  });

  // ============================
  // GET FAVORITES – SUCCESS
  // ============================
  it("GET /users/me/favorites → retrieve my favorites", async () => {
    await Favorite.create({
      user_id: user._id,
      book_id: book._id,
    });

    const res = await request(app)
      .get("/users/me/favorites")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.data.content)).toBe(true);
    expect(res.body.data.content.length).toBe(1);
    expect(res.body.data.content[0]).toHaveProperty("book_id");
  });

  // ============================
  // REMOVE FAVORITE – SUCCESS
  // ============================
  it("DELETE /:id/favorite → remove favorite", async () => {
    const favorite = await Favorite.create({
      user_id: user._id,
      book_id: book._id,
    });

    const res = await request(app)
      .delete(`/${favorite._id}/favorite`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Favorite removed");
  });

  // ============================
  // REMOVE FAVORITE – NOT FOUND
  // ============================
  it("DELETE /:id/favorites → fail if favorite not found", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const res = await request(app)
      .delete(`/${fakeId}/favorites`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(404);
  });

  // ============================
  // GET FAVORITES – EMPTY LIST
  // ============================
  it("GET /users/me/favorites → return empty list if no favorites", async () => {
    const res = await request(app)
      .get("/users/me/favorites")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.content.length).toBe(0);
  });
});
