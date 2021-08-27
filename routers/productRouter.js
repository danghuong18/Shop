const router = require("express").Router();
const ProductCodeModel = require("../model/productCodeModel");
const ProductModel = require("../model/productModel");
const multer = require("multer");
const fs = require('fs');
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../public/upload"));
    },
    filename: function (req, file, cb) {
        var filetypes = /jpeg|jpg|png|gif/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
        }else{
            cb("ErrorType");
        }
    }
});

const upload = multer({storage: storage});

router.get("/", (req, res)=>{

});

router.post("/create", (req, res)=>{
    upload.array("product-image", 10)(req, res, async (err)=>{
        if (err) {
            if(err == "ErrorType"){
                res.json({message: "File upload not support", status: 406});
            }else{
                res.json({message: "Error when upload file logo's brand", status: 400});
            }
        }else{

            if(req.files.length > 0){
                let list_image = [];
                let list_detail = [] ;
                let list_category = [];
                for(x in req.files){
                    list_image.push("/public/upload/" + req.files[x].filename);
                }

                if(req.body["detail-title"]){
                    let detail_title = req.body["detail-title"];
                    let detail_content = req.body["detail-content"];
                    if(Array.isArray(detail_title)){
                        for(x in detail_title){
                            if(detail_title[x] && detail_content[x]){
                                list_detail.push({title: detail_title[x], content: detail_content[x]});
                            }
                        }
                    }else{
                        if(detail_title && detail_content){
                            list_detail.push({title: detail_title, content: detail_content});
                        }
                    }
                }

                if(req.body.category){
                    let category_id = req.body.category;
                    if(Array.isArray(category_id)){
                        list_category = category_id;;
                    }else{
                        if(category_id){
                            list_category.push(category_id);
                        }
                    }
                }

                let title = req.body.title;
                let brand = req.body.brand;
                let description = req.body.description;
                let createDate = Date();

                try {
                    let create = await ProductCodeModel.create({
                        productName: title,
                        listImg: list_image,
                        detail: list_detail,
                        productID: [],
                        categoryID: list_category,
                        brand: brand,
                        description: description,
                        createDate: createDate,
                        updateDate: createDate});

                    if(create){
                        res.json({message: "Succcessed", status: 200, data: create._id});
                    }else{
                        res.json({message: "Can't create product", status: 400});
                    }
                } catch (error) {
                    res.json({message: "Server error!", status: 500, error});
                }
            }else{
                res.json({message: "Can't create product", status: 400});
            }
        }
      });
});

router.post("/edit", (req, res)=>{

});

router.get("/:id", (req, res) => {
    try {
      res.render("pages/item-view", { id: req.params.id });
    } catch (err) {
      res.json({
        mess: "loi server",
        status: 500,
        err,
      });
    }
  });
  
  router.post("/:productID", async (req, res) => {
    try {
      let data = await ProductCodeModel.findOne({
        _id: req.params.productID,
      })
        .populate("categoryID")
        .populate("productID")
        .populate("brand");
      res.json({
        mess: "lay data thanh cong",
        data,
        status: 200,
      });
    } catch (err) {
      res.json({
        mess: "loi server",
        data: err,
        status: 500,
      });
      console.log(err);
    }
  });
  
  router.post("/related/:categoryID", async (req, res) => {
    try {
      let data = await ProductCodeModel.find({
        categoryID: req.params.categoryID,
      })
        .limit(20)
        .populate("productID");
      res.json({
        mess: "lay data thanh cong",
        data: data,
        status: 200,
      });
    } catch (err) {
      res.json({
        mess: "loi server",
        err: "err",
        status: 500,
      });
    }
  });

module.exports = router;