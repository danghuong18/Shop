const { checkLogin } = require("../middleWare/checkAuth");
const OrderModel = require("../model/orderModel");
const ProductCodeModel = require("../model/productCodeModel");
const UserModel = require("../model/userModel");

const router = require("express").Router();

async function revenueByDay(day){
    let orders = await OrderModel.aggregate([
        { $match: {
            $and: [
                {status: {$eq: "success"}},
                {createDate: {$gte: day.startOfDay() }},
                {createDate: {$lte: day.endOfDay() }}
            ]
          }
        },
        { $group: {_id: null, "revenue": { $sum: "$price" }}}
    ]);

    let revenue = (orders.length > 0) ? orders[0].revenue : 0;

    return revenue;
}

function maxNumber(number){
    let numLength = number.toString().length;
    let numDevide = (number/Math.pow(10, numLength - 1))/5;
    return Math.ceil(numDevide*10)*5*Math.pow(10, numLength - 2);
}

// This is a safety check to make sure the prototype is not already defined.
Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
        return this;
    }
};

Date.method('endOfDay', function () {
    var date = new Date(this);
    date.setHours(23, 59, 59, 999);
    return date;
});

Date.method('startOfDay', function () {
    var date = new Date(this);
    date.setHours(0, 0, 0, 0);
    return  date;
});

router.get("/", checkLogin, async (req, res)=>{
    if(req.role === "admin"){
        try {
            // let orders_success = await OrderModel.find({status: "success"});
            let orders_success = await OrderModel.aggregate([
                { $match: {status: 'success'} },
                { $group: {_id: null, "totalRevenue": { $sum: "$price" }}}
            ]);
            let users = await UserModel.find({});
            let products = await ProductCodeModel.find({});
            let orders = await OrderModel.find({});

            let total_revenue = (orders_success.length > 0)? orders_success[0].totalRevenue : 0;

            let total_user = (users.length > 0) ? users.length : 0;

            let total_product = (products.length > 0) ? products.length : 0;

            let total_order = (orders.length > 0) ? orders.length : 0;

            res.json({message: "Successed", status: 200, data: {revenue: total_revenue, user: total_user, product: total_product, order: total_order}});

        } catch (error) {
            res.json({message: "Server error!", status: 500, error});
        }
    }else{
        res.json({message: "Bạn không có quyền ở đây.", status: 400});
    }
});

router.get("/revenue", checkLogin, async (req, res)=>{
    if(req.role === "admin"){
        try {
            let result = [];
            let max = 0;
            let date = new Date();

            for(i = 1; i <= 7; i++){
                let revenue = await revenueByDay(date);

                if(revenue > max){
                    max = revenue;
                }
                result.push({day: new Date(date).toLocaleDateString(), revenue: revenue});
                date.setDate(date.getDate() - 1);
            }

            max = maxNumber(max);

            res.json({message: "Successed", status: 200, data: result, max: max});

        } catch (error) {
            res.json({message: "Server error!", status: 500, error});
        }
    }else{
        res.json({message: "Bạn không có quyền ở đây.", status: 400});
    }
});

module.exports = router;