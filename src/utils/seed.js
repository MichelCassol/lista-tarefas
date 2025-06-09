const mongoose = require('mongoose');
const Todo = require('../models/todoModel');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-list';

// Dados iniciais para popular o banco
const initialTodos = [
  {
    tarefa: 'Teste 1 ',
    start_date: '2025-06-09',
    end_date: '',
  },
  {
    tarefa: 'Teste 2 ',
    start_date: '2025-06-09',
    end_date: '',
  },
  {
    tarefa: 'Teste 3 ',
    start_date: '2025-06-09',
    end_date: '',
  },
];

// Função para popular o banco de dados
async function seedDatabase() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado ao MongoDB');

    // Limpar o banco de dados
    await Todo.deleteMany({});
    console.log('Dados anteriores removidos');

    // Inserir os dados iniciais
    const todos = await Todo.create(initialTodos);
    console.log(`${todos.length} tarefas foram criadas no banco de dados`);

    // Listar os contatos criados
    todos.forEach(todo => {
      console.log(`- ${todo.name}: ${todo.phone}`);
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