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

// Get a single contact
exports.getTodo = async (req, res) => {
  try {
    const contact = await Todo.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contato não encontrado'
      });
    }
    
    // Garantir que o objeto retornado tem a mesma estrutura
    // esperada pelo frontend
    res.status(200).json({
      status: 'success',
      data: {
        _id: contact._id,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        address: contact.address,
        notes: contact.notes,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create a new contact
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
    const contact = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contato não encontrado'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete a contact
exports.deleteTodoList = async (req, res) => {
  try {
    const contact = await Todo.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contato não encontrado'
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