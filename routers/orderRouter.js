const router = require("express").Router();
const OrderModel = require("../model/orderModel");
const { checkLogin } = require("../middleWare/checkAuth");
const ProductModel = require("../model/productModel");
const CartModel = require("../model/cartModel");

router.get("/", checkLogin, async (req, res) => {
  if (req.login_info.role === "admin") {
    try {
      let sort = req.query.sort;
      let limit = req.query.limit * 1;
      let skip = (req.query.page - 1) * limit;
      let pages = 1;
      let filter = {};
      let sortby = {};

      if (sort == "date-desc") {
        sortby = { createDate: -1 };
      } else if (sort == "date-asc") {
        sortby = { createDate: 1 };
      } else if (sort == "success-desc") {
        filter = { status: "success" };
        sortby = { createDate: -1 };
      } else if (sort == "success-asc") {
        filter = { status: "success" };
        sortby = { createDate: 1 };
      } else if (sort == "pending-desc") {
        filter = { status: "pending" };
        sortby = { createDate: -1 };
      } else if (sort == "pending-asc") {
        filter = { status: "pending" };
        sortby = { createDate: 1 };
      } else if (sort == "fail-desc") {
        filter = { status: "fail" };
        sortby = { createDate: -1 };
      } else if (sort == "fail-asc") {
        filter = { status: "fail" };
        sortby = { createDate: 1 };
      }

      let orders = await OrderModel.find(filter)
        .populate({
          path: "listProduct",
          populate: { path: "productID", populate: { path: "productCode" } },
        })
        .populate("userID", "username")
        .skip(skip)
        .limit(limit)
        .sort(sortby);
      let all_orders = await OrderModel.find(filter);
      if (all_orders.length > 0) {
        pages = Math.ceil(all_orders.length / limit);
      }
      if (orders.length > 0) {
        res.json({
          message: "Succcessed",
          status: 200,
          data: orders,
          pages: pages,
        });
      } else {
        res.json({
          message: "Không có đơn hàng nào để hiển thị cả.",
          status: 400,
        });
      }
    } catch (error) {
      res.json({ message: "Server error!", status: 500 });
    }
  } else {
    res.json({ message: "Bạn không có quyền ở đây.", status: 400 });
  }
});

router.get("/myOrder", checkLogin, async (req, res) => {
  try {
    let sort = req.query.sort;
    let limit = (req.query.limit? req.query.limit : 1) * 1;
    let skip = ((req.query.page? req.query.page : 1) - 1) * limit;
    let pages = 1;
    let filter = {userID: req.login_info._id};
    let sortby = { createDate: -1 };

    if (sort == "success") {
      filter.status = "success";
    } else if (sort == "pending") {
      filter.status = "pending";
    } else if (sort == "fail") {
      filter.status = "fail";
    }

    let orders = await OrderModel.find(filter)
    .populate({
      path: "listProduct",
      populate: { path: "productID", populate: { path: "productCode" } },
    })
    .populate("userID", "fullName")
    .skip(skip)
    .limit(limit)
    .sort(sortby);

    let all_orders = await OrderModel.find(filter);
    if (all_orders.length > 0) {
      pages = Math.ceil(all_orders.length / limit);
    }
    
    if (orders.length > 0) {
      res.json({
        message: "Succcessed",
        status: 200,
        data: orders,
        pages: pages,
      });
    } else {
      res.json({
        message: "Không có đơn hàng nào để hiển thị cả.",
        status: 400,
      });
    }
  } catch (error) {
    res.json({ message: "Server error!", status: 500 });
  }
});

router.post("/reOrder", checkLogin, async (req, res) => {
  try {
    let id = req.body.id;

    let order = await OrderModel.findOne({ _id: id, userID: req.login_info._id });
    
    if(order){
      if(order.listProduct.length > 0){
        let cart =  await CartModel.findOne({
          _id: req.login_info.cartID
        });

        let listCartProduct = [];

        if(cart){
          listCartProduct = cart.listProduct;
        }

        for(x in order.listProduct){
          let data = await ProductModel.findOne({
            _id: order.listProduct[x].productID
          });
          if(data){
            let isExist = false;
            for(i in listCartProduct){
              if(listCartProduct[i].productID == order.listProduct[x].productID){
                isExist = true;
                if(order.listProduct[x].quantity + listCartProduct[i].quantity > data.quantity){
                  listCartProduct[i].quantity = data.quantity;
                }else{
                  listCartProduct[i].quantity = order.listProduct[x].quantity + listCartProduct[i].quantity;
                }
              }
            }

            if(!isExist){
              let quantity = 0;
              if(order.listProduct[x].quantity > data.quantity){
                quantity = data.quantity;
              }else{
                quantity = order.listProduct[x].quantity;
              }
              listCartProduct.push({productID: order.listProduct[x].productID, quantity: quantity});
            }
          }
        }

        if(listCartProduct){
          let update = await CartModel.findOneAndUpdate(
            {_id: req.login_info.cartID},
            { $set: { listProduct: listCartProduct } },
            { returnOriginal: false }
          );

          res.json({
            message: "Thêm vào giỏ hàng thành công! Mời check giỏ hàng",
            status: 200,
            data: update
          });
        }else{
          res.json({
            message: "Thêm vào giỏ hàng không thành công.",
            status: 400
          });
        }
      }
    }else{
      res.json({
        message: "Không tìm thấy đơn hàng.",
        status: 400,
      });
    }
  } catch (error) {
    res.json({ message: "Server error!", status: 500 });
  }
});

router.post("/confirmOrder", checkLogin, async (req, res) => {
  if (req.login_info.role === "admin") {
    try {
      let id = req.body.id;

      let confirm = await OrderModel.updateOne(
        { _id: id },
        { $set: { status: "success" } }
      );
      if (confirm.nModified) {
        res.json({ message: "Xác nhận đơn hàng thành công!", status: 200 });
      } else {
        res.json({
          message: "Xác nhận đơn hàng không thành công.",
          status: 400,
        });
      }
    } catch (error) {
      res.json({ message: "Server error!", status: 500 });
    }
  } else {
    res.json({ message: "Bạn không có quyền ở đây.", status: 400 });
  }
});

router.post("/cancelOrder", checkLogin, async (req, res) => {
  try {
    let id = req.body.id;

    let confirm = await OrderModel.updateOne(
      { _id: id, userID: req.login_info._id },
      { $set: { status: "fail" } }
    );
    if (confirm.nModified) {
      res.json({ message: "Huỷ đơn hàng thành công!", status: 200 });
    } else {
      res.json({
        message: "Huỷ đơn hàng không thành công.",
        status: 400,
      });
    }
  } catch (error) {
    res.json({ message: "Server error!", status: 500 });
  }
});

module.exports = router;
