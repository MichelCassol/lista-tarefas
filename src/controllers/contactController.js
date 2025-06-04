const Contact = require('../models/contactModel');

// Get all contacts
exports.getAllContacts = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    // Implementar busca se o parâmetro "search" for fornecido
    if (search) {
      query = { $text: { $search: search } };
    }
    
    const contacts = await Contact.find(query).sort({ name: 1 });
    
    res.status(200).json({
      status: 'success',
      results: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get a single contact
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
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
exports.createContact = async (req, res) => {
  try {
    const newContact = await Contact.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: newContact
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update a contact
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
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
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
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