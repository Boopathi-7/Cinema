// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all routes

// MongoDB connection
const uri = process.env.MONGODB_URI;

mongoose.connect(uri,) .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the application if MongoDB connection fails
  });
  
  // Define schema and model
const cinemaSchema = new mongoose.Schema({
    movie: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: false }, // Optional field for image URL 
  });
  
  const Cinema = mongoose.model("Cinema", cinemaSchema);
  
  // Routes
  
  // Create a new post
  app.post("/api/cinema", async (req, res) => {
    try {
      const newCinema = new Cinema({
        movie: req.body.movie,
        description: req.body.description,
        image: req.body.image
      });
      const savedCinema = await newCinema.save();
      res.status(200).json(savedCinema);
    } catch (error) {
      res.status(500).json({ error: error.message});
}
});

// Get all posts
app.get("/api/cinema", async (req, res) => {
  try {
    const limit = Number(req.query.limit);
    const cinema = limit ? await Cinema.find().limit(limit) : await Cinema.find();
    res.status(200).json(cinema);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get post by ID
app.get("/api/cinema/:id", async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    if (cinema) {
      res.status(200).json(cinema);
    } else {
      res.status(404).json({ error: "cinema not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a post by ID
app.put("/api/cinema/:id", async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // Ensure the updated data is validated
    });
    if (cinema) {
      res.status(200).json(cinema);
    } else {
      res.status(404).json({ error: "cinema not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a post by ID
app.delete("/api/cinema/:id", async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndDelete(req.params.id);
    if (cinema) {
      res.status(200).json({ message: "cinema deleted successfully" });
    } else {
      res.status(404).json({ error: "cinema not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});