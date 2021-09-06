const mongoose = require('./dbConnect');

const STATUS = ["pending", "success", "fail"];

const OrderSchema = mongoose.Schema({
    listProduct: [{
        productID: {
            type: String,
            ref: 'product'
        },
        quantity: Number
    }],
    userID: {
        type: String,
        ref: 'user'
    },
    address: String,
    phone: String,
    price: Number,
    status: {
        type: String,
        enum: STATUS,
        default: STATUS[1],
    },
    createDate: Date
}, {collection: 'order'});

const OrderModel = mongoose.model('order', OrderSchema);

module.exports = OrderModel;
