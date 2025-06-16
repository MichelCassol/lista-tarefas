const calculator = require('./calculator');

describe('Calculadora - Testes Básicos', () => {
  test('soma dois números positivos corretamente', () => {
    expect(calculator.sum(2, 3)).toBe(5);
  });

  test('soma um número positivo e um negativo corretamente', () => {
    expect(calculator.sum(2, -3)).toBe(-1);
  });

  test('subtrai corretamente', () => {
    expect(calculator.subtract(5, 3)).toBe(2);
  });

  test('multiplica corretamente', () => {
    expect(calculator.multiply(2, 3)).toBe(6);
  });

  test('divide corretamente', () => {
    expect(calculator.divide(6, 3)).toBe(2);
  });

  test('lança erro ao dividir por zero', () => {
    expect(() => calculator.divide(6, 0)).toThrow('Divisão por zero não é permitida');
  });
}); 