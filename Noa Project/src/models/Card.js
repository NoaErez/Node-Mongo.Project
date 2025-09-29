const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 1000
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // קשר למשתמש
    ref: "User",
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  bizNumber: {
    type: Number,
    unique: true,
    required: true,
    index: true
  }
}, { timestamps: true });

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
