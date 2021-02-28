const mongoose = require("mongoose");
const Joi = require("joi");


const toySchema = new mongoose.Schema({
    name:String,
    info:String,
    category:String,
    img_url:String,
    price:String,
    user_id:String,
    date_created:{
        type:Date , default:Date.now
    }
})

exports.ToyModel  = mongoose.model("toys",toySchema);

exports.validToy = (_bodyData) => {
    let schemaJoi = Joi.object({
        name:Joi.string().min(2).max(100).required(),
        info:Joi.string().min(2).max(1000).required(),
        img_url:Joi.string().min(2).max(200),
        category:Joi.string().min(2).max(100).required(),
        price:Joi.string().min(1).max(99999).required()
    })

    return schemaJoi.validate(_bodyData);
}