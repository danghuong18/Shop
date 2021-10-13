const mongoose = require("./dbConnect");

const SELECTED = [0, 1]

const CartSchema = mongoose.Schema(
  {
    listProduct: [
      {
        productID: {
          type: String,
          ref: "product",
        },
        quantity: Number,
        selected: {
          type: Number,
          enum: SELECTED,
          default: SELECTED[0],
        }
      },
    ],
  },
  { collection: "cart" }
);

const CartModel = mongoose.model("cart", CartSchema);

module.exports = CartModel;
