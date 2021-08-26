const mongoose = require('./dbConnect');

const BrandSchema = mongoose.Schema({
    brandName: String,
    logo: String,
    createDate: Date,
    updateDate: Date
}, {collection: 'brand'});

const BrandModel = mongoose.model('brand', BrandSchema);

module.exports = BrandModel;