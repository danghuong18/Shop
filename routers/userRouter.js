const router = require("express").Router();
const UserModel = require("../model/userModel");
const CartModel = require("../model/cartModel");
const BrandModel = require("../model/brandModel");
const CategoryModel = require("../model/categoryModel");
const ProductModel = require("../model/productModel");
const ProductCodeModel = require("../model/productCodeModel");
const BlackListModel = require("../model/blackListModel");
const { checkLogin } = require("../middleWare/checkAuth");
const { getUserInfo } = require("../middleWare/checkAuth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function GetListFile(list_id = []) {
  list_file = [];
  try {
    let items = await UserModel.find({ _id: list_id });
    if (items.length > 0) {
      for (x in items) {
        list_file.push(items[x].avatar);
      }
    }
  } catch (error) {}

  return list_file;
}

function DeleteFile(list_file = []) {
  for (x in list_file) {
    if (fs.existsSync(path.join(__dirname, `..${list_file[x]}`))) {
      fs.unlinkSync(path.join(__dirname, `..${list_file[x]}`));
    }
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/upload"));
  },
  filename: function (req, file, cb) {
    var filetypes = /jpeg|jpg|png|gif/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    } else {
      cb("ErrorType");
    }
  },
});

const upload = multer({ storage: storage });

router.get("/", checkLogin, async (req, res) => {
  if (req.role === "admin") {
    try {
      let sort = req.query.sort;
      let limit = req.query.limit * 1;
      let skip = (req.query.page - 1) * limit;
      let pages = 1;
      let sortby = {};

      if (sort == "name-az") {
        sortby = { fullName: 1 };
      } else if (sort == "name-za") {
        sortby = { fullName: -1 };
      } else if (sort == "username-az") {
        sortby = { username: 1 };
      } else if (sort == "username-za") {
        sortby = { username: -1 };
      } else if (sort == "date-desc") {
        sortby = { createDate: -1 };
      } else if (sort == "date-asc") {
        sortby = { createDate: 1 };
      }

      let users = await UserModel.find({}).skip(skip).limit(limit).sort(sortby);
      let all_users = await UserModel.find({});
      if (all_users.length > 0) {
        pages = Math.ceil(all_users.length / limit);
      }
      if (users.length > 0) {
        res.json({
          message: "Succcessed",
          status: 200,
          data: users,
          pages: pages,
        });
      } else {
        res.json({
          message: "Không có thương hiệu nào để hiển thị cả.",
          status: 400,
        });
      }
    } catch (error) {
      res.json({ message: "Server error!", status: 500, error });
    }
  } else {
    res.json({ message: "Bạn không có quyền ở đây.", status: 400 });
  }
});

router.get("/login", (req, res) => {
  res.render("pages/login");
});

router.get("/logon", (req, res) => {
  res.render("pages/logon");
});

router.get("/cart", getUserInfo, (req, res) => {
  res.render("pages/cart", { login_info: req.login_info });
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

router.post("/loginCpanel", async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.body.username });
    if (user) {
      const checkPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (checkPassword) {
        const token = jwt.sign({ id: user._id }, "thai");

        if (user.role === "admin") {
          const cpanel = jwt.sign({ id: "admin" }, "thai");
          res.json({
            message: "Đăng nhập thành công!",
            status: 200,
            data: { token, cpanel },
          });
        } else {
          res.json({
            message: "Bạn không có quyền đăng nhập ở đây.",
            status: 400,
          });
        }
      } else {
        res.json({
          message: "Bạn đã nhập sai password, mời nhập lại.",
          status: 400,
        });
      }
    } else {
      res.json({
        message: "Username không tồn tại, mời nhập lại.",
        status: 400,
      });
    }
  } catch (error) {
    res.json({ message: "Server error!", status: 500 });
  }
});

router.post("/accessCpanel", checkLogin, function (req, res) {
  try {
    const cpanel = jwt.sign({ id: "admin" }, "thai");
    if (req.role === "admin") {
      res.json({ message: "Truy cập Cpanel thành công!", status: 200, cpanel });
    } else {
      res.json({ message: "Không thể truy cập Cpanel.", status: 400 });
    }
  } catch (error) {
    res.json({ message: "Server error!", status: 500, error });
  }
});

