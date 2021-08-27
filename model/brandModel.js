const mongoose = require("./dbConnect");

const BrandSchema = mongoose.Schema(
  {
    brandName: String,
  },
  { collection: "brand" }
);

const BrandModel = mongoose.model("brand", BrandSchema);

module.exports = BrandModel;
