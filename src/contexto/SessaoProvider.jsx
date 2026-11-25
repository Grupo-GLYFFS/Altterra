import { useCallback, useMemo } from 'react';
import { FORNECEDORES } from '../dados/fornecedores.js';
import { USUARIOS_EXEMPLO } from '../dados/usuarios.js';
import { normalizarTexto } from '../logica/formatos.js';
import { caminhoImagem } from '../logica/imagens.js';
import { ContextoSessao } from './ContextoSessao.js';
import { usePersistente } from './usePersistente.js';

// Sincroniza fotos das contas de exemplo salvas no navegador sem alterar contas novas.
function normalizarUsuarios(lista) {
  if (!Array.isArray(lista)) return USUARIOS_EXEMPLO;
  return lista.map((u) => {
    const exemplo = USUARIOS_EXEMPLO.find((ex) => ex.id === u.id);
    const foto = u.foto ? caminhoImagem(u.foto) : exemplo?.foto || '';
    return foto ? { ...u, foto } : u;
  });
}

// Cria o fornecedor ligado a uma conta nova de perfil fornecedor.
function criarFornecedor(dados) {
  return {
    id: normalizarTexto(dados.empresa).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    nome: dados.empresa,
    tipo: dados.tipoNegocio,
    cidade: `${dados.cidade} - ${dados.uf}`,
    logo: '',
    verificado: false,
    nota: null,
    totalAvaliacoes: 0,
    kgDoados: 0,
    desde: new Date().getFullYear(),
    respostaHoras: 24,
    pedidosEntregues: 0,
    freteMinimo: 50,
    fretePorKg: 0.07,
    prazoDias: 3,
    descricao: '',
  };
}

