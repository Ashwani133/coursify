const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

function adminMiddleware(req,res,next){
    const token = req.headers.token;
    console.log("token received in auth: ",token);
    const decodedData = jwt.verify(token,JWT_ADMIN_PASSWORD);
    if(decodedData){
        req.userId = decodedData.id; 
        next()
    }else{
        res.json({
            message:"You are not logged in!"
        })
    }
}

module.exports = {
    adminMiddleware:adminMiddleware
}