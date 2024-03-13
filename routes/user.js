const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require('crypto-js');
const User = require('../models/User'); // Adjust the path based on your project structure

const router = require("express").Router();

//Updating
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    // console.log("Request Body:", req.body);
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString()
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        // console.log("Updated User:", updatedUser);
        return res.status(200).json(updatedUser)
    } catch (err) {
        // console.error("Error in findByIdAndUpdate:", err);
        return res.status(500).json(err);
    }
})

//Deleting
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        return res.status(200).json("User has been deleted..")
    } catch (err) {
        return res.status(500).json(err)
    }
})

//GET USER BY ID
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json("User not found");
        }

        // console.log(user);
        const sanitizedUser = user.toObject(); //To not show the password in the db after login
        delete sanitizedUser.password;

        return res.status(200).json({ ...sanitizedUser });
    } catch (err) {
        return res.status(500).json(err)
    }
})

//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const users = query
            ? await User.find().sort({ id: -1 }).limit(1)
            : await User.find()

        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json(err)
    }
})

//GET USER STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" }
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                }
            }
        ])
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router