const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },
    last_name: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },
    birth_date: {
      type: Date,
      required: function () {
        return this.provider === "local";
      },
    },
    email: {
      type: String,
      required: [true, "Enter an email"],
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
      select: false,
    },
    gender: {
      type: String,
      enum: ["female", "male", "other"],
    },
    is_admin: {
      type: Boolean,
      required: true,
      default: false,
    },
    address: {
      type: String,
    },
    phone_number: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },

    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
    provider: {
      type: String,
      enum: ["local", "google", "firebase"],
      default: "local",
    },
    provider_id: String,
  },
  {
    timestamps: true,
  }
);
userModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const user = mongoose.model("user", userModel);
module.exports = user;
