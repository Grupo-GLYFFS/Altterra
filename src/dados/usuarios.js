// Usuários de exemplo: uma compradora e um fornecedor, ambos com senha "altterra123".
export const USUARIOS_EXEMPLO = [
  {
    id: 'usuario-mariana',
    nome: 'Mariana Albuquerque',
    email: 'compras@mercadosaojorge.com.br',
    senha: 'altterra123',
    perfil: 'comprador',
    empresa: 'Mercado São Jorge',
    cnpj: '12.345.678/0001-90',
    tipoNegocio: 'Mercado',
    celular: '(11) 91234-5678',
    enderecos: [
      {
        id: 'end-1',
        apelido: 'Loja Pinheiros',
        cep: '05422-010',
        rua: 'Rua dos Pinheiros',
        numero: '870',
        complemento: 'Loja 2',
        bairro: 'Pinheiros',
        cidade: 'São Paulo',
        uf: 'SP',
        principal: true,
      },
      {
        id: 'end-2',
        apelido: 'Depósito Barra Funda',
        cep: '01140-070',
        rua: 'Rua Norma Pieruccini Giannotti',
        numero: '300',
        complemento: 'Galpão 4',
        bairro: 'Barra Funda',
        cidade: 'São Paulo',
        uf: 'SP',
        principal: false,
      },
    ],
  },
  {
    id: 'usuario-rafael',
    nome: 'Rafael Menezes',
    email: 'contato@valeverde.coop.br',
    senha: 'altterra123',
    perfil: 'fornecedor',
    empresa: 'Cooperativa Vale Verde',
    cnpj: '98.765.432/0001-10',
    tipoNegocio: 'Cooperativa',
    celular: '(15) 99876-5432',
    fornecedorId: 'cooperativa-vale-verde',
    enderecos: [
      {
        id: 'end-3',
        apelido: 'Galpão da cooperativa',
        cep: '18150-000',
        rua: 'Estrada do Paiol',
        numero: 'km 4',
        complemento: '',
        bairro: 'Paiol',
        cidade: 'Ibiúna',
        uf: 'SP',
        principal: true,
      },
    ],
  },
];

// E-mail e senha usados para abrir a tela de entrar já preenchida.
export const LOGIN_PADRAO = { email: 'compras@mercadosaojorge.com.br', senha: 'altterra123' };
