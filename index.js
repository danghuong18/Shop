const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const ProductRoutes = require("./router/ProductRoutes.js");
const UserRoutes = require("./router/UserRoutes.js");
const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "./")));
app.use("/product", ProductRoutes);
app.use("/user", UserRoutes);

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.listen(process.env.PORT || 3000);
