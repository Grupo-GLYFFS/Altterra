import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NotaCompacta } from '../Avaliacao.jsx';
import { Botao } from '../Botao.jsx';
import { CampoTexto } from '../Campo.jsx';
import { Icone } from '../Icone.jsx';
import { SeletorQuantidade } from '../SeletorQuantidade.jsx';
import { Selo } from '../Selo.jsx';
import { calcularFrete, textoPrazo } from '../../logica/frete.js';
import { formatarReais, mascararCep } from '../../logica/formatos.js';
import { precoPorQuantidade, rotuloFaixa, subtotalLinha } from '../../logica/preco.js';
import { buscarCep } from '../../logica/viacep.js';
import estilos from './BlocoCompra.module.css';

// Card sticky de compra da página do produto: faixas de volume, seletor 56 px,
// frete acima do botão e ações empilhadas de 64 px em largura total.
export function BlocoCompra({
  produto,
  quantidade,
  aoAlterarQuantidade,
  aoAdicionar,
  aoComprarAgora,
}) {
  const [alterarCep, setAlterarCep] = useState(false);
  const [cepDigitado, setCepDigitado] = useState('05422-010');
  const [destinoTexto, setDestinoTexto] = useState('05422-010 · São Paulo - SP');
  const [erroCep, setErroCep] = useState('');
  const [buscandoCep, setBuscandoCep] = useState(false);

  const esgotado = produto.estoque <= 0;
  const precoAtual = precoPorQuantidade(produto, quantidade);
  const subtotal = subtotalLinha(produto, quantidade);
  const frete = calcularFrete(produto.fornecedor, quantidade, 'entrega');

  // Consulta o CEP no ViaCEP para atualizar o destino exibido no frete.
  async function confirmarCep(evento) {
    evento.preventDefault();
    setErroCep('');
    setBuscandoCep(true);
    try {
      const dados = await buscarCep(cepDigitado);
      setDestinoTexto(`${cepDigitado} · ${dados.cidade} - ${dados.uf}`);
      setAlterarCep(false);
    } catch {
      setErroCep('CEP não encontrado. Confira os 8 números.');
    } finally {
      setBuscandoCep(false);
    }
  }

  return (
    <aside className={estilos.card} aria-label="Compra do produto">
      {(produto.outlet || produto.organico) && (
        <div className={estilos.selos}>
          {produto.outlet && (
            <Selo variante="outlet" icone="">
              {produto.descontoPercentual ? `Outlet −${produto.descontoPercentual}%` : 'Outlet'}
            </Selo>
          )}
          {produto.organico && <Selo variante="organico">Orgânico</Selo>}
        </div>
      )}

      <div className={estilos.topo}>
        <h1 className={estilos.nome}>{produto.nome}</h1>
        {produto.fornecedor && (
          <p className={estilos.fornecedor}>
            <Link to={`/fornecedor/${produto.fornecedor.id}`} className={estilos.linkFornecedor}>
              {produto.fornecedor.nome}
            </Link>
            <span> · {produto.fornecedor.cidade}</span>
          </p>
        )}
        <NotaCompacta nota={produto.nota} totalAvaliacoes={produto.totalAvaliacoes} />
      </div>

      {/* Faixas de preço por volume */}
      <div className={estilos.blocoFaixas}>
        <div className={estilos.faixasTopo}>
          <span className={estilos.rotuloSecao}>Preço por volume</span>
          <span className={estilos.metaEstoque}>
            mín. {produto.pedidoMinimo.toLocaleString('pt-BR')} {produto.unidade} ·{' '}
            {esgotado
              ? 'Sem estoque'
              : `${produto.estoque.toLocaleString('pt-BR')} ${produto.unidade} disponíveis`}
          </span>
        </div>

        <div className={estilos.gradeFaixas} role="list">
          {produto.faixas.map((faixa, indice) => {
            const ativa = faixa.preco === precoAtual;
            return (
              <button
                key={faixa.minimo}
                type="button"
                className={`${estilos.faixa} ${ativa ? estilos.faixaAtiva : ''}`}
                disabled={esgotado}
                onClick={() => aoAlterarQuantidade(Math.min(produto.estoque, faixa.minimo))}
              >
                <strong className={estilos.faixaPreco}>{formatarReais(faixa.preco)}</strong>
                <span className={estilos.faixaIntervalo}>{rotuloFaixa(produto, indice)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantidade e subtotal */}
      <div className={estilos.blocoQuantidade}>
        <span className={estilos.rotuloSecao}>Quantidade</span>
        <div className={estilos.linhaQuantidade}>
          <SeletorQuantidade
            tamanho="md"
            valor={quantidade}
            minimo={produto.pedidoMinimo}
            maximo={produto.estoque || produto.pedidoMinimo}
            passo={10}
            unidade={produto.unidade}
            desabilitado={esgotado}
            aoAlterar={aoAlterarQuantidade}
          />
          <div className={estilos.subtotal}>
            <span className={estilos.subtotalRotulo}>Subtotal</span>
            <strong className={estilos.subtotalValor}>{formatarReais(subtotal)}</strong>
          </div>
        </div>
      </div>

      {/* Frete acima do botão principal */}
      <div className={estilos.blocoFrete}>
        <div className={estilos.freteLinha}>
          <Icone nome="local_shipping" tamanho={20} className={estilos.freteIcone} />
          <div className={estilos.freteTextos}>
            <p className={estilos.fretePrincipal}>
              <strong>{formatarReais(frete)}</strong> de frete para {destinoTexto}
            </p>
            <p className={estilos.fretePrazo}>{textoPrazo(produto.fornecedor)}</p>
          </div>
          <Botao
            variante="terciario"
            tamanho="sm"
            onClick={() => setAlterarCep((atual) => !atual)}
          >
            {alterarCep ? 'Fechar' : 'Alterar'}
          </Botao>
        </div>

        {alterarCep && (
          <form onSubmit={confirmarCep} className={estilos.formCep}>
            <CampoTexto
              rotulo="CEP de entrega"
              placeholder="00000-000"
              inputMode="numeric"
              value={cepDigitado}
              erro={erroCep}
              carregando={buscandoCep}
              onChange={(e) => setCepDigitado(mascararCep(e.target.value))}
              className={estilos.campoCep}
            />
            <Botao tipo="submit" variante="secundario" tamanho="md" carregando={buscandoCep}>
              Calcular
            </Botao>
          </form>
        )}
      </div>

      {/* Ações principais de 64 px empilhadas em largura total */}
      <div className={estilos.acoes}>
        <Botao
          variante="principal"
          tamanho="lg"
          larguraTotal
          iconeEsquerda="shopping_cart"
          desabilitado={esgotado}
          onClick={aoAdicionar}
        >
          {esgotado ? 'Produto sem estoque' : 'Adicionar ao carrinho'}
        </Botao>
        <Botao
          variante="secundario"
          tamanho="lg"
          larguraTotal
          desabilitado={esgotado}
          onClick={aoComprarAgora}
        >
          Comprar agora
        </Botao>
      </div>
    </aside>
  );
}
