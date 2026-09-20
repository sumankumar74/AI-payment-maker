const Payment = require("../models/Payment");


const updateRecovery = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { action } = req.body;

        const payment = await Payment.findById(paymentId);

        if (!paymentId) {
            return res.status(404).json({
                message: "Payment not found"
            })
        }
        payment.recover = {
            action,
            status: "completed",
            timestamp: new Date()
        }
        await payment.save();

        res.json({
            message: "Recovery action recorded successfully",
            recovery: payment.recovery
        })
    }
    catch(error){
         res.status(500).json({
      message: "Recovery action failed",
      error: error.message
    });
    }
};
module.exports = {updateRecovery};