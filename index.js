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
const categoryRouter = require("./routers/categoryRouter");
const brandRouter = require("./routers/brandRouter");
const productRouter = require("./routers/productRouter");
const orderRouter = require("./routers/orderRouter");
const { getUserInfo } = require("./middleWare/checkAuth");

const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/user/", userRouter);
app.use("/cpanel", cpanelRouter);
app.use("/category", categoryRouter);
app.use("/brand", brandRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);
app.use("/public", express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.get("/login", getUserInfo, (req, res) => {
  res.render("pages/login", { login_info: req.login_info });
});

app.get("/logon", getUserInfo, (req, res) => {
  res.render("pages/logon", { login_info: req.login_info });
});

app.listen(process.env.PORT || 3000);
