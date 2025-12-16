const express = require("express");
const passport = require("./config/passport.js");
const { swaggerSpec, swaggerUi } = require("../swagger/swagger.js");
const errorHandler = require("./middlewares/error-handler");

const app = express();

app.use(passport.initialize());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
    );
  });

  next();
});

const router = require("express").Router();

router.use("/", require("./routes/health.route"));
router.use("/auth", require("./routes/auth.route.js"));
router.use("/users", require("./routes/user.route.js"));
router.use("/books", require("./routes/book.route.js"));
router.use("/", require("./routes/favorite.route.js"));
router.use("/cart", require("./routes/cart.route.js"));
router.use("/orders", require("./routes/order.route.js"));
router.use("/", require("./routes/review.route.js"));
router.use("/", require("./routes/comment.route.js"));
router.use("/coupons", require("./routes/coupon.route.js"));

app.get("/", (req, res) => {
  res.send("Welcome on the bookstore API");
});

app.use("/", router);

app.use(errorHandler);

module.exports = app;
