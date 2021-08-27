const mongoose = require('./dbConnect');

const CartSchema = mongoose.Schema({
    listProduct: [{
        productID: {
            type: String,
            ref: 'product'
        },
        quantity: Number
    }]
}, {collection: 'cart'});

const CartModel = mongoose.model('cart', CartSchema);

module.exports = CartModel;
