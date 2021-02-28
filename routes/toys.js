const express = require("express");
const { authToken } = require('../middlewares/auth');
const {ToyModel, validToy} = require("../models/toyModel");
const router = express.Router();

router.get("/", async(req,res) => {
    let perPage = (req.query.perPage)? Number(req.query.perPage) : 5;
    let page = req.query.page;
try{
    let Data = await ToyModel.find({})
    .limit(perPage)
    .skip(page * perPage)
    res.json(Data);
}
catch(err){
console.log(err);
res.status(400).json(err);
}
})


router.get("/search", async(req, res) => {
    let perPage = (req.query.perPage)? Number(req.query.perPage) : 10;
    let page = req.query.page;
    let qString = req.query.s;
    let qReg = new RegExp(qString, "i")
    try{
        let data = await ToyModel.find({$or:[{name:qReg},{info:qReg}]})
        .limit(perPage)
        .skip(page * perPage)
        res.json(data); 
    }
    catch(err){
        console.log(err)
        res.status(400).json(err)
    }
  })
  router.get("/category/:catName", async(req, res) => {
      let catName = req.params.catName;
      let perPage = (req.query.perPage)? Number(req.query.perPage) : 10;
      let page = req.query.page;
    let sortQ = req.query.sort;
    let reverse = (req.query.reverse == "yes") ? -1 : 1;
    try{
        let toyData = await ToyModel.find({category: catName })
        .sort({[sortQ]: reverse})
        .limit(perPage)
        .skip(page * perPage)
        res.json(toyData); 
    }
    catch(err){
        console.log(err)
        res.status(400).json(err)
    }
  })
  router.get("/prices", async(req, res) =>{
      let perPage = (req.query.perPage)? Number(req.query.perPage) : 10;
      let page = req.query.page;
      let sortQ = req.query.sort;
      let reverse = (req.query.reverse == "yes") ? -1 : 1;
      try{
          let min = Number(req.query.min);
          let max = Number(req.query.max);
          let toyData = await ToyModel.find({})
          .sort({[sortQ]: reverse })
          .limit(perPage)
          .skip(page * perPage)
          let toyFilter = await toyData.filter(item =>{
              return item.price >= min && item.price <= max;
          })
          res.json(toyFilter);   
      }
      catch (err) {
          console.log(err);
          res.status(400).json(err);
      }
  })
router.post("/", authToken, async(req,res) => {
    let validBody = validToy(req.body);
    if(validBody.error){
        return res.status(400).json(validBody.error.details);
    }
    try{
        let toy = new ToyModel(req.body);
        toy.user_id = req.userData._id;
        await toy.save();
        res.status(201).json(toy);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})

router.put("/:editId", authToken, async(req,res) => {
    let editId = req.params.editId;
    let validBody = validToy(req.body);
    if(validBody.error){
        return res.status(400).json(validBody.error.details);
    }
    try{
        let toy = await ToyModel.updateOne({_id:editId,user_id:req.userData._id},req.body);
        res.json(toy);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})

router.delete("/:delId", authToken, async(req,res) =>{
    let delId = req.params.delId;
    try{
        let toy = await ToyModel.deleteOne({_id:delId,user_id:req.userData._id});
        res,json(toy);
    }
    catch (err){
        console.log(err);
        res.status(400),json(err);
    }
})
module.exports = router;