const router = require("express").Router();
const CategoryModel = require("../model/categoryModel");

router.get("/", async (req, res)=> {
    try {
        let sort = req.query.sort;
        let limit = req.query.limit*1;
        let skip = (req.query.page - 1)*limit;
        let pages = 1;
        let sortby = {};
        
        if(sort == "name-az"){
            sortby = {categoryName: 1};
        }else if(sort == "name-za"){
            sortby = {categoryName: -1};
        }else if(sort == "date-desc"){
            sortby = {createDate: -1};
        }else if(sort == "date-asc"){
            sortby = {createDate: 1};
        }

        let categories = await CategoryModel.find({}).skip(skip).limit(limit).sort(sortby);
        let all_categories = await CategoryModel.find({});
        if(all_categories.length > 0){
            pages = Math.ceil(all_categories.length/limit);
        }
        if(categories.length > 0){
            res.json({message: "Succcessed", status: 200, data: categories, pages: pages});
        }else{
            res.json({message: "Không có danh mục nào để hiển thị cả.", status: 400});
        }

    } catch(error){
        res.json({message: "Server error!", status: 500, errors});
    }
});

router.post("/create", async (req, res)=>{
    try {
        let title = req.body.title;
        let createDate = Date();

        let create = await CategoryModel.create({categoryName: title, createDate: createDate, updateDate: createDate});
        if(create){
            res.json({message: "Tạo danh mục thành công!", status: 200});
        }else{
            res.json({message: "Không thể tạo danh mục.", status: 400});
        }
    } catch (error) {
        res.json({message: "Server error!", status: 500, error});
    }
});

router.post("/edit", async (req, res)=>{
    try {
        let id = req.body.id;
        let title = req.body.title;
        let updateDate = Date();

        let edit = await CategoryModel.updateOne({_id: id}, {$set: { categoryName: title, updateDate: updateDate}});
        if(edit.ok){
            res.json({message: "Sửa danh mục thành công!", status: 200});
        }else{
            res.json({message: "Không thể sửa danh mục.", status: 400});
        }
    } catch (error) {
        res.json({message: "Server error!", status: 500, error});
    }
});

router.post("/delete", async (req, res)=>{
    try {
        let list_item = req.body['list_item[]'];
        let delete_item = await CategoryModel.deleteMany({_id: list_item});
        if(delete_item.deletedCount > 0){
            res.json({message: "Xoá danh mục thành công!", status: 200});
        }else{
            res.json({message: "Không thể xoá danh mục.", status: 400});
        }
    } catch (error) {
        res.json({message: "Server error!", status: 500, error});
    }
});

module.exports = router;