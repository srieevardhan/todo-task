require("dotenv").config();

const app = require("./app");
const { connectDB } = require("./config/db");
const { syncDB } = require("./models");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 🔴 THESE TWO WERE MISSING / NOT RUNNING
    await connectDB();
    await syncDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
  }
};

startServer();
