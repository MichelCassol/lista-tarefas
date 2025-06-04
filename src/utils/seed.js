const mongoose = require('mongoose');
const Contact = require('../models/contactModel');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lista-telefonica';

// Dados iniciais para popular o banco
const initialContacts = [
  {
    name: 'João Silva',
    phone: '31987654321',
    email: 'joao@example.com',
    address: 'Av. Brasil, 100',
    notes: 'Contato de trabalho'
  },
  {
    name: 'Maria Oliveira',
    phone: '31998765432',
    email: 'maria@example.com',
    address: 'Rua das Flores, 200',
    notes: 'Contato de família'
  },
  {
    name: 'Pedro Santos',
    phone: '31999887766',
    email: 'pedro@example.com',
    address: 'Praça Central, 50',
    notes: 'Contato de emergência'
  },
  {
    name: 'Ana Pereira',
    phone: '31999998888',
    email: 'ana@example.com',
    address: 'Rua dos Pinheiros, 300',
    notes: 'Contato pessoal'
  }
];

// Função para popular o banco de dados
async function seedDatabase() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado ao MongoDB');

    // Limpar o banco de dados
    await Contact.deleteMany({});
    console.log('Dados anteriores removidos');

    // Inserir os dados iniciais
    const contacts = await Contact.create(initialContacts);
    console.log(`${contacts.length} contatos foram criados no banco de dados`);

    // Listar os contatos criados
    contacts.forEach(contact => {
      console.log(`- ${contact.name}: ${contact.phone}`);
    });

    console.log('Processo de seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao popular o banco de dados:', error);
  } finally {
    // Fechar a conexão com o MongoDB
    await mongoose.connection.close();
    console.log('Conexão com o MongoDB fechada');
    process.exit(0);
  }
}

// Executar a função de seed
seedDatabase(); 