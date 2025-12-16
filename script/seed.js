// seed/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Import de tes modèles
const User = require("../src/models/user.model.js");
const Book = require("../src/models/book.model.js");
const Review = require("../src/models/review.model.js");
const Order = require("../src/models/order.model.js");
const Comment = require("../src/models/comment.model.js");

// ----------------------
// Helpers
// ----------------------

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Données d’exemple
const firstNames = [
  "Alice",
  "Bob",
  "Clara",
  "David",
  "Emma",
  "Lucas",
  "Mia",
  "Hugo",
  "Léa",
  "Nina",
];
const lastNames = [
  "Martin",
  "Durand",
  "Bernard",
  "Dupont",
  "Leroy",
  "Morel",
  "Roux",
  "Fournier",
];
const genres = [
  "fantasy",
  "horror",
  "mystery",
  "romance",
  "science fiction",
  "dystopian",
  "biography",
  "drama",
  "fable",
  "poetry",
  "historical",
];
const sentences = [
  "Excellent livre !",
  "Très bonne lecture !",
  "Un peu long mais intéressant.",
  "Je recommande.",
  "J’ai adoré du début à la fin.",
  "Pas à mon goût.",
];

const status = ["ordered", "in preparation", "shipped", "received"];

// ----------------------
// Génération des données
// ----------------------

const generateUsers = async (count = 50) => {
  const users = [];

  const adminPasswordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  users.push({
    first_name: "Admin",
    last_name: "Root",
    email: "admin@test.com",
    password: adminPasswordHash,
    is_admin: true,
    birth_date: "1990-01-01",
    phone_number: "0600000000",
  });

  for (let i = 0; i < count; i++) {
    const passwordHash = await bcrypt.hash("password123", 10);

    users.push({
      first_name: randomItem(firstNames),
      last_name: randomItem(lastNames),
      email: `user${i}@test.com`,
      password: passwordHash,
      is_admin: false,
      birth_date: "2000-01-01",
      phone_number: "06" + Math.floor(10000000 + Math.random() * 89999999),
    });
  }
  return User.insertMany(users);
};

const generateBooks = async (count = 50) => {
  const books = [];

  for (let i = 0; i < count; i++) {
    books.push({
      title: `Book ${i}`,
      author: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
      literary_genre: randomItem(genres),
      publication_date: randomInt(1950, 2023),
      publisher: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
      price: randomInt(10, 40),
      isbn: "0" + Math.floor(10000000 + Math.random() * 89999999),
      summary: "Lorem ipsum description",
    });
  }
  return Book.insertMany(books);
};

const generateReviews = async (users, books, count = 50) => {
  const reviews = [];

  for (let i = 0; i < count; i++) {
    reviews.push({
      user_id: randomItem(users)._id,
      book_id: randomItem(books)._id,
      rating: randomInt(1, 5),
    });
  }
  return Review.insertMany(reviews);
};

const generateComments = async (users, review, count = 50) => {
  const comments = [];

  for (let i = 0; i < count; i++) {
    comments.push({
      user_id: randomItem(users)._id,
      review_id: randomItem(review)._id,
      comment: randomItem(sentences),
    });
  }
  return Comment.insertMany(comments);
};

const generateOrders = async (users, books, count = 50) => {
  const orders = [];

  for (let i = 0; i < count; i++) {
    const randomUser = randomItem(users);
    const randomBook = randomItem(books);

    orders.push({
      user_id: randomUser._id,
      items: [
        {
          book_id: randomBook._id,
          quantity: randomInt(1, 3),
          price: randomBook.price,
        },
      ],
      total_amount: randomBook.price * randomInt(1, 3),
      status: randomItem(status),
      created_at: new Date(),
    });
  }

  return Order.insertMany(orders);
};

// ----------------------
// SEED MAIN
// ----------------------

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // Reset DB
    await User.deleteMany({});
    await Book.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});
    await Comment.deleteMany({});
    console.log("Database cleared.");

    // Generate data
    const users = await generateUsers(50);
    const books = await generateBooks(50);
    const reviews = await generateReviews(users, books, 50);
    const orders = await generateOrders(users, books, 50);
    const comments = await generateComments(users, reviews, 50);

    console.log("Seed complete!");
    console.log(`Users: ${users.length}`);
    console.log(`Books: ${books.length}`);
    console.log(`Reviews: ${reviews.length}`);
    console.log(`Orders: ${orders.length}`);
    console.log(`Comments: ${comments.length}`);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();
