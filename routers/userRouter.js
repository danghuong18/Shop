const router = require("express").Router();
const UserModel = require("../model/userModel");
const CartModel = require("../model/cartModel");
const BrandModel = require("../model/brandModel");
const CategoryModel = require("../model/categoryModel");
const ProductModel = require("../model/productModel");
const ProductCodeModel = require("../model/productCodeModel");
const BlackListModel = require("../model/blackListModel");
const { checkLogin } = require("../middleWare/checkAuth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/login", (req, res) => {
  res.render("pages/login");
});

router.get("/logon", (req, res) => {
  res.render("pages/logon");
});

router.get("/cart", (req, res) => {
  res.render("pages/cart");
});

router.post("/", async (req, res) => {
  try {
    if (req.body.username && req.body.password) {
      const checkUsername = await UserModel.findOne({
        username: req.body.username,
      });
      if (checkUsername) {
        res.json({ status: 400, mess: "username da ton tai" });
      } else {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        await UserModel.create(req.body);
        res.json({ status: 200, mess: "tao tai khoan ok" });
      }
    } else {
      res.json({ status: 400, mess: "bad request" });
    }
  } catch (error) {
    res.json({ status: 500, mess: "loi server", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.body.username });
    if (user) {
      const checkPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (checkPassword) {
        const token = jwt.sign({ id: user._id }, "thai");
        res.json({ status: 200, mess: "dang nhap thanh cong", token });
      } else {
        res.json({ status: 400, mess: "sai password" });
      }
    } else {
      res.json({ status: 400, mess: "sai username" });
    }
  } catch (error) {
    res.json({ status: 500, mess: "loi server", error });
  }
});

router.post("/logout", checkLogin, async (req, res) => {
  try {
    const token = req.cookies.cookie;
    await BlackListModel.create({ token });
    res.json({ status: 200, mess: "dang xuat ok" });
  } catch (error) {
    res.json({ status: 500, mess: "loi server", error });
  }
});

router.post("/checkLogin", checkLogin, (req, res) => {
  res.json({ status: 200, mess: "da dang nhap" });
});

router.post("/addcart", checkLogin, async (req, res) => {
  try {
    let token = req.cookies.cookie;
    let userID = jwt.verify(token, "thai").id;
    let productID = req.body.productID;
    let cartID = await UserModel.findOne({ _id: userID }).populate("cartID");
    cartID = cartID.cartID._id;
    let quantity = parseInt(req.body.quantity);
    let data = await ProductModel.findOne({ _id: productID });
    let left = data.quantity;
    let oldItem = await CartModel.findOne({
      _id: cartID,
      listProduct: { $elemMatch: { productID: productID } },
    });
    if (quantity > left) {
      res.json({
        status: 400,
        mess: ["Không đủ hàng", "Không đủ hàng, vui lòng nhập lại số lượng"],
        toastr: "error",
      });
    } else if (oldItem) {
      let oldItemQuantity = oldItem.listProduct;
      oldItemQuantity = oldItemQuantity.filter(function (a, b) {
        if (a.productID == productID) {
          return true;
        }
      });
      oldItemQuantity = oldItemQuantity[0].quantity;
      if (oldItemQuantity + quantity <= left) {
        let data = await CartModel.updateOne(
          {
            _id: cartID,
            listProduct: { $elemMatch: { productID: productID } },
          },
          { $inc: { "listProduct.$.quantity": quantity } }
        );
        res.json({
          status: 200,
          data: data,
          mess: ["Đã thêm vào giỏ hàng", "Đổi số lượng sản phẩm thành công"],
          toastr: "success",
        });
      } else {
        res.json({
          status: 400,
          mess: ["Không đủ hàng", "Không đủ hàng, vui lòng nhập lại số lượng"],
          toastr: "error",
        });
      }
    } else {
      data = await CartModel.updateOne(
        { _id: cartID },
        {
          $push: {
            listProduct: {
              productID: productID,
              quantity: quantity,
            },
          },
        }
      );
      res.json({
        status: 200,
        data: data,
        mess: ["Đã thêm vào giỏ hàng", "Đổi số lượng sản phẩm thành công"],
        toastr: "success",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: 500,
      err: err,
      mess: "Lỗi server",
      toastr: "error",
    });
  }
});

router.post("/cart", checkLogin, async function (req, res) {
  try {
    let token = req.cookies.cookie;
    let userID = jwt.verify(token, "thai").id;
    let cart = await UserModel.findOne({ _id: userID }).populate("cartID");
    cart = cart.cartID.listProduct;
    let data = [];
    for (let i = 0; i < cart.length; i++) {
      let push = await ProductModel.findOne({ _id: cart[i].productID });
      push = push.toObject();
      data.push(push);
      let productCode = await ProductCodeModel.findOne({
        productID: { $all: [cart[i].productID] },
      });
      title = productCode.productName;
      let productCodeID = productCode._id;
      data[i].quantity = cart[i].quantity;
      data[i].title = title;
      data[i].productCodeID = productCodeID;
    }
    res.json({
      status: 200,
      data: data,
      mess: "lay data thanh cong",
    });
  } catch (err) {
    res.json({
      status: 500,
      err: err,
      mess: "Lỗi server",
      toastr: "error",
    });
  }
});

router.delete("/cart/delete", checkLogin, async function (req, res) {
  try {
    let token = req.cookies.cookie;
    let userID = jwt.verify(token, "thai").id;
    let productID = req.body.productID;
    let cartID = await UserModel.findOne({ _id: userID });
    cartID = cartID.cartID;
    console.log(cartID);
    let data = await CartModel.updateOne(
      { _id: cartID },
      { $pull: { listProduct: { productID: productID } } }
    );
    res.json({
      status: 200,
      data: data,
      mess: "Xóa sản phẩm thành công",
      toastr: "success",
    });
  } catch (err) {
    res.json({
      status: 500,
      err: err,
      mess: "Lỗi server",
      toastr: "error",
    });
  }
});

module.exports = router;
