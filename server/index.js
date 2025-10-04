// this will contain our mongoDB connection string
require("dotenv").config();

// cors: Cross origin resource sharing (allows us to fetch the data, so both websites can communication i.e. the frontend and the backend)
const cors = require("cors");
const multer = require("multer");

// express is used to start our server
const express = require("express");

const connectDB = require("./connectDB");
const Book = require("./models/Books");
const Review = require("./models/Review");
const { auth } = require("./middleware/auth");

// Import routes
const authRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/reviews");

// to create an express application
const app = express();

const PORT = process.env.PORT || 8000;

connectDB();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// creating a route
app.get("/api/books", async (req, res) => {
  try {
    const { page = 1, limit = 5, genre, search, sort = "createdAt" } = req.query;
    
    const filter = {};

    // Filter by genre
    if (genre && genre !== "All") {
      filter.genre = genre;
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } }
      ];
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case "title":
        sortOption = { title: 1 };
        break;
      case "author":
        sortOption = { author: 1 };
        break;
      case "year":
        sortOption = { year: -1 };
        break;
      case "rating":
        sortOption = { averageRating: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const books = await Book.find(filter)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Book.countDocuments(filter);

    res.status(200).json({
      success: true,
      books,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error("Get books error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching books.",
      error: error.message
    });
  }
});


app.get("/api/books/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const book = await Book.findOne({ slug });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    res.status(200).json({
      success: true,
      book
    });
  } catch (error) {
    console.error("Get book error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the book.",
      error: error.message
    });
  }
});


// to add a new book
app.post("/api/books", auth, upload.single("thumbnail"), async (req, res) => {
  try {
    const { title, author, description, genre, year } = req.body;

    // Validation
    if (!title || !author || !description || !genre || !year) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    const newBook = new Book({
      title,
      author,
      description,
      genre,
      year: parseInt(year),
      thumbnail: req.file ? req.file.filename : "",
      addedBy: req.user._id
    });

    await newBook.save();
    
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      book: newBook
    });
  } catch (error) {
    console.error("Create book error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the book",
      error: error.message
    });
  }
});



// to update an existing book
app.put("/api/books/:id", auth, upload.single("thumbnail"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, genre, year } = req.body;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    // Check if user owns the book
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this book"
      });
    }

    const updateBook = {
      title,
      author,
      description,
      genre,
      year: parseInt(year)
    };

    if (req.file) {
      updateBook.thumbnail = req.file.filename;
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updateBook, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book: updatedBook
    });
  } catch (error) {
    console.error("Update book error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the book",
      error: error.message
    });
  }
});



app.delete("/api/books/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    // Check if user owns the book
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this book"
      });
    }

    // Delete all reviews for this book
    await Review.deleteMany({ bookId: id });

    // Delete the book
    await Book.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully"
    });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the book",
      error: error.message
    });
  }
});


app.get("/", (req, res) => {
  res.json("Hello There!");
});

app.get("*", (req, res) => {
  res.sendStatus("404");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});