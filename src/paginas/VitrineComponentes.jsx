import { SimpleGrid } from '@mantine/core';
import { useState } from 'react';
import { Abas } from '../componentes/Abas.jsx';
import { Acordeao } from '../componentes/Acordeao.jsx';
import { Estrelas, NotaCompacta, ResumoAvaliacoes, SeletorNota } from '../componentes/Avaliacao.jsx';
import { Avatar, IdentidadeFornecedor } from '../componentes/Avatar.jsx';
import { Aviso } from '../componentes/Aviso.jsx';
import { Botao } from '../componentes/Botao.jsx';
import {
  BlocoFormulario,
  CampoArea,
  CampoSelect,
  CampoTexto,
  Checkbox,
  GrupoRadio,
  Interruptor,
} from '../componentes/Campo.jsx';
import { CardProduto } from '../componentes/CardProduto.jsx';
import { CardProdutoHorizontal } from '../componentes/CardProdutoHorizontal.jsx';
import { Chip } from '../componentes/Chip.jsx';
import { Contador, PontoIndicador } from '../componentes/Contador.jsx';
import { ControleSegmentado } from '../componentes/ControleSegmentado.jsx';
import { CabecalhoSecao, Divisor } from '../componentes/Divisor.jsx';
import { Carregando, EstadoErro, EstadoVazio } from '../componentes/Estados.jsx';
import { Icone } from '../componentes/Icone.jsx';
import { IndicadorEtapas } from '../componentes/IndicadorEtapas.jsx';
import { IndiceProduto } from '../componentes/IndiceProduto.jsx';
import { Pagina } from '../componentes/layout/Pagina.jsx';
import { LinkTexto } from '../componentes/LinkTexto.jsx';
import { LogoAltterra } from '../componentes/LogoAltterra.jsx';
import { Selo } from '../componentes/Selo.jsx';
import { SeletorQuantidade } from '../componentes/SeletorQuantidade.jsx';
import {
  Gaveta,
  MenuOrdenar,
  ModalBase,
  PopoverBase,
  TooltipBase,
} from '../componentes/Sobreposicoes.jsx';
import { ToastCarrinho } from '../componentes/Toast.jsx';
import { useToast } from '../componentes/useToast.js';
import { FORNECEDORES } from '../dados/fornecedores.js';
import { PRODUTOS } from '../dados/produtos.js';
import { formatarFaixaPreco } from '../logica/formatos.js';
import estilos from './VitrineComponentes.module.css';

const OPCOES_PUBLICO = [
  { valor: 'compradores', rotulo: 'Compradores', icone: 'store' },
  { valor: 'fornecedores', rotulo: 'Fornecedores', icone: 'inventory_2' },
  { valor: 'ongs', rotulo: 'ONGs', icone: 'volunteer_activism' },
];

const ABAS_PEDIDOS = [
  { valor: 'andamento', rotulo: 'Em andamento', contagem: 2 },
  { valor: 'entregues', rotulo: 'Entregues', contagem: 5 },
  { valor: 'cancelados', rotulo: 'Cancelados', contagem: 1 },
];

const SECOES_PRODUTO = [
  { id: 'sobre', rotulo: 'Sobre' },
  { id: 'localizacao', rotulo: 'Localização' },
  { id: 'avaliacoes', rotulo: 'Avaliações' },
  { id: 'fornecedor', rotulo: 'Fornecedor' },
];

const FAQ_EXEMPLO = [
  {
    id: 'cadastro',
    titulo: 'Como faço meu cadastro como comprador?',
    conteudo:
      'Informe os dados da empresa, o CNPJ e o endereço de entrega. O acesso ao catálogo é liberado na hora.',
  },
  {
    id: 'frete',
    titulo: 'Como funciona o frete entre fornecedores?',
    conteudo: 'Cada fornecedor informa o frete e o prazo de entrega para a região escolhida.',
  },
];

const OPCOES_ORDENAR = [
  { valor: 'relevantes', rotulo: 'Mais relevantes', rotuloCurto: 'relevantes' },
  { valor: 'menor-preco', rotulo: 'Menor preço por kg', rotuloCurto: 'menor preço' },
  { valor: 'maior-preco', rotulo: 'Maior preço por kg', rotuloCurto: 'maior preço' },
  { valor: 'maior-estoque', rotulo: 'Maior estoque', rotuloCurto: 'maior estoque' },
  { valor: 'mais-perto', rotulo: 'Mais perto de você', rotuloCurto: 'mais perto' },
];

