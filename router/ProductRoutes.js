const express = require("express");
const router = express.Router();
const path = require("path");
const UserModel = require("../model/userModel");
const CartModel = require("../model/cartModel");
const BrandModel = require("../model/brandModel");
const CategoryModel = require("../model/categoryModel");
const ProductModel = require("../model/productModel");
const ProductCodeModel = require("../model/productCodeModel");
const cookieParser = require("cookie-parser");

router.get("/:id", (req, res) => {
  try {
    res.render("pages/item-view", { id: req.params.id });
  } catch (err) {
    res.json({
      mess: "loi server",
      status: 500,
      err,
    });
  }
});

router.post("/:productID", async (req, res) => {
  try {
    let data = await ProductCodeModel.findOne({
      _id: req.params.productID,
    })
      .populate("categoryID")
      .populate("productID")
      .populate("brand");
    res.json({
      mess: "lay data thanh cong",
      data,
      status: 200,
    });
  } catch (err) {
    res.json({
      mess: "loi server",
      data: err,
      status: 500,
    });
    console.log(err);
  }
});

router.post("/related/:categoryID", async (req, res) => {
  try {
    let data = await ProductCodeModel.find({
      categoryID: req.params.categoryID,
    })
      .limit(20)
      .populate("productID");
    res.json({
      mess: "lay data thanh cong",
      data: data,
      status: 200,
    });
  } catch (err) {
    res.json({
      mess: "loi server",
      err: "err",
      status: 500,
    });
  }
});

module.exports = router;
