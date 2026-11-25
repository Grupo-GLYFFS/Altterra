import * as yup from 'yup';
import { apenasDigitos } from './formatos.js';

const MENSAGEM_OBRIGATORIO = 'Preencha este campo.';
const EMAIL = yup.string().trim().email('Digite um e-mail válido, como nome@empresa.com.br.').required('Digite o e-mail.');
const SENHA_NOVA = yup
  .string()
  .min(8, 'Use pelo menos 8 caracteres, com um número.')
  .matches(/\d/, 'Use pelo menos 8 caracteres, com um número.')
  .required('Crie uma senha.');

// Valida o CNPJ pelo tamanho (14 números).
const CNPJ = yup
  .string()
  .test('cnpj', 'Digite os 14 números do CNPJ.', (valor) => apenasDigitos(valor).length === 14)
  .required('Digite o CNPJ.');

const CEP = yup
  .string()
  .test('cep', 'Digite o CEP com 8 números.', (valor) => apenasDigitos(valor).length === 8)
  .required('Digite o CEP.');

export const esquemaEmail = yup.object({ email: EMAIL });

export const esquemaEntrar = yup.object({
  email: EMAIL,
  senha: yup.string().required('Digite a senha.'),
});

export const esquemaRedefinir = yup.object({ email: EMAIL, senha: SENHA_NOVA });

export const esquemaEndereco = yup.object({
  apelido: yup.string().trim().required('Dê um nome ao endereço, como "Loja Centro".'),
  cep: CEP,
  rua: yup.string().trim().required('Digite a rua.'),
  numero: yup.string().trim().required('Digite o número.'),
  complemento: yup.string().trim(),
  bairro: yup.string().trim().required('Digite o bairro.'),
  cidade: yup.string().trim().required('Digite a cidade.'),
  uf: yup.string().trim().length(2, 'Use a sigla do estado.').required('Digite o estado.'),
});

export const esquemaCadastro = yup.object({
  perfil: yup.string().oneOf(['comprador', 'fornecedor']).required(),
  cnpj: CNPJ,
  tipoNegocio: yup.string().required('Escolha o tipo de negócio.'),
  empresa: yup.string().trim().required('Digite a razão social.'),
  cep: CEP,
  rua: yup.string().trim().required('Digite a rua.'),
  numero: yup.string().trim().required('Digite o número.'),
  complemento: yup.string().trim(),
  cidade: yup.string().trim().required('Digite a cidade.'),
  uf: yup.string().trim().length(2, 'Use a sigla.').required('Digite o estado.'),
  nome: yup.string().trim().required('Digite seu nome completo.'),
  email: EMAIL,
  senha: SENHA_NOVA,
});

export const esquemaDados = yup.object({
  nome: yup.string().trim().required('Digite seu nome completo.'),
  empresa: yup.string().trim().required('Digite a razão social.'),
  cnpj: CNPJ,
  celular: yup
    .string()
    .test('celular', 'Digite o celular com DDD, ex.: (11) 91234-5678.', (valor) => {
      const tamanho = apenasDigitos(valor).length;
      return tamanho === 10 || tamanho === 11;
    })
    .required('Digite o celular.'),
});

export const esquemaSenha = yup.object({
  atual: yup.string().required('Digite a senha atual.'),
  nova: SENHA_NOVA,
  confirmar: yup
    .string()
    .oneOf([yup.ref('nova')], 'As senhas não são iguais.')
    .required('Repita a senha nova.'),
});

export const esquemaAvaliacao = yup.object({
  nota: yup.number().min(1, 'Escolha de 1 a 5 estrelas.').required('Escolha de 1 a 5 estrelas.'),
  comentario: yup.string().trim().max(400, 'Use até 400 caracteres.'),
});

export const esquemaDoacao = yup.object({
  instituicaoId: yup.string().required('Escolha a instituição.'),
  produtoId: yup.string().required('Escolha o produto.'),
  quantidade: yup
    .number()
    .typeError('Digite a quantidade em quilos.')
    .min(1, 'Digite pelo menos 1 kg.')
    .required('Digite a quantidade em quilos.'),
});

// Esquema do anúncio, validado por etapa no cadastro de produto.
export const esquemaAnuncio = yup.object({
  nome: yup.string().trim().min(3, 'Digite o nome do produto.').required('Digite o nome do produto.'),
  categoriaId: yup.string().required('Escolha a categoria.'),
  variedade: yup.string().trim(),
  descricao: yup.string().trim().max(600, 'Use até 600 caracteres.'),
  preco1: yup.string().required(MENSAGEM_OBRIGATORIO),
  minimo1: yup.string().required(MENSAGEM_OBRIGATORIO),
  estoque: yup.string().required('Digite o estoque disponível.'),
  unidade: yup.string().required(),
  cep: CEP,
  prazoDias: yup.string().required('Digite o prazo de entrega.'),
});
