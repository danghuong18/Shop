const mongoose = require("./dbConnect");

const CartSchema = mongoose.Schema(
  {
    listProduct: [
      {
        productID: {
          type: String,
          ref: "product",
        },
        quantity: Number,
        selected: Number,
      },
    ],
  },
  { collection: "cart" }
);

const CartModel = mongoose.model("cart", CartSchema);

module.exports = CartModel;

async function test() {
  try {
    await CartModel.updateOne(
      { _id: "61592f0b7e919eb913617cc6" },
      { $set: { "listProduct.$[i].selected": 1 } },
      {
        arrayFilters: [
          {
            "i.productID": {
              $in: ["614c4755b8aa0667a8c7cc2b", "614ca40072b39f49e4338367"],
            },
          },
        ],
      }
    );
    let data = await CartModel.findOne({ _id: "61592f0b7e919eb913617cc6" });
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

test();
