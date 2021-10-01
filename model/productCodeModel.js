const mongoose = require("./dbConnect");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const ProductCodeSchema = mongoose.Schema(
  {
    detail: [
      {
        title: String,
        content: String,
      },
    ],
    description: String,
    productName: String,
    listImg: [{ type: String }],
    productID: [
      {
        type: ObjectId,
        ref: "product",
      },
    ],
    categoryID: [
      {
        type: ObjectId,
        ref: "category",
      },
    ],
    brand: {
      type: ObjectId,
      ref: "brand",
    },
    createDate: Date,
    updateDate: Date,
  },
  { collection: "productCode" }
);

// ProductCodeSchema.index({'$**': 'text'});
// console.log(ProductCodeSchema.index());
ProductCodeSchema.set("autoIndex", false);
// ProductCodeSchema.index({productName: 'text'});

const ProductCodeModel = mongoose.model("productCode", ProductCodeSchema);
ProductCodeModel.createIndexes({ productName: "text" });

module.exports = ProductCodeModel;
