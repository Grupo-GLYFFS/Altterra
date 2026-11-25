import { apenasDigitos } from './formatos.js';

// Consulta um CEP no ViaCEP.
// Recebe o CEP (com ou sem máscara); devolve { rua, bairro, cidade, uf } ou lança erro se não achar.
export async function buscarCep(cep) {
  const digitos = apenasDigitos(cep);
  if (digitos.length !== 8) throw new Error('CEP incompleto');

  const resposta = await fetch(`https://viacep.com.br/ws/${digitos}/json/`);
  if (!resposta.ok) throw new Error('Falha na consulta');

  const dados = await resposta.json();
  if (dados.erro) throw new Error('CEP não encontrado');

  return {
    rua: dados.logradouro || '',
    bairro: dados.bairro || '',
    cidade: dados.localidade || '',
    uf: dados.uf || '',
  };
}
