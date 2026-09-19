const Payment = require("../models/Payment");
const analyzePayment = require("../services/aiService");


const analyzePaymentById = async(requestAnimationFrame, res)=>{
    try{
        const payment = await Payment.findById(req.params.id);

        if(!payment){
            return res.status(404).json({
                message:"Payment not found",
            });
        }
        const analysis = analyzePayment(payment);
        res.json({
            payment,
            analysis
        });
    }catch(error){
        res.status(500).json({
            message:"AI analysis failed",
            error: error.message,
        });
    }
}
module.exports ={analyzePaymentById}