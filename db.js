const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const admin = new Schema({
    email:{type:String, required:true,unique:true},
    name:{type:String, required:true},
    password:{type:String, required: true},
})


const adminModel = mongoose.model("admins",admin);

module.exports = {
    adminModel:adminModel
}
