const Payment = require("../models/Payment");
const analyzePayment = require("../services/aiService");

const analyzePaymentById = async (req, res) => {
  try {
    console.log("Payment ID:", req.params.id);

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    const analysis = analyzePayment(payment);

    res.status(200).json({
      success: true,
      payment: payment,
      analysis: analysis,
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);

    res.status(500).json({
      message: "AI analysis failed",
      error: error.message,
    });
  }
};

module.exports = {analyzePaymentById};