const router = require("express").Router();
const UserModel = require("../model/userModel");
const CategoryModel = require("../model/categoryModel");
const BrandModel = require("../model/brandModel");
const BlackListModel = require("../model/blackListModel");
const { checkLogin } = require("../middleWare/checkAuth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// app.set("view engine", "ejs");

router.get("/", (req, res)=>{
    res.render("pages/cpanel/index");
});

router.get("/user", (req, res)=>{
    res.render("pages/cpanel/user");
});

router.get("/category", (req, res)=>{
    res.render("pages/cpanel/category", {
        name: "Danh mục"
    });
});

router.get("/brand", (req, res)=>{
    res.render("pages/cpanel/brand", {
        name: "Thương hiệu"
    });
});

router.get("/product", (req, res)=>{
    res.render("pages/cpanel/product", {
        name: "Danh sách sản phẩm"
    });
});

router.get("/product/create", async (req, res)=>{
    let categories = await CategoryModel.find({}).sort({categoryName: 1});
    let brands = await BrandModel.find({}).sort({brandName: 1});
    res.render("pages/cpanel/create-product", {
        name: "Tạo sản phẩm",
        categories: categories,
        brands: brands
    });
});

router.get("/product/edit/:id", (req, res)=>{
    res.render("pages/cpanel/edit-product", {
        name: "Sửa sản phẩm"
    });
});

router.get("/classify-product", (req, res)=>{
    res.render("pages/cpanel/classify-product");
});

router.get("/order", (req, res)=>{
    res.render("pages/cpanel/order");
});

router.get("/login", (req, res)=>{
    res.render("pages/cpanel/login");
});

module.exports = router;
