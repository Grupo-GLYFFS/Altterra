// Gera a distribuição de notas (de 5 a 1 estrela) a partir da média e do total de avaliações.
// Recebe a nota média e o total; devolve { 5: n, 4: n, 3: n, 2: n, 1: n } somando o total.
export function distribuirNotas(nota, total) {
  if (!total || !nota) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const pesos = [5, 4, 3, 2, 1].map((estrela) => Math.max(0.05, 1 - Math.abs(estrela - nota) / 2.2));
  const somaPesos = pesos.reduce((soma, peso) => soma + peso, 0);
  const brutos = pesos.map((peso) => (peso / somaPesos) * total);
  const inteiros = brutos.map(Math.floor);
  let resto = total - inteiros.reduce((soma, n) => soma + n, 0);
  const ordem = brutos
    .map((valor, indice) => ({ indice, fracao: valor - Math.floor(valor) }))
    .sort((a, b) => b.fracao - a.fracao);
  ordem.forEach(({ indice }) => {
    if (resto > 0) {
      inteiros[indice] += 1;
      resto -= 1;
    }
  });
  return { 5: inteiros[0], 4: inteiros[1], 3: inteiros[2], 2: inteiros[3], 1: inteiros[4] };
}
