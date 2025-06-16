const validators = require('./validators');
const customMatchers = require('./custom-matchers');

// Registra os matchers personalizados para o Jest
expect.extend(customMatchers);

describe('Usando matchers personalizados', () => {
  describe('toBeValidCPF', () => {
    test('CPF válido deve passar', () => {
      expect('123.456.789-00').toBeValidCPF();
    });
    
    test('formato de CPF inválido deve falhar', () => {
      expect('123.456.789.00').not.toBeValidCPF();
      expect('123456789-00').not.toBeValidCPF();
      expect('12345678900').not.toBeValidCPF();
    });
    
    test('tipos não-string devem falhar', () => {
      expect(123456789).not.toBeValidCPF();
      expect({}).not.toBeValidCPF();
      expect(null).not.toBeValidCPF();
    });
  });
  
  describe('toBeValidEmail', () => {
    test('emails válidos devem passar', () => {
      expect('usuario@exemplo.com').toBeValidEmail();
      expect('usuario.nome@exemplo.com.br').toBeValidEmail();
      expect('usuario+tag@exemplo.co').toBeValidEmail();
    });
    
    test('emails inválidos devem falhar', () => {
      expect('usuario@').not.toBeValidEmail();
      expect('@exemplo.com').not.toBeValidEmail();
      expect('usuario@exemplo').not.toBeValidEmail();
      expect('usuario exemplo.com').not.toBeValidEmail();
    });
  });
  
  describe('toBeValidDateString', () => {
    test('datas válidas no formato DD/MM/YYYY devem passar', () => {
      expect('01/01/2023').toBeValidDateString();
      expect('31/12/2023').toBeValidDateString();
      expect('29/02/2024').toBeValidDateString(); // 2024 é bissexto
    });
    
    test('datas inválidas devem falhar', () => {
      expect('32/01/2023').not.toBeValidDateString(); // Dia inválido
      expect('01/13/2023').not.toBeValidDateString(); // Mês inválido
      expect('29/02/2023').not.toBeValidDateString(); // 2023 não é bissexto
      expect('01-01-2023').not.toBeValidDateString(); // Formato incorreto
    });
  });
  
  describe('toHaveRequiredProps', () => {
    test('objeto com propriedades requeridas deve passar', () => {
      const user = { id: 1, name: 'João', email: 'joao@exemplo.com' };
      expect(user).toHaveRequiredProps('id', 'name', 'email');
    });
    
    test('objeto sem algumas propriedades requeridas deve falhar', () => {
      const user = { id: 1, name: 'João' };
      expect(user).not.toHaveRequiredProps('id', 'name', 'email');
      expect(user).toHaveRequiredProps('id', 'name');
    });
    
    test('tipos não-objeto devem falhar', () => {
      expect('string').not.toHaveRequiredProps('length');
      expect(null).not.toHaveRequiredProps('anything');
    });
  });
  
  // Demonstra combinação de matchers personalizados com matchers nativos
  describe('Combinando matchers personalizados e nativos', () => {
    test('validando um objeto de usuário', () => {
      const user = {
        id: 1,
        name: 'Maria Silva',
        email: 'maria@exemplo.com',
        cpf: '123.456.789-00',
        birthDate: '15/03/1985'
      };
      
      // Usando matchers personalizados
      expect(user).toHaveRequiredProps('id', 'name', 'email', 'cpf', 'birthDate');
      expect(user.email).toBeValidEmail();
      expect(user.cpf).toBeValidCPF();
      expect(user.birthDate).toBeValidDateString();
      
      // Combinando com matchers nativos
      expect(user.id).toBeGreaterThan(0);
      expect(user.name).toContain('Silva');
      expect(user.email).toMatch(/@exemplo\.com$/);
      expect(Object.keys(user)).toHaveLength(5);
    });
  });
}); 