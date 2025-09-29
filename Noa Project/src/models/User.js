const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,   // מונע כפילות
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["user", "business", "admin"],
    default: "user"
  },
  isBusiness: {
    type: Boolean,
    default: false
  },
  failedAttempts: {
  type: Number,
  default: 0,
},
lockUntil: {
  type: Date,
  default: null,
}
}, { timestamps: true }); // יוצר createdAt + updatedAt אוטומטית

const User = mongoose.model("User", userSchema);
module.exports = User;
