const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'O telefone é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, forneça um endereço de email válido'
    ]
  },
  address: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Criar um índice para facilitar a busca por nome ou telefone
contactSchema.index({ name: 'text', phone: 'text' });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact; 