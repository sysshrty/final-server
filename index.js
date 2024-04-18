const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to store uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Filename for the uploaded file
    }
});

const upload = multer({ storage: storage });

app.use(express.static("public")); // Serve static files
app.use("/uploads", express.static("uploads")); // Serve uploaded files
app.use(express.json());
app.use(cors());

// MongoDB connection setup
mongoose.connect("mongodb://localhost/comments")
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

// Schema and Model setup (Client's comment)
const commentSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    message: { type: String },
    date: { type: Date, default: Date.now } // Adding the date field
});

const Comment = mongoose.model("Comment", commentSchema);

// Handle client comment submissions
app.post("/api/comments", async (req, res) => {
    const { firstName, lastName, email, message } = req.body;
    const newComment = new Comment({
        firstName,
        lastName,
        email,
        message
    });
    try {
        const result = await newComment.save();
        console.log(result);
        res.status(200).send("Comment submitted successfully.");
    } catch (error) {
        console.error('Error saving comment:', error);
        res.status(500).send("Internal server error.");
    }
});

// Get all comments
app.get("/api/comments", async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).send("Internal server error.");
    }
});


// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});


  

  
  
  
