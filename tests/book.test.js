const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Book = require("../src/models/book.model");

describe("BOOK API", () => {
  let adminToken;
  let adminUser;

  beforeEach(async () => {
    adminUser = await User.create({
      first_name: "Admin",
      last_name: "User",
      birth_date: new Date("1990-01-01"),
      email: "admin@test.com",
      password: "Admin123!",
      phone_number: Math.random().toString().slice(2, 12),
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
  // CREATE BOOK – ADMIN
  // ============================
  it("POST /books → create book (admin only)", async () => {
    const res = await request(app)
      .post("/books")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        publication_date: new Date("1925-04-10"),
        literary_genre: "historical",
        summary: "A novel set in the Jazz Age",
        publisher: "Scribner",
        price: 19.99,
        isbn: "9780192633361",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Book successfully created");
    expect(res.body.data).toHaveProperty("title", "The Great Gatsby");
  });

  // ============================
  // GET ALL BOOKS – PUBLIC
  // ============================
  it("GET /books → retrieve all books", async () => {
    await Book.create({
      title: "Dune",
      author: "Frank Herbert",
      publication_date: new Date("1965-01-01"),
      literary_genre: "science fiction",
      summary: "Epic science fiction novel",
      publisher: "Chilton Books",
      price: 25,
      isbn: "9780441172719",
    });

    const res = await request(app).get("/books");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.data.content)).toBe(true);
    expect(res.body.data.content.length).toBe(1);
  });

  // ============================
  // GET SINGLE BOOK – SUCCESS
  // ============================
  it("GET /books/:id → retrieve a single book", async () => {
    const book = await Book.create({
      title: "1984",
      author: "George Orwell",
      publication_date: new Date("1949-06-08"),
      literary_genre: "dystopian",
      summary: "Dystopian novel",
      publisher: "Secker & Warburg",
      price: 15,
      isbn: "9780451524935",
    });

    const res = await request(app).get(`/books/${book._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("title", "1984");
  });

  // ============================
  // GET SINGLE BOOK – NOT FOUND
  // ============================
  it("GET /books/:id → fail if book not found", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const res = await request(app).get(`/books/${fakeId}`);

    expect(res.statusCode).toBe(404);
  });

  // ============================
  // UPDATE BOOK – ADMIN
  // ============================
  it("PATCH /books/:id → update book (admin only)", async () => {
    const book = await Book.create({
      title: "Old Title",
      author: "Author",
      publication_date: new Date("2000-01-01"),
      literary_genre: "drama",
      summary: "Old summary",
      publisher: "Publisher",
      price: 10,
      isbn: "9780000000001",
    });

    const res = await request(app)
      .patch(`/books/${book._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "New Title",
        price: 20,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.title).toBe("New Title");
    expect(res.body.data.price).toBe(20);
  });

  // ============================
  // UPDATE BOOK – NOT FOUND
  // ============================
  it("PATCH /books/:id → fail if book not found", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const res = await request(app)
      .patch(`/books/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Does not exist" });

    expect(res.statusCode).toBe(404);
  });

  // ============================
  // DELETE BOOK – ADMIN
  // ============================
  it("DELETE /books/:id → delete book (admin only)", async () => {
    const book = await Book.create({
      title: "To Delete",
      author: "Author",
      publication_date: new Date("2010-01-01"),
      literary_genre: "drama",
      summary: "Delete me",
      publisher: "Publisher",
      price: 12,
      isbn: "9780000000002",
    });

    const res = await request(app)
      .delete(`/books/${book._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Book successfully deleted");
  });
});
