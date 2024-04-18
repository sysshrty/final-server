const express = require("express");
const app = express();
const Joi = require("joi");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

// MongoDB connection setup
mongoose.connect("mongodb+srv://sbegay:shryb101@finalproject242.nrojfty.mongodb.net/?retryWrites=true&w=majority&appName=Finalproject242")
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

// Schema and Model setup (Client's comment)
const commentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Comment = mongoose.model("Comment", commentSchema);

// Get all comments
app.get("/api/comments", async (req, res) => {
    try {
        const comments = await Comment.find();
        res.send(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).send("error.");
    }
});

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

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});



  

  
  
  

