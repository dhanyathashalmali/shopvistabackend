const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require('crypto-js');
const Order = require('../models/Order'); // Adjust the path based on your project structure

const router = require("express").Router();
//Create

router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder)
    } catch (err) {
        return res.status(500).json(err)
    }
})

//Updating
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    // console.log("Request Body:", req.body);
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        return res.status(200).json(updatedOrder)
    } catch (err) {
        return res.status(500).json(err);
    }
})

//Deleting
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        return res.status(200).json("Order has been deleted..")
    } catch (err) {
        return res.status(500).json(err)
    }
})

//GET USER ORDER BY ID
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
        if (!orders) {
            return res.status(404).json("Order not found");
        }
        return res.status(200).json(orders);
    } catch (err) {
        return res.status(500).json(err)
    }
})

//GET ALL 
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
        return res.status(200).json(orders)
    } catch (err) {
        return res.status(500).json(err)
    }
})

//GET MONTHLY INCOME
router.post("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))
    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                }
            }
        ])
        res.status(200).json(income)
    } catch (err) {
        res.status(500).json(err)
    }

})


module.exports = router