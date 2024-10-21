const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const adminSchema = new Schema({
    email:{type:String, required:true,unique:true},
    name:{type:String, required:true},
    password:{type:String, required: true},
})

const courseSchema = new Schema({
    title:String,
    description:String,
    price:Number,
    imageUrl:String,
    creatorId:ObjectId
})

const userSchema = new Schema({
    email:{type:String, required:true,unique:true},
    name:{type:String, required:true},
    password:{type:String, required:true}
})

const purchaseSchema = new Schema({
    userId:ObjectId,
    courseId:ObjectId
})


const adminModel = mongoose.model("admins",adminSchema);
const courseModel = mongoose.model("courses",courseSchema)
const userModel = mongoose.model("users",userSchema)
const purchaseModel = mongoose.model("purchases",purchaseSchema)

module.exports = {
    adminModel:adminModel,
    courseModel:courseModel,
    userModel:userModel,
    purchaseModel:purchaseModel
}
