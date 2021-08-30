const router = require('express').Router()
const productCodeModel = require('../model/productCodeModel')

router.get('/search', async(req,res)=>{
  try {
    const searchValue = await productCodeModel.find(
      {productName:{
        $regex:`.*${req.query.search}.*`, 
        $options: 'i'
      },
    })
    res.json({data:searchValue, mess:'ok',status:200})
  } catch (error) {
    res.json({status:500, error, mess:'server error'})
  }
})

router.get('/filter', async(req,res)=>{
  try {
    const min = req.query.min
    const max = req.query.max
    const brand = req.query.brand
    const filterInput = {}
    if(brand){
      brandList = brand.split(',')
      filterInput.brand = {$in:brandList}
    }

    const filter = await productCodeModel.find(filterInput)
    .populate('productID')
    
    if(max || min){
      const result = filter.filter((ele)=>{       
        if(max && min){
          for(let i = 0; i< ele.productID.length ; i++){
            if(ele.productID[i].price >= min && ele.productID[i].price <= max){
              return true
            }
          }
        }else if(max){
          for(let i = 0; i< ele.productID.length ; i++){
            if(ele.productID[i].price <= max){
              return true
            }
          }
        }else if(min){
          for(let i = 0; i< ele.productID.length ; i++){
            if(ele.productID[i].price >= min){
              return true
            }
          }
        }
      })
      res.json({data:result, mess:'ok',status:200})
    }
    res.json({data:filter, mess:'ok',status:200})
  } catch (error) {
    console.log(error);
    res.json({status:500, error, mess:'server error'})
  }
})

module.exports = router