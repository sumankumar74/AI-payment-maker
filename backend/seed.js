require("dotenv").config();

const connectDB = require("./config/database");
const Payment = require("./models/Payment");

const payments = [
  {
    customer: "Rahul",
    amount: 2499,
    status: "Failed",
    reason: "Bank declined",
    attempts: 1,
    previousSuccessfulPayments: 8,
  },
  {
    customer: "Priya",
    amount: 1299,
    status: "Failed",
    reason: "Payment timeout",
    attempts: 1,
    previousSuccessfulPayments: 5,
  },
  {
    customer: "Amit",
    amount: 8999,
    status: "Failed",
    reason: "Insufficient funds",
    attempts: 2,
    previousSuccessfulPayments: 2,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await Payment.deleteMany();

    await Payment.insertMany(payments);

    console.log("Sample payments added successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error adding sample payments:", error.message);
    process.exit(1);
  }
};

seedDatabase();