require('dotenv').config()
console.log(process.env.MONGODB_URL)
const express = require("express")
const mongoose = require('mongoose')

const {adminRouter} = require('./routes/admin');
const {userRouter} = require('./routes/user');
const {courseRouter} = require('./routes/course');

const app = express();
app.use(express.json());


app.use("/api/v1/admin",adminRouter)
// app.use("/api/v1/user",userRouter)
// app.use("/api/v1/course",courseRouter)


async function main(){
    await mongoose.connect(process.env.MONGODB_URL);
    app.listen(3000)
    console.log("Listening on port 3000");
}

main();
