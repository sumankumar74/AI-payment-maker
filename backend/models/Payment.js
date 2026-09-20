const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema(
    {
        customer: {
            type: String,
            reuired: true,
        },
        amount: {
            type: Number,
            reuired: true,
        },
        status: {
            type: String,
            requird: true,
        },
        reason: {
            type: String,
            requird: true,
        },
        attempts: {
            type: Number,
            default: 1,
        },
        previousSuccessfulPayments: {
            type: Number,
            default: 0,
        },
        date: {
            type: Date,
            default: Date.now
        },
        recovery: {
            action: {
                type: String,
                enum: ["retry", "reminder", "human_review", null],
                default: null
            },
            status: {
                type: String,
                enum: ["not_started", "in_progress", "completed"],
                default: "not_started"
            },
            timestamp: {
                type: Date,
                default: null
            }
        }
    }
);
module.exports = mongoose.model("Payment", paymentSchema)