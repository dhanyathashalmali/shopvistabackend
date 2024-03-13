const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const cors = require("cors"); // Require the CORS package

const userRoute = require("./routes/user");
const newUser = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe"); // Import the Stripe route


dotenv.config();

// Use CORS middleware to enable CORS
app.use(cors());

app.use(express.json());
app.use("/api/auth", newUser);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/create-checkout-session", stripeRoute);
app.use(express.static('public'));
// Define route for /success
app.post('/success', (req, res) => {
    const { stripeData, products } = req.body;
})
app.get('/', (req, res) => {
    res.send('Hello from ShopVista backend!');
});
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB connection successful"))
    .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`The Backend server is running on port ${PORT}`));
