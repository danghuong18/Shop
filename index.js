const express = require("express");
const path = require("path");
const UserModel = require("./model/userModel");
const CartModel = require("./model/cartModel");
const BrandModel = require("./model/brandModel");
const CategoryModel = require("./model/categoryModel");
const ProductModel = require("./model/productModel");
const ProductCodeModel = require("./model/productCodeModel");
const cookieParser = require("cookie-parser");
const userRouter = require("./routers/userRouter");
const cpanelRouter = require("./routers/cpanelRouter");

const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/user/", userRouter);
app.use("/cpanel", cpanelRouter);
app.use("/public", express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.get("/login", (req, res) => {
  res.render("pages/login");
});

app.get("/logon", (req, res) => {
  res.render("pages/logon");
});

app.listen(process.env.PORT || 3000);
