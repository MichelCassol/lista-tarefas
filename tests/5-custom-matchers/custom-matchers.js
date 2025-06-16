// Arquivo de matchers personalizados para Jest
const validators = require('./validators');

// Função auxiliar para formatar mensagens de erro
const formatErrorMessage = (received, matcherName, expectedText) => {
  return () => 
    `${matcherName} falhou:\n` +
    `Valor recebido: ${JSON.stringify(received)}\n` +
    `${expectedText || ''}`;
};

// Definição dos matchers personalizados
const customMatchers = {
  // Matcher para verificar se é um CPF válido
  toBeValidCPF(received) {
    const pass = validators.isValidCPF(received);
    
    return {
      pass,
      message: formatErrorMessage(
        received, 
        'toBeValidCPF', 
        'Esperado: um CPF válido no formato 000.000.000-00'
      )
    };
  },
  
  // Matcher para verificar se é um e-mail válido
  toBeValidEmail(received) {
    const pass = validators.isValidEmail(received);
    
    return {
      pass,
      message: formatErrorMessage(
        received, 
        'toBeValidEmail', 
        'Esperado: um e-mail válido'
      )
    };
  },
  
  // Matcher para verificar se é uma data válida no formato DD/MM/YYYY
  toBeValidDateString(received) {
    const pass = validators.isValidDateString(received);
    
    return {
      pass,
      message: formatErrorMessage(
        received, 
        'toBeValidDateString', 
        'Esperado: uma data válida no formato DD/MM/YYYY'
      )
    };
  },
  
  // Matcher para verificar se um objeto tem as propriedades especificadas
  toHaveRequiredProps(received, ...requiredProps) {
    const pass = validators.hasRequiredProps(received, requiredProps);
    
    return {
      pass,
      message: formatErrorMessage(
        received, 
        'toHaveRequiredProps', 
        `Esperado: um objeto com as propriedades [${requiredProps.join(', ')}]`
      )
    };
  }
};

module.exports = customMatchers; 