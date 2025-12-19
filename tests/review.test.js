const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Book = require("../src/models/book.model");
const Review = require("../src/models/review.model");

describe("REVIEW API", () => {
  let user;
  let userToken;
  let book;
  const password = "Password123!";

  beforeEach(async () => {
    // Create user
    user = await User.create({
      first_name: "Alice",
      last_name: "Martin",
      email: "review@test.com",
      password,
      phone_number: "0600000003",
      birth_date: "2000-01-01",
      is_active: true,
    });

    // Login
    const loginRes = await request(app).post("/auth/login").send({
      email: "review@test.com",
      password,
    });

    userToken = loginRes.body.accessToken;

    // Create book
    book = await Book.create({
      title: "1984",
      author: "George Orwell",
      publication_date: new Date("1949-01-01"),
      literary_genre: "fantasy",
      summary: "Fantasy novel",
      publisher: "Secker & Warburg",
      price: 15,
      isbn: "9780451524935",
    });
  });

  // ============================
  // CREATE REVIEW – SUCCESS
  // ============================
  it("POST /books/:id/reviews → create review for a book", async () => {
    const res = await request(app)
      .post(`/books/${book._id}/reviews`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: 5,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Review successfully created");
    expect(res.body.data).toHaveProperty("user_id");
    expect(res.body.data).toHaveProperty("book_id");
    expect(res.body.data.rating).toBe(5);
  });
});
