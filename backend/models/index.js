const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

// --- USER MODEL ---
const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// --- TASK MODEL ---
const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Todo", "In Progress", "Completed"),
    defaultValue: "Todo",
  },
  deadline: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

// --- ASSOCIATIONS ---
User.hasMany(Task, { foreignKey: "userId" });
Task.belongsTo(User, { foreignKey: "userId" });

// --- SYNC FUNCTION ---
const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Models synced successfully");
  } catch (error) {
    console.error("❌ Model sync failed:", error.message);
  }
};

module.exports = { sequelize, User, Task, syncDB };