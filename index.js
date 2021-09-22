const mongoose = require('./model/dbConnect');
const express = require("express");
const path = require("path");
// const UserModel = require("./model/userModel");
// const CartModel = require("./model/cartModel");
// const BrandModel = require("./model/brandModel");
// const CategoryModel = require("./model/categoryModel");
// const ProductModel = require("./model/productModel");
// const ProductCodeModel = require("./model/productCodeModel");
const cookieParser = require("cookie-parser");
const userRouter = require("./routers/userRouter");
const cpanelRouter = require("./routers/cpanelRouter");
const categoryRouter = require("./routers/categoryRouter");
const brandRouter = require("./routers/brandRouter");
const productRouter = require("./routers/productRouter");
const orderRouter = require("./routers/orderRouter");
const statisticRouter = require("./routers/statisticRouter");
const { getUserInfo } = require("./middleWare/checkAuth");
const CategoryModel = require("./model/categoryModel");
const BrandModel = require("./model/brandModel");
const ProductCodeModel = require("./model/productCodeModel");

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
app.use("/statistic", statisticRouter);
app.use("/public", express.static(path.join(__dirname, "./public")));

app.get("/", getUserInfo, (req, res) => {
  res.render("pages/index", { login_info: req.login_info });
});

app.get("/login", getUserInfo, (req, res) => {
  res.render("pages/login", { login_info: req.login_info });
});

app.get("/logon", getUserInfo, (req, res) => {
  res.render("pages/logon", { login_info: req.login_info });
});

app.get("/all-product", getUserInfo, (req, res) => {
  res.render("pages/all-product", {
    login_info: req.login_info,
    isSimilar: false,
    page: req.query.page
  });
});

app.get("/similar-product/:id", getUserInfo, async (req, res) => {
  try {
    let product = await ProductCodeModel.aggregate([
      {
        $match: {_id: mongoose.Types.ObjectId(req.params.id)}
      },
      { $lookup: {
        from: "product",
        foreignField: "_id",
        localField: "productID",
        as: "productID"
      }},
      { $lookup: {
        from: "category",
        foreignField: "_id",
        localField: "categoryID",
        as: "categoryID"
      }},
      { $lookup: {
        from: "brand",
        foreignField: "_id",
        localField: "brand",
        as: "brand"
      }},
      {
        $project: {
          _id: 1,
          productName: 1,
          listImg: 1,
          productID: 1, 
          categoryID: 1,
          brand: 1,
          min: {$min: "$productID.price"},
          max: {$max: "$productID.price"},
          createDate: 1,
        }
      }
    ]);

    if(product.length > 0) {
      res.render("pages/all-product", { 
        login_info: req.login_info,
        isSimilar: true,
        product: product[0],
        page: req.query.page
      });
    }else{
      res.render("pages/cpanel/not-found", {
          name: "Không tìm thấy trang",
          isHome: true
      });
    }
  } catch (error) {
    res.render("pages/cpanel/not-found", {
        name: "Không tìm thấy trang",
        isHome: true
    });
  }
});

app.get("/category-view/:id", getUserInfo, async (req, res) => {
  try {
    let category = await CategoryModel.findOne({_id: req.params.id});
    if(category){
        let brand = await BrandModel.find({}).sort({brandName: 1});
        let brand_query = req.query.brand? (req.query.brand).split(",") : [];

        res.render("pages/list-product", {
          login_info: req.login_info,
          isCategory: true,
          isBrand: false,
          brand: brand,
          category: category,
          brand_query: brand_query,
          category_query: category._id,
          sort: req.query.sort,
          sortPrice: req.query.sortPrice,
          from: req.query.from,
          to: req.query.to,
          page: req.query.page
        });
    }else{
        res.render("pages/cpanel/not-found", {
            name: "Không tìm thấy trang",
            isHome: true
        });
    }
    
  } catch (error) {
    res.render("pages/cpanel/not-found", {
        name: "Không tìm thấy trang",
        isHome: true
    });
  }
});

app.get("/brand-view/:id", getUserInfo, async (req, res) => {
  try {
    let brand = await BrandModel.findOne({_id: req.params.id});
    if(brand){
        let category = await CategoryModel.find({}).sort({categoryName: 1});
        let category_query = req.query.category? (req.query.category).split(",") : [];

        res.render("pages/list-product", {
          login_info: req.login_info,
          isCategory: false,
          isBrand: true,
          brand: brand,
          category: category,
          brand_query: brand._id,
          category_query: category_query,
          sort: req.query.sort,
          sortPrice: req.query.sortPrice,
          from: req.query.from,
          to: req.query.to,
          page: req.query.page
        });
    }else{
        res.render("pages/cpanel/not-found", {
            name: "Không tìm thấy trang",
            isHome: true
        });
    }
    
  } catch (error) {
    res.render("pages/cpanel/not-found", {
        name: "Không tìm thấy trang",
        isHome: true
    });
  }
});

app.get("/search-result", getUserInfo, async (req, res) => {
  try {
    let query = req.query.q;
    if(query && query.length > 0){
      let brand = await BrandModel.find({}).sort({brandName: 1});
      let category = await CategoryModel.find({}).sort({categoryName: 1});
      let brand_query = req.query.brand? (req.query.brand).split(",") : [];
      let category_query = req.query.category? (req.query.category).split(",") : [];
      res.render("pages/list-product", {
        login_info: req.login_info,
        isCategory: false,
        isBrand: false,
        brand: brand,
        category: category,
        query: req.query.q,
        brand_query: brand_query,
        category_query: category_query,
        sort: req.query.sort,
        sortPrice: req.query.sortPrice,
        from: req.query.from,
        to: req.query.to,
        page: req.query.page
      });
    }else{
      res.render("pages/cpanel/not-found", {
        name: "Không tìm thấy trang",
        isHome: true
      });
    }
  } catch (error) {
    res.render("pages/cpanel/not-found", {
      name: "Không tìm thấy trang",
      isHome: true
    });
  }
});

app.listen(process.env.PORT || 3000);
