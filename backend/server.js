const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const paymentRoutes = require("./routes/paymentRoutes");
const aiRoutes = require("./routes/aiRoutes")

require("dotenv").config();

const app = express();

const PORT = 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/payments", paymentRoutes)
app.use("/api/ai", aiRoutes)


app.get("/", (req, res) => {
  res.send("AI Payment Recovery Backend is running");
});


app.listen(PORT, () => {
  console.log(`Backend is Running on http://localhost:${PORT}`);
});