router.post("/setRoleCpanel", checkLogin, async (req, res) => {
  if (req.role === "admin") {
    try {
      let user_id = req.body.user_id;
      let set_role = req.body.set_role;
      let checkUser = await UserModel.findOne({ _id: user_id });
      if (checkUser) {
        if (user_id != req.login_id) {
          let update_role = await UserModel.updateOne(
            { _id: user_id },
            { $set: { role: set_role } }
          );
          if (update_role.ok) {
            res.json({
              message:
                set_role === "admin"
                  ? "Thêm quyền admin thành công!"
                  : "Bỏ quyền admin thành công!",
              status: 200,
            });
          } else {
            res.json({
              message:
                set_role === "admin"
                  ? "Thêm quyền admin không thành công."
                  : "Bỏ quyền admin không thành công.",
              status: 400,
            });
          }
        } else {
          res.json({
            message: "Bạn không thể set quyền của chính mình.",
            status: 400,
          });
        }
      } else {
        res.json({ message: "Không tìm thấy user.", status: 400 });
      }
    } catch (error) {
      res.json({ message: "Server error!", status: 500, error });
    }
  } else {
    res.json({ message: "Bạn không có quyền ở đây.", status: 400 });
  }
});

router.post("/deleteCpanel", checkLogin, async (req, res) => {
  if (req.role === "admin") {
    try {
      let list_user = req.body["list_user[]"];
      if (list_user.includes(req.login_id)) {
        res.json({ message: "Bạn không thể xoá chính mình.", status: 400 });
      } else {
        let list_file = await GetListFile(list_user);

        let delete_item = await UserModel.deleteMany({ _id: list_user });
        if (delete_item.deletedCount > 0) {
          DeleteFile(list_file);
          res.json({ message: "Xoá user thành công!", status: 200 });
        } else {
          res.json({ message: "Không thể xoá user.", status: 400 });
        }
      }
    } catch (error) {
      res.json({ message: "Server error!", status: 500, error });
    }
  } else {
    res.json({ message: "Bạn không có quyền ở đây.", status: 400 });
  }
});

router.post("/editCpanelProfile", checkLogin, async (req, res) => {
  if (req.role === "admin") {
    upload.single("avatar")(req, res, async (err) => {
      if (err) {
        if (err == "ErrorType") {
          res.json({
            message:
              "Hình ảnh tải lên không hỗ trợ, phải là file *.png, *.jpg, *.gif.",
            status: 406,
          });
        } else {
          res.json({
            message: "Lỗi trong quá trình upload hình ảnh.",
            status: 400,
            err,
          });
        }
      } else {
        let avatar = "";

        if (req.file) {
          avatar = "/public/upload/" + req.file.filename;
        }

        try {
          let updateDate = Date();
          let id = req.login_id;
          let fullName = req.body["full-name"];
          let email = req.body.email;
          let phone = req.body.phone;
          let dob = req.body["birth-day"];
          let gender = req.body.gender;
          let list_file = await GetListFile([id]);
          let set_data = {};
          if (req.file) {
            set_data = {
              avatar: avatar,
              fullName: fullName,
              email: email,
              phone: phone,
              DOB: dob,
              gender: gender,
              updateDate: updateDate,
            };
          } else {
            set_data = {
              fullName: fullName,
              email: email,
              phone: phone,
              DOB: dob,
              gender: gender,
              updateDate: updateDate,
            };
          }

          let edit_profile = await UserModel.findOneAndUpdate(
            { _id: id },
            { $set: set_data },
            { returnOriginal: false }
          );

          if (edit_profile) {
            if (req.file) {
              DeleteFile(list_file);
            }
            res.json({
              message: "Sửa profile thành công!",
              status: 200,
              data: edit_profile,
            });
          } else {
            if (req.file) {
              DeleteFile([avatar]);
            }
            res.json({ message: "Không thể sửa profile.", status: 400 });
          }
        } catch (error) {
          if (req.file) {
            DeleteFile([avatar]); //Delete image has uploaded
          }
          res.json({ message: "Server error!", status: 500, error });
        }
      }
    });
  } else {
    res.json({ message: "Bạn không có quyền ở đây.", status: 400 });
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
    res.json({
      status: 500,
      err: err,
      mess: "loi server",
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
      mess: "loi server",
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
      mess: "loi server",
    });
  }
});

module.exports = router;
