const express = require("express");
const { analyzePaymentById } = require("../controllers/aiControllers");

const router = express.Router();

router.get("/:id", analyzePaymentById);

module.exports = router;