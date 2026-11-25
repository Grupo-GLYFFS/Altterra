import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Aviso } from '../componentes/Aviso.jsx';
import { Botao } from '../componentes/Botao.jsx';
import { GrupoRadio } from '../componentes/Campo.jsx';
import { BlocoNumerado } from '../componentes/compra/BlocoNumerado.jsx';
import { CodigoPix } from '../componentes/compra/CodigoPix.jsx';
import { ResumoPedido } from '../componentes/compra/ResumoPedido.jsx';
import { EstadoVazio } from '../componentes/Estados.jsx';
import { CamposEndereco } from '../componentes/formulario/CamposEndereco.jsx';
import { Pagina } from '../componentes/layout/Pagina.jsx';
import { RotaProtegida } from '../componentes/layout/RotaProtegida.jsx';
import { LinhaDoTempo } from '../componentes/LinhaDoTempo.jsx';
import { Selo } from '../componentes/Selo.jsx';
import { ModalBase } from '../componentes/Sobreposicoes.jsx';
import { useAnuncios } from '../contexto/useAnuncios.js';
import { useCarrinho } from '../contexto/useCarrinho.js';
import { usePedidos } from '../contexto/usePedidos.js';
import { useSessao } from '../contexto/useSessao.js';
import { agruparPorFornecedor, calcularTotais, montarLinhas } from '../logica/carrinho.js';
import { esquemaEndereco } from '../logica/esquemas.js';
import { formatarReais } from '../logica/formatos.js';
import { textoPrazo } from '../logica/frete.js';
import { STATUS_PEDIDO, montarEtapasPedido } from '../logica/pedidos.js';
import estilos from './Finalizacao.module.css';

const OPCOES_PAGAMENTO = [
  { valor: 'pix', rotulo: 'Pix', descricao: 'Aprovação na hora. Os fornecedores liberam a separação assim que cai.' },
  { valor: 'boleto', rotulo: 'Boleto bancário', descricao: 'Vencimento em 3 dias úteis. Compensação em até 1 dia útil.' },
];

