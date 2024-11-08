const Review = require('../models/Review');
const WebsiteReview = require('../models/WebsiteReview');

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
