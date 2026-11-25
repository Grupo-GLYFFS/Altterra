// Regras de frete por fornecedor.

// Pedido mínimo por fornecedor, em reais (valor suposto, ver AUDITORIA-DESIGN.md).
export const PEDIDO_MINIMO_FORNECEDOR = 300;

// Calcula o frete de um fornecedor.
// Recebe o fornecedor, o peso total em kg e o modo ("entrega" ou "retirada").
// Retirada não tem frete; entrega cobra por kg, respeitando o valor mínimo do fornecedor.
export function calcularFrete(fornecedor, pesoKg, modo = 'entrega') {
  if (modo === 'retirada' || !fornecedor || pesoKg <= 0) return 0;
  const porPeso = pesoKg * (fornecedor.fretePorKg || 0);
  const valor = Math.max(fornecedor.freteMinimo || 0, porPeso);
  return Math.round(valor * 100) / 100;
}

// Texto do prazo de entrega de um fornecedor (ex.: "Entrega em 2 dias úteis").
export function textoPrazo(fornecedor) {
  const dias = fornecedor?.prazoDias || 2;
  return `Entrega em ${dias} ${dias === 1 ? 'dia útil' : 'dias úteis'}`;
}
