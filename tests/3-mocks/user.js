// Módulo que usa um serviço externo que queremos mockar em testes

class UserService {
  async getUsers() {
    // Em um caso real, isso faria uma chamada HTTP ou acesso ao banco de dados
    throw new Error('Este método deve ser mockado para testes');
  }
  
  async getUserById(id) {
    // Em um caso real, isso faria uma chamada HTTP ou acesso ao banco de dados
    throw new Error('Este método deve ser mockado para testes');
  }
}

class UserController {
  constructor(userService) {
    this.userService = userService;
  }
  
  async listUsers() {
    try {
      const users = await this.userService.getUsers();
      return {
        success: true,
        data: users
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async getUserDetails(userId) {
    if (!userId) {
      return {
        success: false,
        error: 'ID do usuário é obrigatório'
      };
    }
    
    try {
      const user = await this.userService.getUserById(userId);
      
      if (!user) {
        return {
          success: false,
          error: 'Usuário não encontrado'
        };
      }
      
      return {
        success: true,
        data: {
          ...user,
          formattedName: `${user.firstName} ${user.lastName}`
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = {
  UserService,
  UserController
}; 