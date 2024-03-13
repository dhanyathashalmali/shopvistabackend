const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require('crypto-js');
const Cart = require('../models/Cart'); // Adjust the path based on your project structure

const router = require("express").Router();
//Create

router.post("/", verifyToken, async (req, res) => {
    const newCart = new Product(req.body)
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart)
    } catch (err) {
        return res.status(500).json(err)
    }
})

//Updating
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    // console.log("Request Body:", req.body);
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        return res.status(200).json(updatedCart)
    } catch (err) {
        return res.status(500).json(err);
    }
})

//Deleting
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        return res.status(200).json("Cart has been deleted..")
    } catch (err) {
        return res.status(500).json(err)
    }
})

//GET USER CART BY ID
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId })
        if (!cart) {
            return res.status(404).json("Cart not found");
        }
        return res.status(200).json(cart);
    } catch (err) {
        return res.status(500).json(err)
    }
})

//GET ALL 
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find()
        return res.status(200).json(carts)
    } catch (err) {
        return res.status(500).json(err)
    }
})


module.exports = router