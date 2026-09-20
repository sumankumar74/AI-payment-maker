const express = require("express");
const router = express.Router();

const {
  updateRecovery
} = require("../controllers/recoveryController");

router.post("/:paymentId", updateRecovery);

module.exports = router;