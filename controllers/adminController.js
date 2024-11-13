// controllers/adminController.js
const Review = require('../models/Review');
const NGO = require("../models/NGO");
const { sendNotification } = require("../utils/notification"); // Import sendNotification

// Get all unapproved reviews
exports.getUnapprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ approved: false });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unapproved reviews', error });
  }
};

exports.approveReview = async (req, res) => {
  try {
    // Approve the review by updating the approved status
    const review = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    // Find the NGO associated with the review
    const ngo = await NGO.findOne({ name: review.ngoName });
    if (!ngo) {
      console.warn("No NGO found with the specified name in the review.");
      return res.status(404).json({ message: 'Associated NGO not found for this review.' });
    }

    // Ensure ngo.email exists before sending notification
    if (ngo.email) {
      await sendNotification(ngo.email, 'Review Approved', 'A review associated with your NGO has been approved.');
    } else {
      console.warn("No email address found for the associated NGO.");
    }

    res.json({ message: 'Review approved', review });
  } catch (error) {
    res.status(500).json({ message: 'Error approving review', error });
  }
};




// Reject (delete) a review by its ID
exports.rejectReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    res.json({ message: 'Review rejected and deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting review', error });
  }
};

// Find NGO by name and send email
exports.findAndEmailNGO = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ name: req.params.name });
    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    // Ensure ngo.email exists before attempting to send email
    if (ngo.email) {
      await sendNotification(ngo.email, "Admin Inquiry Regarding Review", 
        `Hello ${ngo.contactPerson},\n\nWe need your response regarding a recent review.\n\nThank you!`);
      res.json({ message: `Email sent to ${ngo.name} at ${ngo.email}` });
    } else {
      console.warn("No email address found for this NGO.");
      res.status(404).json({ message: "No email address available for the NGO." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// NGO response to a review
exports.respondToReview = async (req, res) => {
  try {
    const { reviewId, responseMessage } = req.body;
    
    const review = await Review.findByIdAndUpdate(reviewId, { ngoResponse: responseMessage }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });

    res.json({ message: "Response recorded successfully", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
