const express = require('express');
const { getUnapprovedReviews, approveReview, rejectReview } = require('../controllers/adminController');
const router = express.Router();

// Route to get all unapproved reviews
router.get('/reviews/unapproved', getUnapprovedReviews);

// Route to approve a review by its ID
router.patch('/reviews/:id/approve', approveReview);

// Route to reject a review by its ID
router.delete('/reviews/:id/reject', rejectReview);

module.exports = router;
