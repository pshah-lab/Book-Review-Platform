const express = require("express");
const Review = require("../models/Review");
const Book = require("../models/Books");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { bookId, rating, reviewText } = req.body;

    // Validation
    if (!bookId || !rating || !reviewText) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      bookId,
      userId: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this book"
      });
    }

    // Create review
    const review = await Review.create({
      bookId,
      userId: req.user._id,
      rating,
      reviewText
    });

    // Update book's average rating and review count
    await updateBookRating(bookId);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

// @route   GET /api/reviews/book/:bookId
// @desc    Get all reviews for a book
// @access  Public
router.get("/book/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ bookId })
      .populate("userId", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ bookId });

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, reviewText } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if user owns the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review"
      });
    }

    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rating, reviewText },
      { new: true, runValidators: true }
    ).populate("userId", "name email avatar");

    // Update book's average rating
    await updateBookRating(review.bookId);

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if user owns the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review"
      });
    }

    await Review.findByIdAndDelete(id);

    // Update book's average rating
    await updateBookRating(review.bookId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

// Helper function to update book rating
const updateBookRating = async (bookId) => {
  try {
    const reviews = await Review.find({ bookId });
    
    if (reviews.length === 0) {
      await Book.findByIdAndUpdate(bookId, {
        averageRating: 0,
        reviewCount: 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Book.findByIdAndUpdate(bookId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      reviewCount: reviews.length
    });
  } catch (error) {
    console.error("Update book rating error:", error);
  }
};

module.exports = router;
