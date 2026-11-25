import { useMemo, useState } from 'react';
import { Avatar } from '../componentes/Avatar.jsx';
import { Botao } from '../componentes/Botao.jsx';
import { ResumoVendasFornecedor } from '../componentes/comprador/ResumoVendasFornecedor.jsx';
import { SecaoAtalhosPerfil } from '../componentes/comprador/SecaoAtalhosPerfil.jsx';
import { SecaoDadosPerfil } from '../componentes/comprador/SecaoDadosPerfil.jsx';
import { SecaoEnderecosPerfil } from '../componentes/comprador/SecaoEnderecosPerfil.jsx';
import { SecaoSegurancaPerfil } from '../componentes/comprador/SecaoSegurancaPerfil.jsx';
import { MenuConta } from '../componentes/conta/MenuConta.jsx';
import { Pagina } from '../componentes/layout/Pagina.jsx';
import { RotaProtegida } from '../componentes/layout/RotaProtegida.jsx';
import { Selo } from '../componentes/Selo.jsx';
import { useAnuncios } from '../contexto/useAnuncios.js';
import { useDoacoes } from '../contexto/useDoacoes.js';
import { useFavoritos } from '../contexto/useFavoritos.js';
import { usePedidos } from '../contexto/usePedidos.js';
import { useSessao } from '../contexto/useSessao.js';
import { STATUS_PEDIDO } from '../logica/pedidos.js';
import estilos from './Perfil.module.css';

const SECOES_MENU = [
  { id: 'dados', rotulo: 'Meus dados', icone: 'person' },
  { id: 'enderecos', rotulo: 'Endereços', icone: 'location_on' },
  { id: 'seguranca', rotulo: 'Segurança', icone: 'lock' },
];

// Conteúdo do Meu perfil (V01): menu da conta à esquerda, cabeçalho, vendas (se fornecedor),
// dados, endereços, segurança e atalhos com contagens reais.
function ConteudoPerfil() {
  const {
    usuario,
    sair,
    atualizarDados,
    salvarEndereco,
    removerEndereco,
    definirPrincipal,
    alterarSenha,
  } = useSessao();
  const { pedidos } = usePedidos();
  const { favoritos } = useFavoritos();
  const { produtos } = useAnuncios();
  const { kgDoadosPor } = useDoacoes();

  const [secaoAtiva, setSecaoAtiva] = useState('dados');
  const [editandoDados, setEditandoDados] = useState(false);

  const ehFornecedor = usuario.perfil === 'fornecedor';
  const fornecedorId = usuario.fornecedor?.id || null;
  const kgDoados = fornecedorId ? kgDoadosPor(fornecedorId) : 0;

  const meusPedidos = useMemo(
    () => pedidos.filter((p) => p.compradorEmail === usuario.email),
    [pedidos, usuario.email]
  );

  const pedidosRecebidos = useMemo(
    () => (fornecedorId ? pedidos.filter((p) => p.fornecedorId === fornecedorId) : []),
    [pedidos, fornecedorId]
  );

  const meusAnuncios = useMemo(
    () => (fornecedorId ? produtos.filter((p) => p.fornecedor?.id === fornecedorId) : []),
    [produtos, fornecedorId]
  );

  const emAndamento = meusPedidos.filter((p) => STATUS_PEDIDO[p.status]?.aba === 'andamento').length;
  const anunciosAtivos = meusAnuncios.filter((p) => p.status === 'ativo').length;

  const atalhos = [
    {
      rotulo: 'Meus pedidos',
      icone: 'receipt_long',
      para: '/pedidos',
      resumo:
        emAndamento > 0
          ? `${meusPedidos.length} pedidos · ${emAndamento} em andamento`
          : `${meusPedidos.length} ${meusPedidos.length === 1 ? 'pedido' : 'pedidos'}`,
    },
    {
      rotulo: 'Favoritos',
      icone: 'favorite',
      para: '/favoritos',
      resumo: `${favoritos.length} ${favoritos.length === 1 ? 'produto' : 'produtos'}`,
    },
    ...(ehFornecedor
      ? [
          {
            rotulo: 'Meus anúncios',
            icone: 'inventory_2',
            para: '/anuncios',
            resumo: `${anunciosAtivos} ${anunciosAtivos === 1 ? 'ativo' : 'ativos'}`,
          },
          {
            rotulo: 'Pedidos recebidos',
            icone: 'local_shipping',
            para: '/pedidos-recebidos',
            resumo: `${pedidosRecebidos.length} ${pedidosRecebidos.length === 1 ? 'pedido' : 'pedidos'}`,
          },
          {
            rotulo: 'Safra que Alimenta',
            icone: 'volunteer_activism',
            para: '/safra-que-alimenta',
            resumo: kgDoados > 0 ? `${kgDoados.toLocaleString('pt-BR')} kg doados` : 'Fazer doação',
          },
        ]
      : []),
  ];

  // Rola até a seção clicada no menu da conta.
  function selecionarSecao(id) {
    setSecaoAtiva(id);
    const el = document.getElementById(`perfil-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <Pagina>
      <div className={estilos.grade}>
        <MenuConta
          usuario={usuario}
          secoes={SECOES_MENU}
          ativa={secaoAtiva}
          aoSelecionar={selecionarSecao}
          atalhos={atalhos}
          aoSair={sair}
        />

        <div className={estilos.conteudo}>
          <section className={estilos.cabecalhoCard}>
            <Avatar src={usuario.fornecedor?.logo || ''} nome={usuario.nome} tamanho={56} />
            <div className={estilos.cabecalhoTextos}>
              <h1 className={estilos.nome}>{usuario.nome}</h1>
              <p className={estilos.meta}>{usuario.empresa}</p>
              <div className={estilos.selos}>
                <Selo variante="neutro" tamanho="sm" icone={ehFornecedor ? 'storefront' : 'store'}>
                  {ehFornecedor ? 'Fornecedor' : 'Comprador'}
                </Selo>
                {ehFornecedor && kgDoados > 0 && (
                  <Selo variante="doador" tamanho="sm">
                    Doou {kgDoados.toLocaleString('pt-BR')} kg pelo Safra que Alimenta
                  </Selo>
                )}
              </div>
            </div>
            <Botao
              variante="secundario"
              tamanho="sm"
              iconeEsquerda="edit"
              onClick={() => {
                setEditandoDados(true);
                selecionarSecao('dados');
              }}
            >
              Editar perfil
            </Botao>
          </section>

          {ehFornecedor && <ResumoVendasFornecedor pedidos={pedidosRecebidos} />}

          <SecaoDadosPerfil
            usuario={usuario}
            editando={editandoDados}
            aoAlterarEditando={setEditandoDados}
            aoSalvar={atualizarDados}
          />

          <SecaoEnderecosPerfil
            enderecos={usuario.enderecos}
            ehFornecedor={ehFornecedor}
            aoSalvar={salvarEndereco}
            aoRemover={removerEndereco}
            aoDefinirPrincipal={definirPrincipal}
          />

          <SecaoSegurancaPerfil aoAlterarSenha={alterarSenha} />

          <SecaoAtalhosPerfil atalhos={atalhos} />
        </div>
      </div>
    </Pagina>
  );
}

// Página Meu perfil (V01) protegida por login.
export function Perfil() {
  return (
    <RotaProtegida titulo="Meu perfil">
      <ConteudoPerfil />
    </RotaProtegida>
  );
}
