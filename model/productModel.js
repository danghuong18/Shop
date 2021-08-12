const mongoose = require('./dbConnect');

const ProductSchema = mongoose.Schema({
    price: Number,
    quantity: Number,
    color: String,
    size: String,
    thumb: String,
    productCode: String,
    createDate: Date,
    updateDate: Date
});