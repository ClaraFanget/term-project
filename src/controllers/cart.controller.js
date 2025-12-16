const Cart = require("../models/cart.model.js");
const Book = require("../models/book.model.js");
const CartItem = require("../models/cart-item.model.js");
const errorCodes = require("../utils/error-codes");
const errorResponse = require("../utils/error-response");
const paginatedResponse = require("../utils/paginated-response");

const getCart = async (req, res) => {
  try {
    const { page, size, offset, sortField, sortDirection } = req.listQuery;

    const cart = await Cart.findOne({ user_id: req.user.id });

    if (!cart) {
      return res.status(200).json({
        status: "success",
        message: "Cart successfully retrieved",
        data: {
          cart: null,
          items: paginatedResponse({
            content: [],
            page,
            size,
            totalElements: 0,
            sortField,
            sortDirection,
          }),
        },
      });
    }

    const query = { cart_id: cart._id };

    const totalElements = await CartItem.countDocuments(query);

    const items = await CartItem.find(query)
      .populate("book_id")
      .sort({ [sortField]: sortDirection === "ASC" ? 1 : -1 })
      .skip(offset)
      .limit(size);

    res.status(200).json({
      status: "success",
      message: "Cart successfully retrieved",
      data: {
        cart,
        items: paginatedResponse({
          content: items,
          page,
          size,
          totalElements,
          sortField,
          sortDirection,
        }),
      },
    });
  } catch (error) {
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const addCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user_id: req.user.id,
        total_amount: 0,
      });
    }

    const item = await CartItem.create({
      cart_id: cart._id,
      book_id: req.body.book_id,
      quantity: req.body.quantity,
    });

    const book = await Book.findById(req.body.book_id);
    if (!book) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Book not found"));
    }

    const totalAmount = cart.total_amount + book.price * req.body.quantity;

    await Cart.findByIdAndUpdate(cart._id, { total_amount: totalAmount });

    res.status(201).json({
      status: "success",
      message: "Item added to cart",
      data: item,
    });
  } catch (error) {
    console.error(error);
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    const item = await CartItem.findById(req.params.itemId);
    if (!item) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Cart item not found"));
    }

    const book = await Book.findById(item.book_id);
    if (!book) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Book not found"));
    }

    const cart = await Cart.findById(item.cart_id);
    if (!cart) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Cart not found"));
    }

    const oldTotal = book.price * item.quantity;
    const newTotal = book.price * quantity;
    const totalAmount = cart.total_amount - oldTotal + newTotal;

    item.quantity = quantity;
    await item.save();

    await Cart.findByIdAndUpdate(cart._id, { total_amount: totalAmount });

    res.status(200).json({
      status: "success",
      message: "Cart item successfully updated",
      data: item,
      total_amount: totalAmount,
    });
  } catch (error) {
    console.error(error);
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const item = await CartItem.findById(req.params.itemId);
    if (!item) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Cart item not found"));
    }

    const book = await Book.findById(item.book_id);
    if (!book) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Book not found"));
    }

    const cart = await Cart.findById(item.cart_id);
    if (!cart) {
      const err = errorCodes.NOT_FOUND;
      return res
        .status(err.status)
        .json(errorResponse(req, err, null, "Cart not found"));
    }

    const totalAmount = cart.total_amount - book.price * item.quantity;

    await CartItem.findByIdAndDelete(item._id);

    await Cart.findByIdAndUpdate(cart._id, { total_amount: totalAmount });

    res.status(200).json({
      status: "success",
      message: "Item removed from cart",
      total_amount: totalAmount,
    });
  } catch (error) {
    console.error(error);
    const err = errorCodes.INTERNAL_ERROR;
    return res.status(err.status).json(errorResponse(req, err));
  }
};

module.exports = {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
};
