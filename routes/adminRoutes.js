const express = require("express");
const {
  createReviewAndNotifyNGO,  // Updated function to create review and notify NGO
  respondToReview,
} = require("../controllers/adminController");

const router = express.Router();

// Route to create a review and automatically notify the associated NGO
router.post("/reviews/create", createReviewAndNotifyNGO);


module.exports = router;
