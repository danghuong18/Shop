const router = require("express").Router();
// const UserModel = require("../model/userModel");
const CategoryModel = require("../model/categoryModel");
const BrandModel = require("../model/brandModel");
// const BlackListModel = require("../model/blackListModel");
const { checkLogin, checkAdminLogin } = require("../middleWare/checkAuth");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const ProductCodeModel = require("../model/productCodeModel");

// app.set("view engine", "ejs");

router.get("/", checkAdminLogin, (req, res)=>{
    res.render("pages/cpanel/index", {
        login_info: req.login_info
    });
});

router.get("/user", checkAdminLogin, (req, res)=>{
    res.render("pages/cpanel/user", {
        name: "Danh sách thành viên",
        login_info: req.login_info
    });
});

router.get("/user/profile", checkAdminLogin, (req, res)=>{
    res.render("pages/cpanel/edit-profile", {
        name: "Update thông tin cá nhân",
        login_info: req.login_info
    });
});

router.get("/category", checkAdminLogin, (req, res)=>{
    res.render("pages/cpanel/category", {
        name: "Danh mục",
        login_info: req.login_info
    });
});

router.get("/brand", checkAdminLogin, (req, res)=>{
    res.render("pages/cpanel/brand", {
        name: "Thương hiệu",
        login_info: req.login_info
    });
});

router.get("/product", checkAdminLogin, (req, res)=>{
    res.render("pages/cpanel/product", {
        name: "Danh sách sản phẩm",
        login_info: req.login_info
    });
});

router.get("/product/create", checkAdminLogin, async (req, res)=>{
    let categories = await CategoryModel.find({}).sort({categoryName: 1});
    let brands = await BrandModel.find({}).sort({brandName: 1});
    res.render("pages/cpanel/ce-product", {
        isEdit: false,
        name: "Tạo sản phẩm",
        login_info: req.login_info,
        categories: categories,
        brands: brands
    });
});

router.get("/product/:id", checkAdminLogin, async (req, res)=>{
    try {
        let product = await ProductCodeModel.findOne({_id: req.params.id});
        
        if(product){
            let categories = await CategoryModel.find({}).sort({categoryName: 1});
            let brands = await BrandModel.find({}).sort({brandName: 1});
            res.render("pages/cpanel/ce-product", {
                isEdit: true,
                name: "Sửa sản phẩm",
                login_info: req.login_info,
                categories: categories,
                brands: brands,
                product: product
            });
        }else{
            res.render("pages/cpanel/not-found", {
                name: "Không tìm thấy trang"
            });
        }
        
    } catch (error) {
        res.render("pages/cpanel/not-found", {
            name: "Không tìm thấy trang"
        });
    }
});

router.get("/order", checkAdminLogin, (req, res)=>{
    res.render("pages/cpanel/order", {
        name: "Quản lý đơn hàng",
        login_info: req.login_info
    });
});

router.get("/search", checkLogin, async (req, res)=>{
    if(req.role === "admin"){
        try {
            let result = {};
            let query = req.query.q;
            // let search = await ProductCodeModel.find({productName: { $regex : query, $options : 'i' }});
            let search = await ProductCodeModel.find({$text: {$search: query}}).populate("brand", "brandName").limit(5);
    
            if(search.length > 0){
                res.json({message: "Successed", status: 200, data: search});
            }else{
                res.json({message: "Không tìm thấy kết quả nào cả.", status: 400});
            }
        } catch (error) {
            res.json({message: "Server error!", status: 500, error});
        }
    }else{
        res.json({message: "Bạn không có quyền ở đây.", status: 400});
    }
});

router.use((req, res)=>{
    res.render("pages/cpanel/not-found", {
        name: "Không tìm thấy trang"
    });
});

module.exports = router;
