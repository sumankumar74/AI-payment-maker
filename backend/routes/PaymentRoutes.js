const express = require("express");
const Payment = require("../models/Payment");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const payments = await Payment.find().sort({ date: -1 });

        res.json(payments);
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch payments",
            error: error.message,
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const payment = await Payment.create(req.body);

        res.status(201).json(payment);
    }
    catch (error) {
        res.status(400).json({
            message: "Failed to create payment",
            error: error.message,
        });
    }
});

module.exports = router;