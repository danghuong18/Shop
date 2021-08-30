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
app.get("/filter", async (req, res) => {
  try {
    const min = req.query.min;
    const max = req.query.max;
    const brand = req.query.brand;
    const filterInput = {};
    console.log(brand);
    if (brand) {
      let brandList = brand.split(",");
      filterInput.brand = { $in: brandList };
    }

    const filter = await ProductCodeModel.find(filterInput).populate(
      "productID"
    );

    if (max || min) {
      const result = filter.filter((ele) => {
        if (max && min) {
          for (let i = 0; i < ele.productID.length; i++) {
            if (
              ele.productID[i].price >= min &&
              ele.productID[i].price <= max
            ) {
              return true;
            }
          }
        } else if (max) {
          for (let i = 0; i < ele.productID.length; i++) {
            if (ele.productID[i].price <= max) {
              return true;
            }
          }
        } else if (min) {
          for (let i = 0; i < ele.productID.length; i++) {
            if (ele.productID[i].price >= min) {
              return true;
            }
          }
        }
      });
      res.render("pages/filter", { brandList, data: result, brand: brand });
    }
    const brandList = await BrandModel.find();
    console.log(filter[0].productID);
    res.render("pages/filter", { brandList, data: filter, brand: brand });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, error, mess: "server error" });
  }
});

app.listen(process.env.PORT || 3000);
