const { UserService, UserController } = require('./user');

// Mock manual do UserService
jest.mock('./user', () => {
  // Obtemos a implementação original
  const original = jest.requireActual('./user');
  
  // Retornamos tudo da implementação original, mas sobrescrevemos o UserService
  return {
    ...original,
    // Mock da classe UserService
    UserService: jest.fn().mockImplementation(() => ({
      getUsers: jest.fn(),
      getUserById: jest.fn()
    }))
  };
});

describe('UserController com mocks', () => {
  let userService;
  let userController;
  
  beforeEach(() => {
    // Criamos uma nova instância para cada teste
    userService = new UserService();
    userController = new UserController(userService);
    
    // Limpa todos os mocks entre os testes
    jest.clearAllMocks();
  });
  
  describe('listUsers', () => {
    test('deve retornar lista de usuários com sucesso', async () => {
      // Configura o mock para retornar dados de teste
      const mockUsers = [
        { id: 1, firstName: 'João', lastName: 'Silva' },
        { id: 2, firstName: 'Maria', lastName: 'Santos' }
      ];
      
      userService.getUsers.mockResolvedValue(mockUsers);
      
      // Executa o método sendo testado
      const result = await userController.listUsers();
      
      // Verifica que o mock foi chamado
      expect(userService.getUsers).toHaveBeenCalledTimes(1);
      
      // Verifica o resultado
      expect(result).toEqual({
        success: true,
        data: mockUsers
      });
    });
    
    test('deve retornar erro quando o serviço falha', async () => {
      // Configura o mock para lançar um erro
      userService.getUsers.mockRejectedValue(new Error('Falha na conexão'));
      
      // Executa o método sendo testado
      const result = await userController.listUsers();
      
      // Verifica que o mock foi chamado
      expect(userService.getUsers).toHaveBeenCalledTimes(1);
      
      // Verifica o resultado
      expect(result).toEqual({
        success: false,
        error: 'Falha na conexão'
      });
    });
  });
  
  describe('getUserDetails', () => {
    test('deve retornar erro quando userId não é fornecido', async () => {
      const result = await userController.getUserDetails();
      
      // Verifica que o serviço não foi chamado
      expect(userService.getUserById).not.toHaveBeenCalled();
      
      // Verifica o resultado
      expect(result).toEqual({
        success: false,
        error: 'ID do usuário é obrigatório'
      });
    });
    
    test('deve retornar os detalhes do usuário formatados', async () => {
      const mockUser = { id: 1, firstName: 'João', lastName: 'Silva' };
      
      userService.getUserById.mockResolvedValue(mockUser);
      
      const result = await userController.getUserDetails(1);
      
      // Verifica que o mock foi chamado com o ID correto
      expect(userService.getUserById).toHaveBeenCalledWith(1);
      
      // Verifica o resultado
      expect(result).toEqual({
        success: true,
        data: {
          ...mockUser,
          formattedName: 'João Silva'
        }
      });
    });
    
    test('deve retornar erro quando o usuário não é encontrado', async () => {
      userService.getUserById.mockResolvedValue(null);
      
      const result = await userController.getUserDetails(999);
      
      expect(userService.getUserById).toHaveBeenCalledWith(999);
      
      expect(result).toEqual({
        success: false,
        error: 'Usuário não encontrado'
      });
    });
    
    test('deve retornar erro quando o serviço falha', async () => {
      userService.getUserById.mockRejectedValue(new Error('Erro no banco de dados'));
      
      const result = await userController.getUserDetails(1);
      
      expect(userService.getUserById).toHaveBeenCalledWith(1);
      
      expect(result).toEqual({
        success: false,
        error: 'Erro no banco de dados'
      });
    });
  });
  
  // Teste usando spyOn para espionar métodos do controlador
  describe('Usando spyOn', () => {
    test('deve espionar chamadas de métodos internos', async () => {
      // Cria um UserController real (não mockado)
      const realController = new UserController(userService);
      
      // Espia o método getUserDetails
      const spy = jest.spyOn(realController, 'getUserDetails');
      
      // Configura o mock para getUserById
      userService.getUserById.mockResolvedValue({ id: 1, firstName: 'João', lastName: 'Silva' });
      
      // Chama o método
      await realController.getUserDetails(1);
      
      // Verifica que o método foi chamado com o argumento correto
      expect(spy).toHaveBeenCalledWith(1);
      
      // Restaura a implementação original
      spy.mockRestore();
    });
  });
}); 