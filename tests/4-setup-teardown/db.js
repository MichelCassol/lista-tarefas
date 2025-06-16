// Simulação de um módulo de banco de dados

class Database {
  constructor() {
    this.connected = false;
    this.data = [];
  }
  
  connect() {
    // Simula a conexão com o banco de dados
    this.connected = true;
    console.log('Conexão com o banco de dados estabelecida');
    return Promise.resolve();
  }
  
  disconnect() {
    // Simula a desconexão do banco de dados
    this.connected = false;
    console.log('Conexão com o banco de dados encerrada');
    return Promise.resolve();
  }
  
  resetData() {
    // Limpa os dados (útil para testes)
    this.data = [];
    return Promise.resolve();
  }
  
  insertItem(item) {
    if (!this.connected) {
      return Promise.reject(new Error('Não conectado ao banco de dados'));
    }
    
    this.data.push(item);
    return Promise.resolve(item);
  }
  
  getAllItems() {
    if (!this.connected) {
      return Promise.reject(new Error('Não conectado ao banco de dados'));
    }
    
    return Promise.resolve([...this.data]);
  }
  
  getItemById(id) {
    if (!this.connected) {
      return Promise.reject(new Error('Não conectado ao banco de dados'));
    }
    
    const item = this.data.find(i => i.id === id);
    return Promise.resolve(item || null);
  }
}

module.exports = Database; 