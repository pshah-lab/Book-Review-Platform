const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: [true, "Book ID is required"]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"]
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"]
  },
  reviewText: {
    type: String,
    required: [true, "Review text is required"],
    trim: true,
    minlength: [10, "Review must be at least 10 characters"],
    maxlength: [1000, "Review cannot exceed 1000 characters"]
  }
}, {
  timestamps: true
});

// Ensure one review per user per book
ReviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

// Populate user details when querying reviews
ReviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: "userId",
    select: "name email avatar"
  });
  next();
});

module.exports = mongoose.model("Review", ReviewSchema);