const ETAPAS_CADASTRO = [
  { id: 'produto', titulo: 'Produto', subtitulo: 'Nome e categoria', status: 'concluida' },
  { id: 'preco', titulo: 'Preço e estoque', subtitulo: 'Faixas e mínimo', status: 'atual' },
  { id: 'fotos', titulo: 'Fotos', subtitulo: 'Capa e mais 4', status: 'pendente' },
  { id: 'entrega', titulo: 'Entrega', subtitulo: 'Saída e frete', status: 'erro' },
  { id: 'revisao', titulo: 'Revisão', subtitulo: 'Antes de publicar', status: 'pendente' },
];

// Vitrine interativa de todos os componentes do design system Altterra (/componentes).
export function VitrineComponentes() {
  const { mostrarToast } = useToast();

  const [quantidadeProduto, setQuantidadeProduto] = useState(200);
  const [quantidadeCarrinho, setQuantidadeCarrinho] = useState(50);
  const [publico, setPublico] = useState('compradores');
  const [abaPedido, setAbaPedido] = useState('andamento');
  const [secaoProduto, setSecaoProduto] = useState('sobre');
  const [chipOrganico, setChipOrganico] = useState(true);
  const [chipOutlet, setChipOutlet] = useState(false);
  const [filtrosVazio, setFiltrosVazio] = useState([
    { id: 'organico', rotulo: 'Orgânico' },
    { id: 'regiao', rotulo: 'Ibiúna - SP' },
    { id: 'outlet', rotulo: 'Só Outlet' },
  ]);
  const [favoritos, setFavoritos] = useState(['alface-crespa']);
  const [notaUsuario, setNotaUsuario] = useState(4);
  const [entrega, setEntrega] = useState('entrega');
  const [receberNovidades, setReceberNovidades] = useState(true);
  const [venderOutlet, setVenderOutlet] = useState(false);
  const [ordenacao, setOrdenacao] = useState('menor-preco');
  const [modalAberto, setModalAberto] = useState(false);
  const [gavetaAberta, setGavetaAberta] = useState(false);
  const [popoverAberto, setPopoverAberto] = useState(false);

  // Alterna um produto na lista local de favoritos da vitrine.
  function alternarFavorito(id) {
    setFavoritos((atual) =>
      atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id]
    );
  }

  return (
    <Pagina titulo="Componentes do design system" itensCarrinho={3}>
      {/* Identidade e ícones */}
      <section className={estilos.secao}>
        <CabecalhoSecao titulo="Marca e ícones" />
        <div className={estilos.linha}>
          <div className={estilos.caixaEscura}>
            <LogoAltterra variante="claro" tamanho="md" />
          </div>
          <div className={estilos.caixaClara}>
            <LogoAltterra variante="escuro" tamanho="md" />
          </div>
        </div>
        <div className={estilos.linha}>
          <Icone nome="nutrition" tamanho={16} />
          <Icone nome="location_on" tamanho={20} />
          <Icone nome="shopping_cart" tamanho={24} />
          <Icone nome="favorite" tamanho={24} preenchido />
          <Icone nome="verified" tamanho={24} preenchido />
          <Icone nome="volunteer_activism" tamanho={32} />
        </div>
      </section>

      {/* Botões e seletor de quantidade */}
      <section className={estilos.secao}>
        <CabecalhoSecao titulo="Botões e seletor de quantidade" />

        <div className={estilos.grupo}>
          <p className={estilos.rotulo}>Variantes (md · 56 px)</p>
          <div className={estilos.linha}>
            <Botao variante="principal">Finalizar pedido</Botao>
            <Botao variante="secundario">Salvar e sair</Botao>
            <Botao variante="terciario">Solicitar amostra</Botao>
            <Botao variante="perigo">Cancelar pedido</Botao>
            <Botao variante="icone" iconeEsquerda="favorite" aria-label="Adicionar aos favoritos" />
            <Botao variante="icone" iconeEsquerda="share" aria-label="Compartilhar" />
          </div>
        </div>

        <div className={estilos.grupo}>
          <p className={estilos.rotulo}>Tamanhos (lg 64 · md 56 · sm 44) e estados</p>
          <div className={estilos.linha}>
            <Botao tamanho="lg" iconeEsquerda="shopping_cart">
              Adicionar ao carrinho
            </Botao>
            <Botao tamanho="md" iconeDireita="arrow_forward">
              Avançar
            </Botao>
            <Botao tamanho="sm" variante="secundario">
              Ver detalhes
            </Botao>
            <Botao carregando textoCarregando="Enviando…">
              Enviar
            </Botao>
            <Botao desabilitado>Desabilitado</Botao>
          </div>
        </div>

        <div className={estilos.grupo}>
          <p className={estilos.rotulo}>Seletor de quantidade (56 página do produto · 44 carrinho)</p>
          <div className={estilos.linha}>
            <SeletorQuantidade
              tamanho="md"
              valor={quantidadeProduto}
              minimo={50}
              maximo={1200}
              passo={50}
              aoAlterar={setQuantidadeProduto}
            />
            <SeletorQuantidade
              tamanho="sm"
              valor={quantidadeCarrinho}
              minimo={50}
              maximo={600}
              passo={10}
              permitirRemover
              aoRemover={() => setQuantidadeCarrinho(50)}
              aoAlterar={setQuantidadeCarrinho}
            />
          </div>
        </div>
      </section>

      {/* Campos C5 */}
      <section className={estilos.secao}>
        <CabecalhoSecao titulo="Campos de formulário (C5)" />
        <BlocoFormulario
          titulo="Dados do anúncio"
          descricao="Informações exibidas para os compradores no catálogo."
        >
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <CampoTexto rotulo="Nome do produto" placeholder="Ex.: Tomate Carmem" />
            <CampoTexto
              rotulo="Complemento"
              opcional
              placeholder="Galpão, bloco ou referência"
            />
            <CampoTexto
              rotulo="Preço por quilo"
              prefixo="R$"
              sufixo="/kg"
              defaultValue="3,40"
              dica="Valor unitário da primeira faixa."
            />
            <CampoTexto
              rotulo="CEP"
              defaultValue="06990-999"
              erro="CEP não encontrado. Confira os 8 números."
            />
            <CampoTexto rotulo="CEP encontrado" defaultValue="18150-000" sucesso />
            <CampoTexto rotulo="Cidade" defaultValue="Ibiúna - SP" somenteLeitura />
            <CampoSelect
              rotulo="Unidade de venda"
              opcoes={['kg', 't', 'caixa']}
              defaultValue="kg"
            />
            <CampoTexto rotulo="Buscando CEP" defaultValue="18150-000" carregando />
          </SimpleGrid>

          <CampoArea
            rotulo="Descrição"
            opcional
            placeholder="Conte sobre colheita, calibre e armazenamento."
          />

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            <GrupoRadio
              rotulo="Forma de recebimento"
              cartao
              valor={entrega}
              aoAlterar={setEntrega}
              opcoes={[
                {
                  valor: 'entrega',
                  rotulo: 'Entrega no endereço',
                  descricao: 'Frete calculado por fornecedor.',
                },
                {
                  valor: 'retirada',
                  rotulo: 'Retirada no local',
                  descricao: 'Sem custo de frete.',
                },
              ]}
            />
            <div className={estilos.pilha}>
              <Checkbox
                rotulo="Aceito pedidos recorrentes"
                descricao="Permite entregas semanais combinadas."
                marcado={receberNovidades}
                aoAlterar={setReceberNovidades}
              />
              <Interruptor
                rotulo="Vender como Outlet"
                descricao="Desconto para lote fora do padrão visual."
                ligado={venderOutlet}
                aoAlterar={setVenderOutlet}
              />
            </div>
          </SimpleGrid>
        </BlocoFormulario>
      </section>

      {/* Abas, segmentado, índice, chips e acordeão */}
      <section className={estilos.secao}>
        <CabecalhoSecao titulo="Abas, controle segmentado, chips e acordeão" />

        <div className={estilos.grupo}>
          <p className={estilos.rotulo}>Controle segmentado (56 e 44)</p>
          <div className={estilos.linha}>
            <ControleSegmentado
              opcoes={OPCOES_PUBLICO}
              valor={publico}
              aoAlterar={setPublico}
              rotulo="Público"
            />
            <ControleSegmentado
              tamanho="sm"
              opcoes={OPCOES_PUBLICO}
              valor={publico}
              aoAlterar={setPublico}
              rotulo="Público compacto"
            />
          </div>
        </div>

        <div className={estilos.grupo}>
          <p className={estilos.rotulo}>Abas da página com contagem</p>
          <Abas itens={ABAS_PEDIDOS} ativa={abaPedido} aoAlterar={setAbaPedido} rotulo="Pedidos" />
        </div>

        <div className={estilos.grupo}>
          <p className={estilos.rotulo}>Índice fixo da página do produto</p>
          <IndiceProduto
            secoes={SECOES_PRODUTO}
            ativa={secaoProduto}
            aoSelecionar={setSecaoProduto}
            preco={formatarFaixaPreco(3.1, 3.6)}
            unidade="kg"
            aoAdicionar={() =>
              mostrarToast({
                produto: PRODUTOS[0],
                detalhe: '50 kg · Cooperativa Vale Verde',
                preco: 'R$ 155,00 – 180,00',
                totalItens: 3,
              })
            }
          />
        </div>

        <div className={estilos.grupo}>
          <p className={estilos.rotulo}>Chips de filtro (tonais e com borda)</p>
          <div className={estilos.linha}>
            <Chip ativo contagem={48}>
              Legumes
            </Chip>
            <Chip ativo={chipOrganico} aoClicar={() => setChipOrganico((v) => !v)}>
              Orgânico
            </Chip>
            <Chip ativo={chipOutlet} comBorda aoClicar={() => setChipOutlet((v) => !v)}>
              Só Outlet
            </Chip>
            <Chip comBorda iconeDireita="expand_more">
              Pedido mínimo
            </Chip>
            <Chip ativo comBorda aoRemover={() => {}}>
              Ibiúna - SP
            </Chip>
          </div>
        </div>

        <div className={estilos.grupo}>
          <p className={estilos.rotulo}>Acordeão</p>
          <Acordeao itens={FAQ_EXEMPLO} abertoInicial="cadastro" />
        </div>
      </section>

      {/* Selos, avatares, avaliações, contadores, divisores e links */}
      <section className={estilos.secao}>
        <CabecalhoSecao titulo="Miúdos: selos, avatares, avaliações, contadores e links" />

        <div className={estilos.linha}>
          <Selo variante="outlet">Outlet −30%</Selo>
          <Selo variante="organico">Orgânico</Selo>
          <Selo variante="novo">Novo</Selo>
          <Selo variante="verificado">Verificado</Selo>
          <Selo variante="doador">Doador do Safra que Alimenta</Selo>
          <Selo variante="aviso">Aguardando pagamento</Selo>
          <Selo variante="info">A caminho</Selo>
          <Selo variante="sucesso">Entregue</Selo>
          <Selo variante="erro">Cancelado</Selo>
        </div>

        <Divisor rotulo="Avatares e fornecedor" />

        <div className={estilos.linha}>
          <Avatar src={FORNECEDORES[0].logo} nome={FORNECEDORES[0].nome} tamanho={32} />
          <Avatar src={FORNECEDORES[1].logo} nome={FORNECEDORES[1].nome} tamanho={44} />
          <Avatar nome="Mariana Albuquerque" tamanho={56} />
          <Avatar nome="Cooperativa Vale Verde" tamanho={96} />
          <IdentidadeFornecedor
            nome={FORNECEDORES[0].nome}
            subtitulo={`${FORNECEDORES[0].tipo} · ${FORNECEDORES[0].cidade}`}
            logo={FORNECEDORES[0].logo}
            verificado
            tamanhoAvatar={44}
          />
        </div>

        <Divisor rotulo="Estrelas e avaliações" />

        <div className={estilos.linha}>
          <NotaCompacta nota={4.3} totalAvaliacoes={12} />
          <Estrelas nota={4.3} />
          <NotaCompacta nota={null} />
        </div>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <ResumoAvaliacoes
            nota={4.3}
            totalAvaliacoes={12}
            distribuicao={{ 5: 7, 4: 2, 3: 2, 2: 1, 1: 0 }}
          />
          <SeletorNota valor={notaUsuario} aoAlterar={setNotaUsuario} />
        </SimpleGrid>

        <Divisor rotulo="Contadores e links" />

        <div className={estilos.linha}>
          <span className={estilos.iconeComContador}>
            <Botao variante="icone" iconeEsquerda="notifications" aria-label="Notificações, 3" />
            <Contador valor={3} />
          </span>
          <span className={estilos.iconeComContador}>
            <Botao variante="icone" iconeEsquerda="shopping_cart" aria-label="Carrinho, 120" />
            <Contador valor={120} />
          </span>
          <Contador valor={14} emLinha />
          <PontoIndicador />
          <LinkTexto para="/como-funciona">Ver como funciona</LinkTexto>
          <LinkTexto variante="acao" para="/busca" iconeDireita="arrow_forward">
            Ver todos
          </LinkTexto>
          <LinkTexto href="https://receitafederal.gov.br" externo>
            Consultar CNPJ
          </LinkTexto>
        </div>
      </section>

      {/* Cards de produto (K4 e K5) */}
      <section className={estilos.secao}>
        <CabecalhoSecao titulo="Card de produto (K4)" textoAcao="Ver busca" paraAcao="/busca" />
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          {PRODUTOS.slice(0, 4).map((produto) => (
            <CardProduto
              key={produto.id}
              produto={produto}
              favoritado={favoritos.includes(produto.id)}
              aoAlternarFavorito={alternarFavorito}
            />
          ))}
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <CardProduto
            produto={PRODUTOS[4]}
            favoritado={favoritos.includes(PRODUTOS[4].id)}
            aoAlternarFavorito={alternarFavorito}
          />
          <CardProduto produto={PRODUTOS[0]} ocultarFornecedor />
          <CardProduto carregando />
        </SimpleGrid>

        <CabecalhoSecao titulo="Card horizontal (K5) e linha do carrinho" nivel="h3" />
        <div className={estilos.pilha}>
          <CardProdutoHorizontal
            produto={PRODUTOS[0]}
            favoritado={favoritos.includes(PRODUTOS[0].id)}
            aoAlternarFavorito={alternarFavorito}
          />
          <CardProdutoHorizontal
            produto={PRODUTOS[2]}
            mostrarSeletor
            quantidade={quantidadeCarrinho}
            aoAlterarQuantidade={setQuantidadeCarrinho}
            aoRemover={() => {}}
          />
          <CardProdutoHorizontal carregando />
        </div>
      </section>

      {/* Etapas de cadastro */}
      <section className={estilos.secao}>
        <CabecalhoSecao titulo="Indicador de etapas" />
        <IndicadorEtapas etapas={ETAPAS_CADASTRO} />
      </section>

      {/* Feedback e estados */}
      <section className={estilos.secao}>
        <CabecalhoSecao titulo="Feedback, avisos e estados" />

        <div className={estilos.pilha}>
          <Aviso
            tipo="sucesso"
            titulo="Pedido enviado"
            descricao="A Cooperativa Vale Verde recebeu o pedido nº 1048."
            textoAcao="Ver pedido"
            aoClicarAcao={() => {}}
            aoFechar={() => {}}
          />
          <Aviso
            tipo="aviso"
            titulo="Estoque menor que o pedido"
            descricao="Ajustamos a quantidade de 500 kg para 300 kg."
            aoFechar={() => {}}
          />
          <Aviso
            tipo="erro"
            titulo="Não foi possível calcular o frete"
            descricao="Não encontramos o CEP 18150-001. Confira os números e tente de novo."
            textoAcao="Tentar de novo"
            aoClicarAcao={() => {}}
          />
          <Aviso
            tipo="info"
            titulo="Frete negociado acima de 1 t"
            descricao="O fornecedor pode combinar o frete com você antes de confirmar."
          />
        </div>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          <EstadoVazio
            icone="search_off"
            titulo='Nenhum resultado para "tomate cereja"'
            descricao="Tire um filtro ou confira a grafia."
            filtrosAtivos={filtrosVazio}
            aoRemoverFiltro={(id) =>
              setFiltrosVazio((atual) => atual.filter((item) => item.id !== id))
            }
            textoAcao="Limpar filtros"
            varianteAcao="secundario"
            aoClicarAcao={() => setFiltrosVazio([])}
          />
          <EstadoErro aoTentarNovamente={() => {}} />
        </SimpleGrid>

        <div className={estilos.linha}>
          <Carregando emLinha mensagem="Buscando fornecedores perto de 18150-000…" />
        </div>
        <Carregando mensagem="Carregando pedidos…" />

        <div className={estilos.grupo}>
          <p className={estilos.rotulo}>Toast &quot;Adicionado ao carrinho&quot;</p>
          <div className={estilos.linha}>
            <ToastCarrinho
              inline
              produto={PRODUTOS[0]}
              detalhe="50 kg · Cooperativa Vale Verde"
              preco="R$ 155,00 – 180,00"
              totalItens={3}
              aoFechar={() => {}}
            />
            <Botao
              variante="secundario"
              onClick={() =>
                mostrarToast({
                  produto: PRODUTOS[0],
                  detalhe: '50 kg · Cooperativa Vale Verde',
                  preco: 'R$ 155,00 – 180,00',
                  totalItens: 3,
                })
              }
            >
              Testar toast flutuante
            </Botao>
          </div>
        </div>
      </section>

      {/* Sobreposições */}
      <section className={estilos.secao}>
        <CabecalhoSecao titulo="Sobreposições: modal, gaveta, ordenar, tooltip e popover" />
        <div className={estilos.linha}>
          <Botao variante="secundario" onClick={() => setModalAberto(true)}>
            Abrir modal
          </Botao>
          <Botao variante="secundario" onClick={() => setGavetaAberta(true)}>
            Abrir gaveta
          </Botao>
          <MenuOrdenar opcoes={OPCOES_ORDENAR} valor={ordenacao} aoAlterar={setOrdenacao} />

          <TooltipBase texto="Menor quantidade que o fornecedor vende por pedido. Neste anúncio, 50 kg.">
            <Botao
              variante="icone"
              tamanho="sm"
              iconeEsquerda="info"
              aria-label="O que é pedido mínimo"
            />
          </TooltipBase>

          <PopoverBase
            aberto={popoverAberto}
            aoAlterar={setPopoverAberto}
            titulo="O que é o Outlet?"
            gatilho={
              <Botao
                variante="secundario"
                tamanho="sm"
                onClick={() => setPopoverAberto((v) => !v)}
              >
                Abrir popover Outlet
              </Botao>
            }
          >
            <p className={estilos.textoSecundario}>
              Produto fora do padrão de tamanho ou cor, com a mesma qualidade para consumo e
              desconto para evitar descarte.
            </p>
            <LinkTexto para="/busca?outlet=1" variante="acao" iconeDireita="chevron_right">
              Ver só produtos do Outlet
            </LinkTexto>
          </PopoverBase>
        </div>

        <ModalBase
          aberto={modalAberto}
          aoFechar={() => setModalAberto(false)}
          titulo="Cancelar o pedido #4821?"
          comFaixas
          rodape={
            <>
              <Botao variante="secundario" onClick={() => setModalAberto(false)}>
                Voltar
              </Botao>
              <Botao variante="perigo" onClick={() => setModalAberto(false)}>
                Cancelar pedido
              </Botao>
            </>
          }
        >
          <p className={estilos.textoSecundario}>
            A Cooperativa Vale Verde será avisada e o pedido de 200 kg de Tomate Carmem não poderá
            ser retomado.
          </p>
        </ModalBase>

        <Gaveta
          aberto={gavetaAberta}
          aoFechar={() => setGavetaAberta(false)}
          titulo="Filtros"
          comFaixas
          rodape={
            <Botao larguraTotal onClick={() => setGavetaAberta(false)}>
              Aplicar filtros
            </Botao>
          }
        >
          <Checkbox
            rotulo="Apenas produtos orgânicos"
            marcado={chipOrganico}
            aoAlterar={setChipOrganico}
          />
          <Interruptor
            rotulo="Mostrar apenas Outlet"
            ligado={chipOutlet}
            aoAlterar={setChipOutlet}
          />
        </Gaveta>
      </section>
    </Pagina>
  );
}
