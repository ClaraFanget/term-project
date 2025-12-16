const CartItem = require("../models/cart-item.model");

const recalculateCartTotal = async (cartId) => {
  const items = await CartItem.find({ cart_id: cartId }).populate("book_id");

  const total = items.reduce((sum, item) => {
    return sum + item.book_id.price * item.quantity;
  }, 0);

  return total;
};

module.exports = { recalculateCartTotal };
