const express = require("express");
const app = express();
const Joi = require("joi");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const port = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

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

// MongoDB connection setup
mongoose.connect("mongodb+srv://sbegay:shryb101@finalproject242.nrojfty.mongodb.net/?retryWrites=true&w=majority&appName=Finalproject242", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

// Schema and Model setup (Client's comment)
const commentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});
const Comment = mongoose.model("Comment", commentSchema);

// Handle client comment submissions
app.post("/api/comments", async (req, res) => {
    const { firstName, lastName, email, message } = req.body;
    const newComment = new Comment({
        firstName,
        lastName,
        email,
        message,
        date: Date.now() // Adding the current date when creating a new comment
    });
    try {
        const result = await newComment.save();
        const comments = await Comment.find(); // Retrieve all comments after adding the new one
        res.status(200).send(comments); // Return all comments
    } catch (error) {
        console.error('Error saving comment:', error);
        res.status(400).send("Internal server error.");
    }
});

const validateComment = (comment) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        email: Joi.string().min(3).required().email(),
        message: Joi.string().required(),
        date: Joi.date().iso().default(Date.now, 'current date') // Adding date field with default value of current date
    });
    return schema.validate(comment);
}

// Serve frontend files
app.use(express.static(path.join(__dirname, '../final-project/public')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../../final-project/public', 'index.html'));
});


// Get all comments
app.get("/api/comments", async (req, res) => {
    try {
        const comments = await Comment.find();
        res.send(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).send("Error fetching comments.");
    }
});

app.listen(3000, () => {
	console.log("listening...");
});




  

  
  
  

