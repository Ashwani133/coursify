const { Router, application } = require("express");
const courseRouter = Router();
const {courseModel}= require('../db')


courseRouter.get("/preview", async function(req,res){
    const courses = await courseModel.find({});
    
    res.json({
        courses
    })
})

module.exports = {
    courseRouter:courseRouter
}