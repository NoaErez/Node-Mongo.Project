const express = require("express");
const { cardSchema } = require("../validation/schemas");
const auth = require("../middlewares/auth");
const Card = require("../models/Card"); 
const router = express.Router();

async function generateBizNumber() {
  let bizNumber;
  let card;
  do {
    bizNumber = Math.floor(100000 + Math.random() * 900000); 
    card = await Card.findOne({ bizNumber });
  } while (card); 
  return bizNumber;
}

router.get("/", async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/my-cards", auth, async (req, res) => {
  try {
    const userCards = await Card.find({ userId: req.user.id });
    res.status(200).json(userCards);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.status(200).json(card);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "business") {
      return res.status(403).json({ error: "Only business users can create cards" });
    }

    const { error } = cardSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, content } = req.body;
    const newCard = new Card({
      title,
      content,
      userId: req.user.id,
      likes: 0,
      bizNumber
    });

    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    if (card.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "You can only edit your own cards" });
    }

    const { error } = cardSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    card.title = req.body.title || card.title;
    card.content = req.body.content || card.content;

    if (req.user.role === "admin" && req.body.bizNumber) {
      card.bizNumber = req.body.bizNumber;
    }

    await card.save();
    res.status(200).json({ message: "Card updated", card });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    card.likes++;
    await card.save();
    res.status(200).json({ message: "Card liked", card });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    if (card.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Only creator or admin can delete this card" });
    }

    await Card.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Card deleted", card });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
