const Review = require('../models/Review');
const NGO = require("../models/NGO");
const { sendNotification } = require("../utils/notification"); // Import sendNotification

// This function will be used to handle new reviews and directly notify the NGO
exports.createReviewAndNotifyNGO = async (req, res) => {
  try {
    // Create a new review from the request body
    const review = new Review(req.body);
    
    // Save the review to the database
    await review.save();

    // Find the NGO associated with the review
    const ngo = await NGO.findOne({ name: review.ngoName });
    if (!ngo) {
      console.warn("No NGO found with the specified name in the review.");
      return res.status(404).json({ message: 'Associated NGO not found for this review.' });
    }

    // Ensure ngo.email exists before sending notification
    if (ngo.email) {
      // Send notification email to the NGO
      await sendNotification(
        ngo.email,
        'New Review Submitted for Your NGO',
        `Hello ${ngo.contactPerson},\n\nA new review has been submitted that mentions your NGO. Please review it and provide any necessary feedback.\n\nThank you!`
      );
      res.json({ message: `Review created and notification sent to ${ngo.name} at ${ngo.email}` });
    } else {
      console.warn("No email address found for the associated NGO.");
      res.status(404).json({ message: "No email address available for the NGO." });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating review and notifying NGO', error });
  }
};