// Conteúdo interno da finalização (só renderizado com usuário logado).
function ConteudoFinalizacao() {
  const { usuario, salvarEndereco } = useSessao();
  const { itens, modosEntrega, definirModo, limpar } = useCarrinho();
  const { produtos } = useAnuncios();
  const { pedidos, criarPedidos, confirmarPagamento } = usePedidos();

  const principal = usuario.enderecos.find((e) => e.principal) || usuario.enderecos[0] || null;
  const [enderecoId, setEnderecoId] = useState(principal?.id || '');
  const [pagamento, setPagamento] = useState('pix');
  const [blocoAberto, setBlocoAberto] = useState(principal ? 2 : 1);
  const [etapaConcluida, setEtapaConcluida] = useState(principal ? 1 : 0);
  const [modalEndereco, setModalEndereco] = useState(false);
  const [idsCriados, setIdsCriados] = useState([]);

  const formEndereco = useForm({
    resolver: yupResolver(esquemaEndereco),
    defaultValues: { apelido: '', cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' },
  });

  const linhas = montarLinhas(itens, produtos);
  const grupos = agruparPorFornecedor(linhas, modosEntrega);
  const totais = calcularTotais(grupos);

  const enderecoAtual = usuario.enderecos.find((e) => e.id === enderecoId) || principal;
  const pronto = etapaConcluida >= 3 && blocoAberto === 0 && !totais.bloqueado && Boolean(enderecoAtual);

  // Tela de confirmação depois de clicar em "Fazer pedido".
  if (idsCriados.length > 0) {
    const criados = pedidos.filter((p) => idsCriados.includes(p.id));
    const totalGeral = criados.reduce((acc, p) => acc + p.total, 0);
    const temPendente = criados.some((p) => p.status === 'aguardando_pagamento');

    return (
      <Pagina>
        <div className={estilos.confirmacaoGrade}>
          <section className={estilos.cardPagamento}>
            <Selo variante="sucesso">Pedido feito</Selo>
            <h1 className={estilos.titulo}>
              {pagamento === 'pix' ? `Pague ${formatarReais(totalGeral)} com Pix` : 'Boleto gerado'}
            </h1>
            <p className={estilos.subtitulo}>
              Assim que o pagamento cair, os fornecedores começam a separar seus pedidos.
            </p>

            {pagamento === 'pix' ? (
              <CodigoPix codigo={`00020126580014br.gov.bcb.pix0136altterra-${idsCriados[0]}`} />
            ) : (
              <Aviso
                tipo="info"
                titulo="Linha digitável do boleto"
                descricao="34191.79001 01043.510047 91020.150008 4 98500000121300"
              />
            )}

            {temPendente && (
              <Botao
                variante="secundario"
                tamanho="md"
                iconeEsquerda="check_circle"
                onClick={() => criados.forEach((p) => confirmarPagamento(p.id))}
              >
                Simular confirmação do pagamento
              </Botao>
            )}
          </section>

          <section className={estilos.listaCriados}>
            <h2 className={estilos.subtituloLista}>
              Seus {criados.length} {criados.length === 1 ? 'pedido' : 'pedidos'}
            </h2>
            {criados.map((pedido) => {
              const infoStatus = STATUS_PEDIDO[pedido.status] || STATUS_PEDIDO.aguardando_pagamento;
              return (
                <article key={pedido.id} className={estilos.cardPedidoCriado}>
                  <div className={estilos.pedidoTopo}>
                    <strong>{pedido.id}</strong>
                    <Selo variante={infoStatus.variante} tamanho="sm">
                      {infoStatus.rotulo}
                    </Selo>
                  </div>
                  <LinhaDoTempo etapas={montarEtapasPedido(pedido)} />
                  <div className={estilos.pedidoRodape}>
                    <span>
                      {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}
                    </span>
                    <strong>{formatarReais(pedido.total)}</strong>
                  </div>
                </article>
              );
            })}

            <div className={estilos.acoesPos}>
              <Botao variante="principal" tamanho="md" para="/pedidos">
                Ver meus pedidos
              </Botao>
              <Botao variante="secundario" tamanho="md" para="/busca">
                Continuar comprando
              </Botao>
            </div>
          </section>
        </div>
      </Pagina>
    );
  }

  if (grupos.length === 0) {
    return (
      <Pagina titulo="Finalizar pedido">
        <EstadoVazio
          icone="shopping_cart"
          titulo="Seu carrinho está vazio"
          descricao="Adicione produtos antes de finalizar o pedido."
          textoAcao="Ver produtos"
          paraAcao="/busca"
        />
      </Pagina>
    );
  }

  // Salva um endereço novo pelo modal e seleciona-o.
  function criarNovoEndereco(dados) {
    salvarEndereco(dados);
    formEndereco.reset();
    setModalEndereco(false);
  }

  // Cria os pedidos por fornecedor e limpa o carrinho.
  function finalizarCompra() {
    if (!pronto) return;
    const novos = criarPedidos(grupos, {
      endereco: enderecoAtual,
      pagamento,
      comprador: usuario,
    });
    limpar();
    setIdsCriados(novos.map((p) => p.id));
  }

  const estadoBloco = (num) => {
    if (blocoAberto === num) return 'aberto';
    if (etapaConcluida >= num) return 'concluido';
    return 'bloqueado';
  };

  const resumoEndereco = enderecoAtual
    ? `${enderecoAtual.apelido} · ${enderecoAtual.rua}, ${enderecoAtual.numero}, ${enderecoAtual.cidade} - ${enderecoAtual.uf}`
    : '';

  const resumoEntrega = grupos
    .map((g) => `${g.fornecedor.nome}: ${g.modo === 'retirada' ? 'retirada grátis' : formatarReais(g.frete)}`)
    .join(' · ');

  const resumoPagamento = pagamento === 'pix' ? 'Pix, aprovação na hora' : 'Boleto bancário';

  const linhasResumo = [
    { rotulo: `Produtos (${totais.itens} itens)`, valor: formatarReais(totais.cheio) },
    ...(totais.desconto > 0
      ? [{ rotulo: 'Desconto Outlet', valor: `− ${formatarReais(totais.desconto)}`, destaque: true }]
      : []),
    {
      rotulo: `Frete (${totais.fornecedores} entregas)`,
      valor: totais.frete === 0 ? 'Grátis' : formatarReais(totais.frete),
    },
  ];

  return (
    <Pagina>
      <div className={estilos.pagina}>
        <header className={estilos.cabecalho}>
          <h1 className={estilos.titulo}>Finalizar pedido</h1>
          <p className={estilos.subtitulo}>
            {totais.itens} {totais.itens === 1 ? 'item' : 'itens'} de {totais.fornecedores}{' '}
            {totais.fornecedores === 1 ? 'fornecedor' : 'fornecedores'}. Cada fornecedor entrega
            separado.
          </p>
        </header>

        <div className={estilos.grade}>
          <div className={estilos.blocos}>
            <BlocoNumerado
              id="endereco"
              numero={1}
              titulo="Endereço de entrega"
              resumo={resumoEndereco}
              estado={estadoBloco(1)}
              aoAlterar={() => setBlocoAberto(1)}
            >
              <GrupoRadio
                cartao
                valor={enderecoAtual?.id || ''}
                aoAlterar={setEnderecoId}
                opcoes={usuario.enderecos.map((end) => ({
                  valor: end.id,
                  rotulo: end.apelido,
                  descricao: `${end.rua}, ${end.numero}${end.complemento ? ` (${end.complemento})` : ''} · ${end.cidade} - ${end.uf}`,
                }))}
              />
              <div className={estilos.acoesBloco}>
                <Botao
                  variante="principal"
                  tamanho="md"
                  desabilitado={!enderecoAtual}
                  onClick={() => {
                    setEtapaConcluida((e) => Math.max(e, 1));
                    setBlocoAberto(2);
                  }}
                >
                  Usar este endereço
                </Botao>
                <Botao
                  variante="secundario"
                  tamanho="md"
                  iconeEsquerda="add"
                  onClick={() => setModalEndereco(true)}
                >
                  Novo endereço
                </Botao>
              </div>
            </BlocoNumerado>

            <BlocoNumerado
              id="entrega"
              numero={2}
              titulo="Entrega por fornecedor"
              resumo={resumoEntrega}
              estado={estadoBloco(2)}
              aoAlterar={() => setBlocoAberto(2)}
            >
              <div className={estilos.listaFornecedores}>
                {grupos.map((grupo, indice) => (
                  <div key={grupo.fornecedor.id} className={estilos.boxFornecedor}>
                    <div className={estilos.boxTopo}>
                      <strong>{grupo.fornecedor.nome}</strong>
                      <span className={estilos.metaFornecedor}>
                        Pedido {indice + 1} de {grupos.length} · {grupo.peso.toLocaleString('pt-BR')} kg
                      </span>
                    </div>
                    <GrupoRadio
                      cartao
                      valor={grupo.modo}
                      aoAlterar={(modo) => definirModo(grupo.fornecedor.id, modo)}
                      opcoes={[
                        {
                          valor: 'entrega',
                          rotulo: `Entrega do fornecedor · ${formatarReais(grupo.frete || grupo.fornecedor.freteMinimo)}`,
                          descricao: textoPrazo(grupo.fornecedor),
                        },
                        {
                          valor: 'retirada',
                          rotulo: 'Retirar no local · Grátis',
                          descricao: grupo.fornecedor.cidade,
                        },
                      ]}
                    />
                  </div>
                ))}
              </div>
              <div className={estilos.acoesBloco}>
                <Botao
                  variante="principal"
                  tamanho="md"
                  onClick={() => {
                    setEtapaConcluida((e) => Math.max(e, 2));
                    setBlocoAberto(3);
                  }}
                >
                  Continuar para pagamento
                </Botao>
              </div>
            </BlocoNumerado>

            <BlocoNumerado
              id="pagamento"
              numero={3}
              titulo="Pagamento"
              resumo={resumoPagamento}
              estado={estadoBloco(3)}
              aoAlterar={() => setBlocoAberto(3)}
            >
              <GrupoRadio
                cartao
                valor={pagamento}
                aoAlterar={setPagamento}
                opcoes={OPCOES_PAGAMENTO}
              />
              <div className={estilos.acoesBloco}>
                <Botao
                  variante="principal"
                  tamanho="md"
                  onClick={() => {
                    setEtapaConcluida(3);
                    setBlocoAberto(0);
                  }}
                >
                  Confirmar pagamento
                </Botao>
              </div>
            </BlocoNumerado>
          </div>

          <div className={estilos.colunaResumo}>
            <ResumoPedido
              linhas={linhasResumo}
              total={formatarReais(totais.total)}
              estado={pronto ? 'normal' : 'bloqueado'}
              aviso={
                !pronto ? 'Complete os 3 blocos à esquerda para liberar o pedido.' : ''
              }
              motivoBloqueio="Complete endereço, entrega e pagamento antes de fazer o pedido"
              textoBotao="Fazer pedido"
              aoClicar={finalizarCompra}
            >
              <p className={estilos.notaResumo}>
                Cancelamento sem custo até o fornecedor começar a separar.
              </p>
            </ResumoPedido>
          </div>
        </div>

        <ModalBase
          aberto={modalEndereco}
          aoFechar={() => setModalEndereco(false)}
          titulo="Novo endereço"
          comFaixas
          tamanho={560}
          rodape={
            <div className={estilos.acoesModal}>
              <Botao variante="secundario" tamanho="sm" onClick={() => setModalEndereco(false)}>
                Cancelar
              </Botao>
              <Botao tipo="submit" form="form-endereco-finalizacao" tamanho="sm">
                Salvar endereço
              </Botao>
            </div>
          }
        >
          <form
            id="form-endereco-finalizacao"
            onSubmit={formEndereco.handleSubmit(criarNovoEndereco)}
            className={estilos.formModal}
            noValidate
          >
            <CamposEndereco
              comApelido
              register={formEndereco.register}
              setValue={formEndereco.setValue}
              errors={formEndereco.formState.errors}
            />
          </form>
        </ModalBase>
      </div>
    </Pagina>
  );
}

// Página de finalização (V02) protegida por login.
export function Finalizacao() {
  return (
    <RotaProtegida titulo="Finalizar pedido">
      <ConteudoFinalizacao />
    </RotaProtegida>
  );
}
