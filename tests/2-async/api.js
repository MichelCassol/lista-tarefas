// Simulação de chamadas assíncronas a API

// Simula uma requisição a uma API usando Promises
function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: 'Dados recebidos com sucesso' });
    }, 100);
  });
}

// Simula uma requisição a uma API que falha
function fetchDataWithError() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Erro ao buscar dados'));
    }, 100);
  });
}

// Simula uma requisição usando async/await
async function fetchUserData(userId) {
  if (!userId) {
    throw new Error('ID de usuário é obrigatório');
  }
  
  // Simula uma consulta ao banco de dados
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: 'Usuário ' + userId,
        email: `usuario${userId}@example.com`
      });
    }, 100);
  });
}

module.exports = {
  fetchData,
  fetchDataWithError,
  fetchUserData
}; 