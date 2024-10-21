const { Router, application } = require("express");
const adminRouter = Router();
require('dotenv').config();
const { z } = require("zod");
var jwt = require('jsonwebtoken');
const {adminModel,courseModel} = require("../db")
const {JWT_ADMIN_PASSWORD} = require('../config')
const bcrypt = require('bcrypt');
const {adminMiddleware} = require('../middleware/admin');
const { default: mongoose } = require("mongoose");




adminRouter.post("/signup",async function(req,res){
    const {email, name, password} = req.body;
    const adminData = {
        email:email,
        name:name,
        password:password
    }
    const adminSchema = z.object({
        email:z.string().min(6).max(100).email(),
        name:z.string().min(3).max(100)
        .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" }),
        password:z.string().min(6).max(100)
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/\d/, { message: "Password must contain at least one number" })
        .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character (@, $, !, %, *, ?, &)" })
    })

    const parsedAdminData = adminSchema.safeParse(adminData)
    if(!parsedAdminData.success){
        res.status(400).json({
            message:"Incorrect Format",
            error:parsedAdminData.error
        })
        return;
    }



    try {
        const hashedPassword = await bcrypt.hash(password,10);
        await adminModel.create({
            email:email,
            name:name,
            password:hashedPassword
        })

        res.status(201).json({
            message:"you are signed up!"
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message:"An error occurred during signup. Please try again later."
        })
    }

})

adminRouter.post("/signin",async function(req,res){
    const{email,password} = req.body;
    const adminSigninSchema = z.object({
        email:z.string().min(6).max(100).email(),
        password:z.string().min(6).max(100)
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/\d/, { message: "Password must contain at least one number" })
        .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character (@, $, !, %, *, ?, &)" })
    })

    const adminSigninData = {
        email:email,
        password:password
    }
    const parsedAminSigninData = adminSigninSchema.safeParse(adminSigninData);
    if(!parsedAminSigninData.success){
        res.status(400).json({
            message:"Invalid Credentials"
        })
        return;
    }

    try {
        const response = await adminModel.findOne({email:email})
        if(!response){
            res.status(403).json({message:"User does not exists!"})
            return;
        }

        const passwordMatched = await bcrypt.compare(password,response.password);
        if(passwordMatched){
            const token = jwt.sign({
                id:response._id
            },JWT_ADMIN_PASSWORD);

            res.send({
                token:token
            })
        }else{
            res.status(403).send({
                message:"Invalid username or password!"
            })
        }

    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal server error",
            error: e.message
        });
    }
})

adminRouter.post("/course",adminMiddleware,async function(req,res){
    const{title,description,price,imageUrl} = req.body;
    const creatorId = req.userId;
    const courseData = {
        title:req.body.title,
        description:req.body.description,
        price:req.body.price,
        imageUrl:req.body.imageUrl,
        creatorId:creatorId
    }

    
const courseSchema = z.object({
    title: z.string().min(1, "Title is required"), // Must be a string and non-empty
    description: z.string().min(1, "Description is required"), // Must be a string and non-empty
    price: z.number().positive("Price must be a positive number"), // Must be a number greater than 0
    imageUrl: z.string(), // Must be a valid URL
    creatorId: z.string()
  });

  const parsedCourseSchema = courseSchema.safeParse(courseData);
  if(!parsedCourseSchema.success){
    console.log(parsedCourseSchema.error);
    res.status(400).json({
        message:"Invalid Credentials"
    })
    return;
  }

  try {
    await courseModel.create({
        title:title,
        description:description,
        price:price,
        imageUrl:imageUrl,
        creatorId:creatorId
    }) 

    res.send({
        message:"New course Added!"
    })
  } catch (e) {
    console.error(e);
    res.status(500).json({
        message:"An error occurred!. Please try again later."
    })
  }

})

adminRouter.put("/course",adminMiddleware, async function(req,res){
    const adminId = req.userId;
    const{title, description, price, imageUrl,courseId} = req.body;

    try {
        const course = await courseModel.findByIdAndUpdate(
            {
                _id:courseId,
                creatorId:adminId
            },
            {
                title:title,
                description:description,
                price:price,
                imageUrl:imageUrl
            })

            if(!course){
                res.status(400).json({
                    message:"Course doesn't exist"
                })
            }else{
                res.status(200).json({
                    message:"course updated",
                    courseId:course._id
                })
            }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message:"Error in updating! Please try again later."
        })
    }
})


adminRouter.delete("/course",async function(req,res){
    const adminId = req.userId;
    const {courseId} = req.body;

    try {
        const course = await courseModel.findOneAndDelete({
            adminId:adminId,
            _id:courseId
        })

        if(!course){
            res.status(400).json({
                message:"Course not found!"
            })
        }else{
            res.status(200).json({
                message:"Course deleted",
                courseId:courseId,
                adminId:adminId
            })
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message:"Error in deleting, please try again later."
        })
    }
})

module.exports = {
    adminRouter:adminRouter
}