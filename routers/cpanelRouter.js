const router = require("express").Router();
const UserModel = require("../model/userModel");
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
    res.render("pages/cpanel/category");
});

router.get("/brand", (req, res)=>{
    res.render("pages/cpanel/brand");
});

router.get("/product", (req, res)=>{
    res.render("pages/cpanel/product");
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

router.post("/create", (req, res)=>{

});

// router.post("/", async (req, res) => {
//   try {
//     if (req.body.username && req.body.password) {
//       const checkUsername = await UserModel.findOne({
//         username: req.body.username,
//       });
//       if (checkUsername) {
//         res.json({ status: 400, mess: "username da ton tai" });
//       } else {
//         req.body.password = await bcrypt.hash(req.body.password, 10);
//         await UserModel.create(req.body);
//         res.json({ status: 200, mess: "tao tai khoan ok" });
//       }
//     } else {
//       res.json({ status: 400, mess: "bad request" });
//     }
//   } catch (error) {
//     res.json({ status: 500, mess: "loi server", error });
//   }
// });

module.exports = router;
