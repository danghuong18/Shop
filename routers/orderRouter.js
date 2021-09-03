const router = require("express").Router();
const OrderModel = require("../model/orderModel");
const { checkLogin } = require("../middleWare/checkAuth");

router.get("/", checkLogin, async (req, res)=>{
    if(req.role === "admin"){
        try {
            let sort = req.query.sort;
            let limit = req.query.limit*1;
            let skip = (req.query.page - 1)*limit;
            let pages = 1;
            let filter = {};
            let sortby = {};
    
            if(sort == "date-desc"){
                sortby = {createDate: -1};
            }else if(sort == "date-asc"){
                sortby = {createDate: 1};
            }else if(sort == "success-desc"){
                filter = {status: "success"};
                sortby = {createDate: -1};
            }else if(sort == "success-asc"){
                filter = {status: "success"};
                sortby = {createDate: 1};
            }else if(sort == "pending-desc"){
                filter = {status: "pending"};
                sortby = {createDate: -1};
            }else if(sort == "pending-asc"){
                filter = {status: "pending"};
                sortby = {createDate: 1};
            }else if(sort == "fail-desc"){
                filter = {status: "fail"};
                sortby = {createDate: -1};
            }else if(sort == "fail-asc"){
                filter = {status: "fail"};
                sortby = {createDate: 1};
            }
    
            let orders = await OrderModel.find({}).populate({path: "listProduct", populate: { path: "productID", populate: {path: "productCode"}}}).populate("userID", "username").skip(skip).limit(limit).sort(sortby);
            let all_orders = await OrderModel.find({});
            if(all_orders.length > 0){
                pages = Math.ceil(all_orders.length/limit);
            }
            if(orders.length > 0){
                res.json({message: "Succcessed", status: 200, data: orders, pages: pages});
            }else{
                res.json({message: "Không có đơn hàng nào để hiển thị cả.", status: 400});
            }
    
        } catch(error){
            res.json({message: "Server error!", status: 500, });
        }
    }else{
        res.json({message: "Bạn không có quyền ở đây.", status: 400});
    }
});

module.exports = router;