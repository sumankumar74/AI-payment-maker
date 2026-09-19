const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema(
    {
        customer:{
            type: String,
            reuired: true,
        },
        amount:{
            type: Number,
            reuired: true,
        },
        status:{
            type:String,
            requird: true,
        },
        reason:{
            type:String,
            requird:true,
        },
        attempts:{
            type:Number,
            default:1,
        }, 
        previousSuccessfulPayments:{
            type:Number,
            default:0,
        },
        date: {
             type: Date, 
             default: Date.now
         },
    }
);
module.exports = mongoose.model("Payment", paymentSchema)