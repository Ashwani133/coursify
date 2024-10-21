const {Router,application} = require("express");
const userRouter = Router();
const {userModel, courseModel, purchaseModel}= require("../db")
const { z } = require("zod");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const{JWT_USER_PASSWORD} = require('../config')
const{userMiddleware} = require('../middleware/user')


userRouter.post("/signup",async function(req,res){
    console.log("hit user signup post request");
    const{email,name,password} = req.body;
    const userData = {
        email:email,
        name:name,
        password:password
    }
    const userSchema = z.object({
        email:z.string().min(6).max(100).email(),
        name:z.string().min(3).max(100)
        .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" }),
        password:z.string().min(6).max(100)
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/\d/, { message: "Password must contain at least one number" })
        .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character (@, $, !, %, *, ?, &)" })
    })

    const parsedUserData = userSchema.safeParse(userData);
    if(!parsedUserData.success){
        res.status(400).json({
            message:"Please enter valid details",
            error:parsedAdminData.error
        })
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password,10);
        await userModel.create({
            email:email,
            name:name,
            password:hashedPassword
        })
        res.status(200).json({
            message:"New user signed up!"
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message:"An internal error occured, please try again later!"
        })
    }
})

userRouter.post("/signin",async function(req,res){
    const{email,password} = req.body;
    const userSigninData = {
        email:email,
        password:password
    }

    const userSigninSchema = z.object({
        email:z.string().min(6).max(100).email(),
        password:z.string().min(6).max(100)
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/\d/, { message: "Password must contain at least one number" })
        .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character (@, $, !, %, *, ?, &)" })
    })

    const parsedUserSigninData = userSigninSchema.safeParse(userSigninData);
    if(!parsedUserSigninData.success){
        res.status(400).json({
            message:"Invalid credentials!"
        })
        return;
    }

    try {
        const response = await userModel.findOne({email:email})
        if(!response){
            res.status(403).json({
                message:"User does not exist!"
            })
            return;
        }

        const passwordMatched = await bcrypt.compare(password,response.password)
        if(passwordMatched){
            const token =  jwt.sign({
                id:response._id
            },JWT_USER_PASSWORD)

            res.json({
                token:token
            })

        }else{
            res.status(403).json({
                message:"Invalid credentials!"
            })
        }
    } catch (e) {
        res.status(500).json({
            message:"An internal error occured! Please try again later!",
            error:e.message
        })
    }
})

userRouter.post("/purchases", userMiddleware, async function(req,res){
    const{ courseId} = req.body;
    const userId = req.userId;
    try{
        await purchaseModel.create({
            userId:userId,
            courseId:courseId
        })
        res.send({
            message:"New course purchased!"
        })
    }catch(e){
        res.status(403)
    }
})

userRouter.get("/purchases",userMiddleware,async function(req,res){
    const userId = req.userId;
    const purchases = await purchaseModel.find({
        userId:userId
    })
    const purchaseCourseIds = [];
    for(let i = 0; i < purchases.length; i++){
        purchaseCourseIds.push(purchases[i].courseId);
    }

    const courseData = await courseModel.find({
        _id:{$in: purchaseCourseIds}
    })

    res.json({
        purchases,
        courseData
    })
})

module.exports = {
    userRouter:userRouter
}

