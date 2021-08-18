const router = require("express").Router();
const UserModel = require("../model/userModel");
const BlackListModel = require("../model/blackListModel");
const { checkLogin } = require("../middleWare/checkAuth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

module.exports = router;
