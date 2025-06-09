const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  tarefa: {
    type: String,
    required: [true, 'A descrição da tarefa é obrigatória'],
    trim: true
  },
  start_date: {
    type: Date,
    required: [true, 'A data inicial é obrigatória'],
    trim: true
  },
  end_date: {
    type: Date,
    trim: true
  },
}, {
  timestamps: true
});

// Criar um índice para facilitar a busca por nome ou telefone
todoSchema.index({ tarefa: 'text', start_date: 'text' });

const Todo = mongoose.model('to_do', todoSchema);

module.exports = Todo; 