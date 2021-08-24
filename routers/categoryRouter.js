const router = require("express").Router();
const CategoryModel = require("../model/categoryModel");

router.get("/", async (req, res)=> {
    let limit = req.query.limit*1;
    let skip = (req.query.page - 1)*limit;

    try {
        let products = await CategoryModel.find({}).skip(skip).limit(limit);

        if(products.length > 0){
            res.json({message: "Succcessed", status: 200, data: products});
        }else{
            res.json({message: "There are no categories to display.", status: 400});
        }

    } catch(error){
        res.json({message: "Server error!", status: 500, errors});
    }
});

router.post("/create", async (req, res)=>{
    let title = req.body.title;
    try {
        let create = await CategoryModel.create({categoryName: title});
        if(create){
            res.json({message: "Succcessed", status: 200});
        }else{
            res.json({message: "Can't create category", status: 400});
        }
    } catch (error) {
        res.json({message: "Server error!", status: 500, error});
    }
});

router.post("/edit", async (req, res)=>{
    let id = req.body.id;
    let title = req.body.title;
    try {
        let edit = await CategoryModel.updateOne({_id: id}, {$set: { categoryName: title}});
        if(edit){
            res.json({message: "Succcessed", status: 200});
        }else{
            res.json({message: "Can't edit category", status: 400});
        }
    } catch (error) {
        res.json({message: "Server error!", status: 500, error});
    }
});

router.post("/delete", async (req, res)=>{
    let list_item = req.body['list_item[]'];
    console.log(list_item);
    try {
        let delete_item = await CategoryModel.deleteMany({_id: list_item});
        console.log(delete_item);
        if(delete_item){
            res.json({message: "Succcessed", status: 200});
        }else{
            res.json({message: "Can't delete category", status: 400});
        }
    } catch (error) {
        res.json({message: "Server error!", status: 500, error});
    }
});

module.exports = router;