const Task = require("../models/Task");
exports.createTask = async (req, res) => {
    try {
      const { title, description, status, dueDate } = req.body;
      const userId = req.query.userId;
  
      const parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate)) {
        return res.status(400).json({ message: "Invalid due date format" });
      }
  
      const newTask = new Task({
        title,
        description,
        status,
        dueDate: parsedDueDate,
        user: userId,
      });
  
      const savedTask = await newTask.save();
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(500).json({ message: "Error creating task", error: error.message });
    }
  };
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving tasks", error: error.message });
  }
};
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving task", error: error.message });
  }
};
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;
    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.remove();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
};
