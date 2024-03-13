const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require('crypto-js');
const Product = require('../models/Product'); // Adjust the path based on your project structure

const router = require("express").Router();
//Create

router.post("/", async (req, res) => {
    const newProduct = new Product(req.body)
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct)
    } catch (err) {
        return res.status(500).json(err)
    }
})

//Updating
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    // console.log("Request Body:", req.body);
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        return res.status(200).json(updatedProduct)
    } catch (err) {
        return res.status(500).json(err);
    }
})

//Deleting
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        return res.status(200).json("Product has been deleted..")
    } catch (err) {
        return res.status(500).json(err)
    }
})

//GET PRODUCT BY ID
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json("Product not found");
        }
        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json(err)
    }
})

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.categories
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1)
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            })
        } else {
            products = await Product.find()
        }

        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json(err)
    }
})

module.exports = router