const router = require("express").Router();
const BrandModel = require("../model/brandModel");
const multer = require("multer");
const fs = require('fs');
const path = require("path");

async function GetListFile(list_id = []){
    list_file = []
    try {
        let brands = await BrandModel.find({_id: list_id});
        if(brands){
            for(x in brands){
                list_file.push(brands[x].logo);
            }
        }
    } catch (error) {}

    return list_file;
}

function DeleteFile(list_file = []){
    for(x in list_file){
        if (fs.existsSync(path.join(__dirname, `..${list_file[x]}`))) {
            fs.unlinkSync(path.join(__dirname, `..${list_file[x]}`));
        }
    }
}

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

router.get("/", async (req, res)=> {
    let sort = req.query.sort;
    let limit = req.query.limit*1;
    let skip = (req.query.page - 1)*limit;
    let pages = 1;
    let sortby = {};
    if(sort != "" && sort != undefined){
        if(sort == "name-az"){
            sortby = {brandName: 1};
        }else if(sort == "name-za"){
            sortby = {brandName: -1};
        }else if(sort == "date-desc"){
            sortby = {createDate: -1};
        }else if(sort == "date-asc"){
            sortby = {createDate: 1};
        }
    }

    try {
        let brands = await BrandModel.find({}).skip(skip).limit(limit).sort(sortby);
        let all_brands = await BrandModel.find({});
        if(all_brands.length > 0){
            pages = Math.ceil(all_brands.length/limit);
        }
        if(brands.length > 0){
            res.json({message: "Succcessed", status: 200, data: brands, pages: pages});
        }else{
            res.json({message: "There are no brands to display.", status: 400});
        }

    } catch(error){
        res.json({message: "Server error!", status: 500, errors});
    }
});

router.post("/create", async (req, res)=>{
    upload.single("brandlogo")(req, res, async (err)=>{
        if (err) {
            if(err == "ErrorType"){
                res.json({message: "File upload not support", status: 406});
            }else{
                res.json({message: "Error when upload file logo's brand", status: 400});
            }
        }else{
            if(req.file){
                let title = req.body.title;
                let createDate = Date();
                let logo = "/public/upload/" + req.file.filename;
                try {
                    let create = await BrandModel.create({brandName: title, logo: logo, createDate: createDate, updateDate: createDate});
                    if(create){
                        res.json({message: "Succcessed", status: 200});
                    }else{
                        res.json({message: "Can't create brand", status: 400});
                    }
                } catch (error) {
                    res.json({message: "Server error!", status: 500, error});
                }
            }else{
                res.json({message: "No file upload!", status: 500});
            }
        }
      });

});

router.post("/edit", async (req, res)=>{
    upload(req, res, async (err)=>{
        if (err) {
            if(err == "ErrorType"){
                res.json({message: "File upload not support", status: 406});
            }else{
                res.json({message: "Error when upload file logo's brand", status: 400});
            }
        }else{
            let updateDate = Date();
            let id = req.body.id;
            let title = req.body.title;
            let list_file = GetListFile([id]);
            if(req.file) {
                let logo = "/public/upload/" + req.file.filename;
                try {
                    let edit = await BrandModel.updateOne({_id: id}, {$set: { brandName: title, logo: logo, updateDate: updateDate}});
                    if(edit){
                        DeleteFile(list_file);
                        res.json({message: "Succcessed", status: 200});
                    }else{
                        res.json({message: "Can't edit brand", status: 400});
                    }
                } catch (error) {
                    res.json({message: "Server error!", status: 500, error});
                }
            } else {
                try {
                    let edit = await BrandModel.updateOne({_id: id}, {$set: { brandName: title, updateDate: updateDate}});
                    if(edit){
                        res.json({message: "Succcessed", status: 200});
                    }else{
                        res.json({message: "Can't edit brand", status: 400});
                    }
                } catch (error) {
                    res.json({message: "Server error!", status: 500, error});
                }
            }

        }
      });
});

router.post("/delete", async (req, res)=>{
    let list_item = req.body['list_item[]'];
    let list_file = GetListFile(list_item);

    try {
        let delete_item = await BrandModel.deleteMany({_id: list_item});
        if(delete_item){
            if(delete_item.deletedCount > 0){
                DeleteFile(list_file);
                res.json({message: "Succcessed", status: 200});
            }else{
                res.json({message: "Can't delete brand", status: 400});
            }
        }else{
            res.json({message: "Can't delete brand", status: 400});
        }
    } catch (error) {
        res.json({message: "Server error!", status: 500, error});
    }
});

module.exports = router;