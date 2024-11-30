const { Router } = require("express");
const jwt = require("jsonwebtoken")
const { adminModel, courseModel } = require("../db")
const adminRouter = Router();
const {JWT_ADMIN_PASSWORD} = require("../config");
const { adminMiddleware } = require("../middleware/admin");

adminRouter.post("/signup", async (req, res) => {
    const {email, password, firstName, lastName} = req.body;
    
    try{
        await adminModel.create({
            email,
            password,
            firstName,
            lastName
        })
        res.json({
            message: "You are signed up"
        })
    }catch(e){
        res.json({
            message: "Incorrect Credentials"
        })
    }
})

adminRouter.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({
        email,
        password
    })
    if(admin){
        const token = jwt.sign({
            id: admin._id
        }, JWT_ADMIN_PASSWORD)
        res.json({
            token
        })
    }else{
        res.status(403).json({
            message: "Invalid input"
        })
    }
})

adminRouter.post("/course", adminMiddleware, async (req, res) => {
    const adminId = req.userId;
    const { title, description, imageUrl, price } = req.body;

    const course = await courseModel.create({
        title,
        description,
        imageUrl,
        price,
        creatorId: adminId
    })
    res.json({
        message: "course created",
        courseId: course._id
    })
}) 

adminRouter.put("/course", async (req, res) => {
    const adminId = req.userId;
    const { title, description, imageUrl, price, courseId } = req.body;

    const course = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    },
        {
        title,
        description,
        imageUrl,
        price
    })
    res.json({
        message: "course updated",
        courseId: course._id
    })
})

adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
    const adminId = req.userId

    const courses = await courseModel.find({
        creatorId: adminId
    });

    res.json({
        message: "Course Updated",
        courses
    })
})

module.exports = { 
    adminRouter
}