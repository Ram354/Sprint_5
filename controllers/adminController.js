// controllers/adminController.js
const Review = require('../models/Review');
const NGO = require("../models/NGO");
const nodemailer = require("nodemailer");

// Get all unapproved reviews
exports.getUnapprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ approved: false });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unapproved reviews', error });
  }
};

// Approve a review by its ID
exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
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

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Find NGO by name and send email
exports.findAndEmailNGO = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ name: req.params.name });
    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    // Send email to NGO
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: ngo.email,
      subject: "Admin Inquiry Regarding Review",
      text: `Hello ${ngo.contactPerson},\n\nWe need your response regarding a recent review.\n\nThank you!`,
    });

    res.json({ message: `Email sent to ${ngo.name} at ${ngo.email}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NGO response to a review
exports.respondToReview = async (req, res) => {
  try {
    const { reviewId, responseMessage } = req.body;
    
    // Assume Review model exists and update the review with the NGO's response
    const review = await Review.findByIdAndUpdate(reviewId, { ngoResponse: responseMessage }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });

    res.json({ message: "Response recorded successfully", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
