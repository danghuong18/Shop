const UserModel = require("../model/userModel");
const BlackListModel = require("../model/blackListModel");
const jwt = require("jsonwebtoken");

async function checkLogin(req, res, next) {
  try {
    const token = req.cookies.cookie;
    if (token) {
      const checkToken = await BlackListModel.findOne({ token });
      if (checkToken) {
        res.json({ status: 400, mess: "token da bi vo hieu" });
      } else {
        const id = jwt.verify(token, "thai").id;
        const user = await UserModel.findOne({ _id: id });
        if (user) {
          req.role = user.role;
          next();
        } else {
          res.json({ status: 400, mess: "token khong hop le" });
        }
      }
    } else {
      res.json({ status: 400, mess: "vui long dang nhap" });
    }
  } catch (error) {
    res.json({ status: 500, mess: "loi server", error });
  }
}

module.exports = { checkLogin };
