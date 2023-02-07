const express = require("express");
const router = express.Router();
const momoService = require("../services/momo.service");

router.post("/buy", async (req, res) => {
  console.log("req body", req.body);
  const response = await momoService.initiatePaymentMethod(req.body);
  console.log("payUrl", response.payUrl);
  res.json({ payUrl: response.payUrl });
});

module.exports = router;
