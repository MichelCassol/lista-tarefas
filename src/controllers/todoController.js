const Todo = require('../models/todoModel');

// Get all todos
exports.getAllTodos = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    // Implementar busca se o parâmetro "search" for fornecido
    if (search) {
      query = { $text: { $search: search } };
    }
    
    const todos = await Todo.find(query).sort({ name: 1 });
    
    res.status(200).json({
      status: 'success',
      results: todos.length,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get a single todo
exports.getTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        status: 'error',
        message: 'Tarefa não encontrada'
      });
    }
    
    // Garantir que o objeto retornado tem a mesma estrutura
    // esperada pelo frontend
    res.status(200).json({
      status: 'success',
      data: {
        _id: todo._id,
        tarefa: todo.tarefa,
        start_date: todo.start_date,
        end_date: todo.end_date,
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create a new todo
exports.createToDoList = async (req, res) => {
  try {
    const newTodo = await Todo.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: newTodo
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update a contact
exports.updateTodoList = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!todo) {
      return res.status(404).json({
        status: 'error',
        message: 'Tarefa não encontrada'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: todo
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete a todo
exports.deleteTodoList = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        status: 'error',
        message: 'Tarefa não encontrada'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}; 