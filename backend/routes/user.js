const { Router } = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const {JWT_USER_PASSWORD} = require("../config");
const { userMiddleware } = require("../middleware/user");

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    
    try {
        await userModel.create({
            email,
            password,
            firstName,
            lastName
        })
        res.json({
            message: "signed up"
        })
    }catch(e) {
        res.status(403).json({
            message: "Wrong credentials"
        })
    }
})

userRouter.post("/signin", async (req, res) => {
    const {email, password } = req.body;

    const user = await userModel.findOne({
        email,
        password
    })

    if(user) {
        const token = jwt.sign({
            id: user._id
        }, JWT_USER_PASSWORD)
        res.json({
            token 
        })
    }else {
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
})

userRouter.get("/purchases", userMiddleware, async (req, res) => {
    const userId = req.userId
    const purchases = await purchaseModel.find({
        userId
    })

    // let purchasedCouorseIds = []

    // for(let i=0; i<purchases.length; i++){
    //     purchasedCouorseIds.push(purchases[i].courseId)
    // }

     const courseData = await courseModel.find({
        _id: {$in: purchases.map(x => x.courseId)}
     })
    res.json({
        purchases,
        courseData
    })
})

module.exports = {
    userRouter
}