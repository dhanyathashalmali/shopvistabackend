const router = require("express").Router();
const stripe = require("stripe")("sk_test_51OjI2pSF9sHOGWxV1IQqaDIc2MgTvhsANBqNYBnWDSy8PXpkZ6LO1QA2UIrEnRUymjP2piR2YOzW9azijvZw5JNM00Gl2v4Q8D");

router.post("/", async (req, res) => {
    console.log(req.body);

    const { products } = req.body.products;

    const lineItems = products.map((product) => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: product.title,
            },
            unit_amount: Math.round(Number(product.price) * 100),
        },
        quantity: product.quantity,
    }));

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;
