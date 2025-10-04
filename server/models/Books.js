const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true,
    maxlength: [50, "Author name cannot exceed 50 characters"]
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"]
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    enum: ["Fiction", "Non-Fiction", "Mystery", "Romance", "Science Fiction", "Fantasy", "Thriller", "Biography", "History", "Self-Help", "Other"],
    default: "Other"
  },
  year: {
    type: Number,
    required: [true, "Published year is required"],
    min: [1000, "Year must be valid"],
    max: [new Date().getFullYear(), "Year cannot be in the future"]
  },
  thumbnail: {
    type: String,
    default: ""
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create slug from title
BookSchema.pre("save", function(next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Virtual for slug
BookSchema.virtual("slug").get(function() {
  return this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
});

// Populate addedBy when querying books
BookSchema.pre(/^find/, function(next) {
  this.populate({
    path: "addedBy",
    select: "name email"
  });
  next();
});

module.exports = mongoose.model("Book", BookSchema);
