const mongoose = require("./dbConnect");

const ProductSchema = mongoose.Schema(
  {
    price: Number,
    quantity: Number,
    color: String,
    size: String,
    thumb: String,
    createDate: Date,
    updateDate: Date,
  },
  { collection: "product" }
);

const ProductModel = mongoose.model("product", ProductSchema);

module.exports = ProductModel;
