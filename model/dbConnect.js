const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect("mongodb://localhost/ShopDatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

module.exports = mongoose;
