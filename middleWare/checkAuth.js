const UserModel = require("../model/userModel");
const BlackListModel = require("../model/blackListModel");
const jwt = require("jsonwebtoken");

async function checkLogin(req, res, next) {
  try {
    const token = req.cookies.cookie;
    if (token) {
      const checkToken = await BlackListModel.findOne({ token });
      if (checkToken) {
        res.json({ message: "Token đã bị vô hiệu hoá.", status: 400 });
      } else {
        const id = jwt.verify(token, "thai").id;
        const user = await UserModel.findOne({ _id: id });
        if (user) {
          req.user = user;
          req.role = user.role;
          req.login_id = id;
          next();
        } else {
          res.json({ message: "Token không hợp lệ.", status: 400 });
        }
      }
    } else {
      res.json({ message: "Vui lòng đăng nhập.", status: 400 });
    }
  } catch (error) {
    res.json({ message: "Server error!", status: 500, error });
  }
}

async function checkAdminLogin(req, res, next) {
  let login_params = { isLogin: false, isAdmin: false };
  let isLoginCpanel = false;
  try {
    const token = req.cookies.cookie;
    const cpanel = req.cookies.cpanel;
    if (token) {
      const checkToken = await BlackListModel.findOne({ token });

      if (!checkToken) {
        const id = jwt.verify(token, "thai").id;
        const user = await UserModel.findOne({ _id: id });
        if (user) {
          login_params = { isLogin: true, isAdmin: false };
          if (user.role === "admin") {
            req.login_info = user;
            login_params = { isLogin: true, isAdmin: true };
            if (cpanel) {
              const cpanel_role = jwt.verify(cpanel, "thai").id;
              if (cpanel_role === "admin" && user.role === "admin") {
                isLoginCpanel = true;
                next();
              }
            }
          }
        }
      }
    }

    if (!isLoginCpanel) {
      res.render("pages/cpanel/login", login_params);
    }
  } catch (error) {
    res.json({ message: "Server error!", status: 500, error });
  }
}

module.exports = { checkLogin, checkAdminLogin };
