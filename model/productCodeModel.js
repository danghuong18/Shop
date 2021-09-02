const mongoose = require('./dbConnect');

const ProductCodeSchema = mongoose.Schema({
    detail: [
        {
            title: String,
            content: String
        }],
    description: String,
    productName: String,
    listImg: [{type: String}],
    productID: [{
        type: String,
        ref: 'product'
    }],
    categoryID: [{
        type: String,
        ref: 'category'
    }],
    brand: {
        type: String,
        ref: 'brand'
    },
    createDate: Date,
    updateDate: Date
}, {collection: 'productCode'});

ProductCodeSchema.index({'$**': 'text'});
// ProductCodeSchema.index({name: 'text', 'description': 'text'});

const ProductCodeModel = mongoose.model('productCode', ProductCodeSchema);

module.exports = ProductCodeModel;
