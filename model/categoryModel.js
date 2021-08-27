const mongoose = require("./dbConnect");

const CategorySchema = mongoose.Schema(
  {
    categoryName: String,
  },
  { collection: "category" }
);

const CategoryModel = mongoose.model("category", CategorySchema);

module.exports = CategoryModel;
