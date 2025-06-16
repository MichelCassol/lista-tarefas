const Database = require('./db');

describe('Database - Demonstração de Setup e Teardown', () => {
  let db;
  
  // beforeAll é executado uma vez, antes de todos os testes no bloco
  beforeAll(() => {
    console.log('⏱️ beforeAll: Este log aparece uma vez antes de todos os testes');
  });
  
  // beforeEach é executado antes de cada teste individual
  beforeEach(async () => {
    console.log('⏱️ beforeEach: Configurando um novo banco de dados para o teste');
    db = new Database();
    await db.connect();
    
    // Adiciona alguns dados iniciais para cada teste
    await db.insertItem({ id: 1, name: 'Item 1' });
    await db.insertItem({ id: 2, name: 'Item 2' });
  });
  
  // afterEach é executado após cada teste individual
  afterEach(async () => {
    console.log('⏱️ afterEach: Desconectando e limpando o banco de dados');
    await db.disconnect();
    db = null;
  });
  
  // afterAll é executado uma vez, após todos os testes no bloco
  afterAll(() => {
    console.log('⏱️ afterAll: Este log aparece uma vez após todos os testes');
  });
  
  test('deve recuperar todos os itens', async () => {
    const items = await db.getAllItems();
    expect(items).toHaveLength(2);
    expect(items[0]).toEqual({ id: 1, name: 'Item 1' });
    expect(items[1]).toEqual({ id: 2, name: 'Item 2' });
  });
  
  test('deve recuperar um item pelo ID', async () => {
    const item = await db.getItemById(1);
    expect(item).toEqual({ id: 1, name: 'Item 1' });
  });
  
  test('deve retornar null quando o item não existe', async () => {
    const item = await db.getItemById(999);
    expect(item).toBeNull();
  });
  
  test('deve inserir um novo item', async () => {
    const newItem = { id: 3, name: 'Item 3' };
    await db.insertItem(newItem);
    
    const items = await db.getAllItems();
    expect(items).toHaveLength(3);
    expect(items[2]).toEqual(newItem);
  });
  
  // Exemplo de agrupamento de testes relacionados em um describe aninhado
  describe('operações com banco de dados desconectado', () => {
    // Este beforeEach substituirá o beforeEach do bloco pai apenas para este grupo de testes
    beforeEach(() => {
      console.log('⏱️ beforeEach aninhado: Configurando banco sem conectar');
      db = new Database();
      // Não conectamos ao banco propositalmente
    });
    
    test('deve rejeitar ao tentar obter itens quando desconectado', async () => {
      await expect(db.getAllItems()).rejects.toThrow('Não conectado ao banco de dados');
    });
    
    test('deve rejeitar ao tentar inserir itens quando desconectado', async () => {
      await expect(db.insertItem({ id: 1, name: 'Teste' })).rejects.toThrow('Não conectado ao banco de dados');
    });
  });
}); 