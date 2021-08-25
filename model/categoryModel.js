const mongoose = require('./dbConnect');

const CategorySchema = mongoose.Schema({
    categoryName: String,
    createDate: Date,
    updateDate: Date
}, {collection: 'category'});

const CategoryModel = mongoose.model('category', CategorySchema);

module.exports = CategoryModel;