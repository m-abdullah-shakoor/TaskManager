const express = require('express');
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/TaskController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/create', auth, createTask);
router.get('/fetchall', auth, getAllTasks);
router.get('/tasks/:id', auth, getTaskById);
router.put('/tasks/:id', auth, updateTask);
router.delete('/tasks/:id', auth, deleteTask);

module.exports = router;
