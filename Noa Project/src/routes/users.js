const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { registerSchema, loginSchema } = require("../validation/schemas");
const auth = require("../middlewares/auth");
const User = require("../models/User");
const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, name, password, role, isBusiness, bizNumber } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      role: role || "user",
      isBusiness: isBusiness || false,
      bizNumber: bizNumber || null, 
    });

    await newUser.save();

    res.status(201).json({
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      isBusiness: newUser.isBusiness,
      bizNumber: newUser.bizNumber,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }


    if (user.lockUntil && user.lockUntil > Date.now()) {
      const hoursLeft = Math.ceil((user.lockUntil - Date.now()) / (1000 * 60 * 60));
      return res.status(403).json({ error: `Account locked. Try again in ${hoursLeft}h` });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      user.failedAttempts += 1;

      if (user.failedAttempts >= 3) {
        user.lockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 שעות
        await user.save();
        return res.status(403).json({ error: "Account locked for 24h due to multiple failed attempts" });
      }

      await user.save();
      return res.status(401).json({ error: "Invalid credentials" });
    }


    user.failedAttempts = 0;
    user.lockUntil = null;
    await user.save();


    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        isBusiness: user.isBusiness,
        bizNumber: user.bizNumber,
      },
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }
    const user = await User.findById(req.params.id, "-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.user.id !== user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    user.email = req.body.email || user.email;
    user.name = req.body.name || user.name;
    await user.save();

    res.status(200).json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isBusiness = req.body.isBusiness === true;
    await user.save();

    res.status(200).json({ message: "Business status updated", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted", deletedUser });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

