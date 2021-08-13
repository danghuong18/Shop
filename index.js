const express = require('express');
const path = require('path');
const UserModel = require('./model/userModel');
const CartModel = require('./model/cartModel');
const BrandModel = require('./model/brandModel');
const CategoryModel = require('./model/categoryModel');
const ProductModel = require('./model/productModel');
const ProductCodeModel = require('./model/productCodeModel');
const cookieParser = require('cookie-parser');

const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "./")));

app.get('/', (req, res)=>{
    res.render('pages/index');
});

app.listen(process.env.PORT || 3000);