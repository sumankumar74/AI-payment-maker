const express = require("express");
const { analyzePaymentById } = require("../controllers/aiControllers");
    
const router = express.router();

router.get("%id", analyzePaymentById);

module.export = router;
