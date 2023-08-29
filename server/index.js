// this will contain our mongoDB connection string
require("dotenv").config();

// cors: Cross origin resource sharing (allows us to fetch the data, so both websites can communication i.e. the frontend and the backend)
const cors = require("cors");

// express is used to start our server
const express = require("express");

const connectDB = require("./connectDB");

const Book = require("./models/Books");


// to create an express application
const app = express();

const PORT = process.env.PORT || 8000;

connectDB();
// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));




// creating a route
app.get("/api/books", async (req, res) => {
  try {

    const category = req.query.category;

    const filter = {};

    if (category) {
      filter.category = category;
    }


    const data = await Book.find(filter);
    res.json(data);
  } catch (error) {
    res.status(500).json({error: "An error occurred while fetching books."})
  }
})


app.get("/api/books/:slug", async (req, res) => {
  try {

    const slugParam = req.params.slug;

    const data = await Book.find({ slug: slugParam});
    res.json(data);
  } catch (error) {
    res.status(500).json({error: "An error occurred while fetching books."})
  }
})




app.get("/", (req, res) => {
  res.json("Hello There!");
});

app.get("*", (req, res) => {
  res.sendStatus("404");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
