const api = require('./api');

describe('Testes de funções assíncronas', () => {
  // Teste com Promises
  test('fetchData retorna dados corretamente', () => {
    return api.fetchData().then(data => {
      expect(data).toEqual({ data: 'Dados recebidos com sucesso' });
    });
  });

  // Teste com async/await
  test('fetchData pode ser usado com async/await', async () => {
    const data = await api.fetchData();
    expect(data).toEqual({ data: 'Dados recebidos com sucesso' });
  });

  // Teste de erro com Promises
  test('fetchDataWithError rejeita com erro', () => {
    expect.assertions(1); // Garante que o assertion dentro do catch seja executado
    return api.fetchDataWithError().catch(e => {
      expect(e.message).toBe('Erro ao buscar dados');
    });
  });

  // Teste de erro com async/await
  test('fetchDataWithError rejeita com erro usando async/await', async () => {
    expect.assertions(1);
    try {
      await api.fetchDataWithError();
    } catch (e) {
      expect(e.message).toBe('Erro ao buscar dados');
    }
  });

  // Alternate de testar rejeição com rejects
  test('fetchDataWithError rejeita com erro usando rejects', async () => {
    await expect(api.fetchDataWithError()).rejects.toThrow('Erro ao buscar dados');
  });

  // Teste com async/await para função que requer parâmetros
  test('fetchUserData retorna dados de usuário', async () => {
    const userData = await api.fetchUserData(1);
    expect(userData).toEqual({
      id: 1,
      name: 'Usuário 1',
      email: 'usuario1@example.com'
    });
  });

  // Teste para verificar erro quando não passa o userId
  test('fetchUserData lança erro sem userId', async () => {
    await expect(api.fetchUserData()).rejects.toThrow('ID de usuário é obrigatório');
  });
}); 