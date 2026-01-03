const { Task } = require("../models");

// CREATE TASK
const createTask = async (req, res) => {
  const { title, status, deadline } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const task = await Task.create({
    title,
    status,
    deadline, // Save deadline
    userId: req.user.id,
  });

  res.status(201).json(task);
};

// GET TASKS
const getTasks = async (req, res) => {
  const tasks = await Task.findAll({
    where: { userId: req.user.id },
  });
  res.json(tasks);
};

// UPDATE TASK
const updateTask = async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  await task.update(req.body);
  res.json(task);
};

// DELETE TASK
const deleteTask = async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  await task.destroy();
  res.json({ message: "Task deleted" });
};

// DASHBOARD STATS
const getStats = async (req, res) => {
  const tasks = await Task.findAll({ where: { userId: req.user.id } });

  const stats = {
    todo: tasks.filter(t => t.status === "Todo").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    completed: tasks.filter(t => t.status === "Completed").length,
  };

  res.json(stats);
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getStats,
};
