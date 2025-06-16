// Funções de validação que serão testadas com matchers personalizados

// Valida se um valor é uma string de CPF válido no formato 000.000.000-00
function isValidCPF(cpf) {
  if (typeof cpf !== 'string') return false;
  
  // Regex para verificar o formato 000.000.000-00
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return cpfRegex.test(cpf);
}

// Valida se um valor é uma string de e-mail válido
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  
  // Regex simples para validar emails
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Valida se um objeto tem todas as propriedades obrigatórias
function hasRequiredProps(obj, requiredProps) {
  if (typeof obj !== 'object' || obj === null) return false;
  
  for (const prop of requiredProps) {
    if (!(prop in obj)) return false;
  }
  
  return true;
}

// Valida se uma string é uma data válida no formato DD/MM/YYYY
function isValidDateString(dateStr) {
  if (typeof dateStr !== 'string') return false;
  
  // Verifica o formato DD/MM/YYYY
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(dateRegex);
  
  if (!match) return false;
  
  // Extrai os componentes da data
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // Mês em JS começa em 0
  const year = parseInt(match[3], 10);
  
  // Cria um objeto Date e verifica se é válido
  const date = new Date(year, month, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  );
}

module.exports = {
  isValidCPF,
  isValidEmail,
  hasRequiredProps,
  isValidDateString
}; 