const express = require("express");
const app = express();
const Joi = require("joi");
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

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

// MongoDB connection setup
mongoose.connect("mongodb+srv://sbegay:shryb101@finalproject242.nrojfty.mongodb.net/?retryWrites=true&w=majority&appName=Finalproject242")
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

// Schema and Model setup (Client's comment)
const commentSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    date: { type: Date },
    email: { type: String },
    message: { type: String }
});

const Comment = mongoose.model('Client', commentSchema);

// Handle client booking submissions
app.post("/submit-contact-form", async (req, res) => {
    const { firstName, lastName, email, message } = req.body;
    const newComment = new Comment({
        firstName,
        lastName,
        email,
        message,
        date: new Date()
    });
    try {
        const result = await newComment.save();
        console.log(result);
        res.status(200).send("Form submitted successfully.");
    } catch (error) {
        console.error('Error saving client comments:', error);
        res.status(500).send("Internal server error.");
    }
});

// Start the server
app.listen(3000, () => {
  console.log("listening");
  });
  

  
  
  
