const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Card = require("../models/Card");

const generateInitialData = async () => {
  try {
    const usersCount = await User.countDocuments();
    if (usersCount === 0) {
      console.log("🔄 No users found, creating initial data...");

      const hashedPassword = await bcrypt.hash("123456", 10);
      const regularUser = new User({
        email: "user@example.com",
        name: "Regular User",
        password: hashedPassword,
        role: "user",
        isBusiness: false,
      });
      const businessUser = new User({
        email: "business@example.com",
        name: "Business User",
        password: hashedPassword,
        role: "business",
        isBusiness: true,
      });
      const adminUser = new User({
        email: "admin@example.com",
        name: "Admin User",
        password: hashedPassword,
        role: "admin",
        isBusiness: false,
      });

      await regularUser.save();
      await businessUser.save();
      await adminUser.save();

      const card1 = new Card({ title: "Card 1", content: "Content for card 1", userId: businessUser._id });
      const card2 = new Card({ title: "Card 2", content: "Content for card 2", userId: businessUser._id });
      const card3 = new Card({ title: "Card 3", content: "Content for card 3", userId: adminUser._id });

      await card1.save();
      await card2.save();
      await card3.save();

      console.log("✅ Initial data created!");
    } else {
      console.log("ℹ️ Users already exist, skipping initial data.");
    }
  } catch (err) {
    console.error("❌ Error creating initial data:", err.message);
  }
};

module.exports = generateInitialData;