// Guarda a conta logada e as contas cadastradas (login local, sem verificação).
export function SessaoProvider({ children }) {
  const [usuarios, setUsuarios] = usePersistente('usuarios', USUARIOS_EXEMPLO, normalizarUsuarios);
  const [email, setEmail] = usePersistente('sessao', null);

  const atual = usuarios.find((u) => u.email === email) || null;

  // Remove a senha do usuário e anexa o fornecedor, quando for o caso.
  const usuario = useMemo(() => {
    if (!atual) return null;
    const semSenha = { ...atual };
    delete semSenha.senha;
    const fornecedor =
      atual.perfil === 'fornecedor'
        ? FORNECEDORES.find((f) => f.id === atual.fornecedorId) || atual.fornecedor || null
        : null;
    return { ...semSenha, fornecedor };
  }, [atual]);

  // Confere se já existe conta com o e-mail.
  const emailExiste = useCallback(
    (valor) => usuarios.some((u) => u.email.toLowerCase() === String(valor).trim().toLowerCase()),
    [usuarios]
  );

  // Entra com e-mail e senha; devolve { ok, erro }.
  const entrar = useCallback(
    (valor, senha) => {
      const conta = usuarios.find((u) => u.email.toLowerCase() === String(valor).trim().toLowerCase());
      if (!conta) return { ok: false, erro: 'Não achamos uma conta com esse e-mail.' };
      if (conta.senha !== senha) return { ok: false, erro: 'Senha incorreta. Confira ou redefina a senha.' };
      setEmail(conta.email);
      return { ok: true };
    },
    [usuarios, setEmail]
  );

  // Cria a conta e já entra; devolve { ok, erro }.
  const cadastrar = useCallback(
    (dados) => {
      if (emailExiste(dados.email)) return { ok: false, erro: 'Já existe uma conta com esse e-mail.' };
      const nova = {
        id: `usuario-${Date.now()}`,
        nome: dados.nome,
        email: dados.email.trim(),
        senha: dados.senha,
        perfil: dados.perfil,
        empresa: dados.empresa,
        cnpj: dados.cnpj,
        tipoNegocio: dados.tipoNegocio,
        celular: '',
        enderecos: [
          {
            id: `end-${Date.now()}`,
            apelido: 'Endereço principal',
            cep: dados.cep,
            rua: dados.rua,
            numero: dados.numero,
            complemento: dados.complemento || '',
            bairro: dados.bairro || '',
            cidade: dados.cidade,
            uf: dados.uf,
            principal: true,
          },
        ],
      };
      if (dados.perfil === 'fornecedor') nova.fornecedor = criarFornecedor(dados);
      setUsuarios((lista) => [...lista, nova]);
      setEmail(nova.email);
      return { ok: true };
    },
    [emailExiste, setUsuarios, setEmail]
  );

  // Troca a senha de uma conta sem verificação; devolve { ok, erro }.
  const redefinirSenha = useCallback(
    (valor, senhaNova) => {
      if (!emailExiste(valor)) return { ok: false, erro: 'Não achamos uma conta com esse e-mail.' };
      setUsuarios((lista) =>
        lista.map((u) =>
          u.email.toLowerCase() === String(valor).trim().toLowerCase() ? { ...u, senha: senhaNova } : u
        )
      );
      return { ok: true };
    },
    [emailExiste, setUsuarios]
  );

  // Encerra a sessão.
  const sair = useCallback(() => setEmail(null), [setEmail]);

  // Atualiza campos da conta logada (nome, empresa, CNPJ, celular).
  const atualizarDados = useCallback(
    (dados) => {
      setUsuarios((lista) => lista.map((u) => (u.email === email ? { ...u, ...dados } : u)));
    },
    [email, setUsuarios]
  );

  // Cria ou atualiza um endereço da conta logada; o primeiro vira o principal.
  const salvarEndereco = useCallback(
    (endereco) => {
      setUsuarios((lista) =>
        lista.map((u) => {
          if (u.email !== email) return u;
          const existe = u.enderecos.some((e) => e.id === endereco.id);
          const enderecos = existe
            ? u.enderecos.map((e) => (e.id === endereco.id ? { ...e, ...endereco } : e))
            : [...u.enderecos, { ...endereco, id: `end-${Date.now()}`, principal: u.enderecos.length === 0 }];
          return { ...u, enderecos };
        })
      );
    },
    [email, setUsuarios]
  );

  // Remove um endereço; se era o principal, o primeiro que sobrar assume.
  const removerEndereco = useCallback(
    (id) => {
      setUsuarios((lista) =>
        lista.map((u) => {
          if (u.email !== email) return u;
          const restantes = u.enderecos.filter((e) => e.id !== id);
          const temPrincipal = restantes.some((e) => e.principal);
          return {
            ...u,
            enderecos: restantes.map((e, indice) => ({
              ...e,
              principal: temPrincipal ? e.principal : indice === 0,
            })),
          };
        })
      );
    },
    [email, setUsuarios]
  );

  // Marca um endereço como o principal.
  const definirPrincipal = useCallback(
    (id) => {
      setUsuarios((lista) =>
        lista.map((u) =>
          u.email === email
            ? { ...u, enderecos: u.enderecos.map((e) => ({ ...e, principal: e.id === id })) }
            : u
        )
      );
    },
    [email, setUsuarios]
  );

  // Troca a senha da conta logada conferindo a atual; devolve { ok, erro }.
  const alterarSenha = useCallback(
    (senhaAtual, senhaNova) => {
      if (!atual || atual.senha !== senhaAtual) return { ok: false, erro: 'A senha atual não confere.' };
      setUsuarios((lista) => lista.map((u) => (u.email === email ? { ...u, senha: senhaNova } : u)));
      return { ok: true };
    },
    [atual, email, setUsuarios]
  );

  const valor = useMemo(
    () => ({
      usuario,
      emailExiste,
      entrar,
      cadastrar,
      redefinirSenha,
      sair,
      atualizarDados,
      salvarEndereco,
      removerEndereco,
      definirPrincipal,
      alterarSenha,
    }),
    [
      usuario,
      emailExiste,
      entrar,
      cadastrar,
      redefinirSenha,
      sair,
      atualizarDados,
      salvarEndereco,
      removerEndereco,
      definirPrincipal,
      alterarSenha,
    ]
  );

  return <ContextoSessao.Provider value={valor}>{children}</ContextoSessao.Provider>;
}
