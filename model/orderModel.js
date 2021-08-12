const mongoose = require('./dbConnect');

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
    createDate: Date
}, {collection: 'order'});

const OrderModel = mongoose.model('order', OrderSchema);

module.exports = OrderModel;