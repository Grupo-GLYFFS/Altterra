import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IdentidadeFornecedor } from '../componentes/Avatar.jsx';
import { Botao } from '../componentes/Botao.jsx';
import { CardProduto } from '../componentes/CardProduto.jsx';
import { CardProdutoHorizontal } from '../componentes/CardProdutoHorizontal.jsx';
import { Carrossel } from '../componentes/Carrossel.jsx';
import { ResumoPedido } from '../componentes/compra/ResumoPedido.jsx';
import { EstadoVazio } from '../componentes/Estados.jsx';
import { Icone } from '../componentes/Icone.jsx';
import { Pagina } from '../componentes/layout/Pagina.jsx';
import { ModalBase } from '../componentes/Sobreposicoes.jsx';
import { useAnuncios } from '../contexto/useAnuncios.js';
import { useCarrinho } from '../contexto/useCarrinho.js';
import { useFavoritos } from '../contexto/useFavoritos.js';
import { agruparPorFornecedor, calcularTotais, montarLinhas } from '../logica/carrinho.js';
import { formatarReais } from '../logica/formatos.js';
import { textoPrazo } from '../logica/frete.js';
import estilos from './Carrinho.module.css';

// Página do carrinho (V01): grupos por fornecedor à esquerda, resumo fixo à direita e carrossel abaixo.
export function Carrinho() {
  const { itens, modosEntrega, definirQuantidade, remover } = useCarrinho();
  const { produtos, produtosAtivos } = useAnuncios();
  const { ehFavorito, alternar } = useFavoritos();
  const [linhaRemover, setLinhaRemover] = useState(null);

  const linhas = montarLinhas(itens, produtos);
  const grupos = agruparPorFornecedor(linhas, modosEntrega);
  const totais = calcularTotais(grupos);

  const idsNoCarrinho = new Set(itens.map((i) => i.produtoId));
  const sugestoes = produtosAtivos.filter((p) => !idsNoCarrinho.has(p.id)).slice(0, 6);

  const linhasResumo = [
    {
      rotulo: `Produtos (${totais.itens} ${totais.itens === 1 ? 'item' : 'itens'})`,
      valor: formatarReais(totais.cheio),
    },
    ...(totais.desconto > 0
      ? [{ rotulo: 'Desconto Outlet', valor: `− ${formatarReais(totais.desconto)}`, destaque: true }]
      : []),
    {
      rotulo: `Frete (${totais.fornecedores} ${totais.fornecedores === 1 ? 'fornecedor' : 'fornecedores'})`,
      valor: totais.frete === 0 ? 'Grátis' : formatarReais(totais.frete),
    },
  ];

  const grupoBloqueado = grupos.find((g) => g.abaixoDoMinimo);

  return (
    <Pagina>
      <div className={estilos.pagina}>
        <header className={estilos.cabecalho}>
          <h1 className={estilos.titulo}>Carrinho</h1>
          {totais.itens > 0 && (
            <p className={estilos.contagem}>
              {totais.itens} {totais.itens === 1 ? 'item' : 'itens'} · {totais.fornecedores}{' '}
              {totais.fornecedores === 1 ? 'fornecedor' : 'fornecedores'}
            </p>
          )}
        </header>

        {grupos.length === 0 ? (
          <EstadoVazio
            icone="shopping_cart"
            titulo="Seu carrinho está vazio"
            descricao="Os produtos que você adicionar aparecem aqui, separados por fornecedor."
            textoAcao="Ver produtos"
            paraAcao="/busca"
          />
        ) : (
          <div className={estilos.grade}>
            <div className={estilos.grupos}>
              {grupos.map((grupo) => (
                <section
                  key={grupo.fornecedor.id}
                  className={estilos.grupoCard}
                  aria-label={`Itens de ${grupo.fornecedor.nome}`}
                >
                  <div className={estilos.grupoTopo}>
                    <Link to={`/fornecedor/${grupo.fornecedor.id}`} className={estilos.fornecedorLink}>
                      <IdentidadeFornecedor
                        nome={grupo.fornecedor.nome}
                        subtitulo={`${grupo.fornecedor.tipo} · ${grupo.fornecedor.cidade}`}
                        logo={grupo.fornecedor.logo}
                        verificado={grupo.fornecedor.verificado}
                        tamanhoAvatar={32}
                      />
                    </Link>
                    <span className={estilos.prazo}>
                      <Icone nome="local_shipping" tamanho={16} />
                      <span>{textoPrazo(grupo.fornecedor)}</span>
                    </span>
                  </div>

                  <div className={estilos.listaLinhas}>
                    {grupo.linhas.map((linha) => (
                      <CardProdutoHorizontal
                        key={linha.produto.id}
                        produto={linha.produto}
                        ocultarFornecedor
                        mostrarSeletor
                        quantidade={linha.quantidade}
                        aoAlterarQuantidade={(qtd) => definirQuantidade(linha.produto.id, qtd)}
                        aoRemover={() => setLinhaRemover({ linha, grupo })}
                        className={estilos.linhaItem}
                      />
                    ))}
                  </div>

                  <div className={estilos.grupoRodape}>
                    <div className={estilos.grupoValores}>
                      <span>Frete: {formatarReais(grupo.frete)}</span>
                      <strong>Subtotal: {formatarReais(grupo.subtotal)}</strong>
                    </div>

                    {grupo.abaixoDoMinimo ? (
                      <div className={estilos.avisoMinimo}>
                        <Icone nome="info" tamanho={16} />
                        <span>
                          Faltam {formatarReais(grupo.falta)} para o pedido mínimo de{' '}
                          {formatarReais(grupo.minimo)}.
                        </span>
                        <Link to={`/fornecedor/${grupo.fornecedor.id}`} className={estilos.linkVer}>
                          Ver produtos
                        </Link>
                      </div>
                    ) : (
                      <p className={estilos.minimoOk}>
                        <Icone nome="check_circle" tamanho={16} />
                        <span>Pedido mínimo de {formatarReais(grupo.minimo)} atingido</span>
                      </p>
                    )}
                  </div>
                </section>
              ))}
            </div>

            <div className={estilos.colunaResumo}>
              <ResumoPedido
                linhas={linhasResumo}
                total={formatarReais(totais.total)}
                estado={totais.bloqueado ? 'bloqueado' : 'normal'}
                aviso={
                  grupoBloqueado
                    ? `${grupoBloqueado.fornecedor.nome} precisa atingir ${formatarReais(grupoBloqueado.minimo)} (faltam ${formatarReais(grupoBloqueado.falta)}).`
                    : ''
                }
                motivoBloqueio="Atinja o pedido mínimo de cada fornecedor para continuar"
                textoBotao="Finalizar pedido"
                para="/finalizar"
              >
                <ul className={estilos.garantias}>
                  <li>
                    <Icone nome="local_shipping" tamanho={20} />
                    <span>
                      <strong>Uma entrega por fornecedor.</strong> Cada fornecedor separa, emite a
                      nota e entrega o seu pedido.
                    </span>
                  </li>
                  <li>
                    <Icone nome="qr_code_2" tamanho={20} />
                    <span>
                      <strong>Pix ou boleto.</strong> O pedido só vai para separação depois do
                      pagamento.
                    </span>
                  </li>
                  <li>
                    <Icone nome="event_available" tamanho={20} />
                    <span>
                      <strong>Cancelamento sem custo</strong> até o fornecedor começar a separar.
                    </span>
                  </li>
                </ul>
              </ResumoPedido>
            </div>
          </div>
        )}

        {sugestoes.length > 0 && (
          <Carrossel titulo="Produtos que você pode gostar" textoAcao="Ver todos" paraAcao="/busca">
            {sugestoes.map((produto) => (
              <CardProduto
                key={produto.id}
                produto={produto}
                favoritado={ehFavorito(produto.id)}
                aoAlternarFavorito={() => alternar(produto)}
              />
            ))}
          </Carrossel>
        )}

        {/* Modal de confirmação de remoção (Sobreposições V04) */}
        <ModalBase
          aberto={Boolean(linhaRemover)}
          aoFechar={() => setLinhaRemover(null)}
          titulo="Remover do carrinho?"
          comFaixas
          rodape={
            <div className={estilos.rodapeModal}>
              <Botao variante="secundario" tamanho="sm" onClick={() => setLinhaRemover(null)}>
                Manter item
              </Botao>
              <Botao
                variante="perigo"
                tamanho="sm"
                onClick={() => {
                  if (linhaRemover) remover(linhaRemover.linha.produto.id);
                  setLinhaRemover(null);
                }}
              >
                Remover
              </Botao>
            </div>
          }
        >
          {linhaRemover && (
            <div className={estilos.corpoModal}>
              <p className={estilos.modalItem}>
                <strong>{linhaRemover.linha.produto.nome}</strong> ·{' '}
                {linhaRemover.linha.quantidade.toLocaleString('pt-BR')}{' '}
                {linhaRemover.linha.produto.unidade} ({formatarReais(linhaRemover.linha.subtotal)})
              </p>
              <p className={estilos.modalNota}>
                {linhaRemover.grupo.linhas.length === 1
                  ? `O frete de ${formatarReais(linhaRemover.grupo.frete)} de ${linhaRemover.grupo.fornecedor.nome} também será removido.`
                  : `O frete de ${linhaRemover.grupo.fornecedor.nome} será recalculado pelo peso restante.`}
              </p>
            </div>
          )}
        </ModalBase>
      </div>
    </Pagina>
  );
}
