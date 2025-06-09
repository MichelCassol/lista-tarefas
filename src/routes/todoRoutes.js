const express = require('express');
const todoController = require('../controllers/todoController');

const router = express.Router();

router
  .route('/')
  .get(todoController.getAllTodos)
  .post(todoController.createToDoList);

router
  .route('/:id')
  .get(todoController.getTodo)
  .put(todoController.updateTodoList)
  .delete(todoController.deleteTodoList);

module.exports = router; 