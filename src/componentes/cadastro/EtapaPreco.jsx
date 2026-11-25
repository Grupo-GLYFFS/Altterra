import { SimpleGrid } from '@mantine/core';
import { MAX_FAIXAS, OPCOES_UNIDADE, normalizarFaixas } from '../../logica/cadastro/anuncio.js';
import { formatarFaixaPreco, lerNumero } from '../../logica/formatos.js';
import { Aviso } from '../Aviso.jsx';
import { Botao } from '../Botao.jsx';
import { BlocoFormulario, CampoSelect, CampoTexto, Interruptor } from '../Campo.jsx';
import { Icone } from '../Icone.jsx';
import estilos from './EtapaPreco.module.css';

// Etapa 2 do cadastro: faixas de preço por volume, estoque disponível e opção de Outlet.
export function EtapaPreco({ dados, erros = {}, aoAlterar }) {
  const unidade = dados.unidade || 'kg';
  const faixasValidas = normalizarFaixas(dados.faixas);
  const precos = faixasValidas.map((f) => f.preco);
  const resumoCard =
    precos.length > 0
      ? `No card: ${formatarFaixaPreco(Math.min(...precos), Math.max(...precos))} /${unidade}`
      : 'Preencha ao menos uma faixa';

  // Atualiza um campo (minimo ou preco) de uma faixa específica.
  function alterarFaixa(indice, campo, valor) {
    const novas = dados.faixas.map((faixa, i) => (i === indice ? { ...faixa, [campo]: valor } : faixa));
    aoAlterar('faixas', novas);
    // Mantém o pedido mínimo sincronizado com a primeira faixa.
    if (indice === 0 && campo === 'minimo') {
      aoAlterar('pedidoMinimo', valor);
    }
  }

  // Adiciona uma nova faixa de preço sugerindo o dobro da quantidade mínima da última.
  function adicionarFaixa() {
    if (dados.faixas.length >= MAX_FAIXAS) return;
    const ultima = dados.faixas[dados.faixas.length - 1];
    const proximoMinimo = Math.max(10, Math.round(lerNumero(ultima?.minimo || 50) * 2));
    aoAlterar('faixas', [...dados.faixas, { minimo: String(proximoMinimo), preco: '' }]);
  }

  // Remove uma faixa de preço mantendo sempre pelo menos uma.
  function removerFaixa(indice) {
    if (dados.faixas.length <= 1) return;
    const restantes = dados.faixas.filter((_, i) => i !== indice);
    aoAlterar('faixas', restantes);
    if (indice === 0 && restantes[0]) {
      aoAlterar('pedidoMinimo', restantes[0].minimo);
    }
  }

  // Calcula o texto do campo "Até" a partir da faixa seguinte.
  function textoAte(indice) {
    const proxima = dados.faixas[indice + 1];
    if (!proxima) return 'Sem limite';
    const minProxima = Math.round(lerNumero(proxima.minimo));
    if (minProxima <= 1) return '—';
    return (minProxima - 1).toLocaleString('pt-BR');
  }

  return (
    <div className={estilos.pilha}>
      <BlocoFormulario
        titulo="Preço por volume"
        descricao="Quem compra mais paga menos por unidade. O card mostra do menor ao maior preço."
      >
        <div className={estilos.campoUnidade}>
          <CampoSelect
            rotulo="Unidade de venda"
            opcoes={OPCOES_UNIDADE}
            value={unidade}
            onChange={(e) => aoAlterar('unidade', e.target.value)}
          />
        </div>

        {erros.faixasGeral && <Aviso tipo="erro" descricao={erros.faixasGeral} />}

        <div className={estilos.listaFaixas}>
          {dados.faixas.map((faixa, indice) => {
            const erroFaixa = erros.faixas?.[indice] || {};
            const ultima = indice === dados.faixas.length - 1;

            return (
              <div key={indice} className={estilos.faixaCard}>
                <div className={estilos.faixaTopo}>
                  <span className={estilos.faixaRotulo}>Faixa {indice + 1}</span>
                  {dados.faixas.length > 1 && (
                    <Botao
                      variante="terciario"
                      tamanho="sm"
                      iconeEsquerda="delete"
                      aria-label={`Remover faixa ${indice + 1}`}
                      onClick={() => removerFaixa(indice)}
                    >
                      Remover
                    </Botao>
                  )}
                </div>

                <div className={estilos.faixaCampos}>
                  <CampoTexto
                    rotulo="De"
                    sufixo={unidade}
                    inputMode="numeric"
                    placeholder="50"
                    value={faixa.minimo}
                    erro={erroFaixa.minimo}
                    onChange={(e) => alterarFaixa(indice, 'minimo', e.target.value)}
                  />
                  <CampoTexto
                    rotulo="Até"
                    sufixo={ultima ? '' : unidade}
                    somenteLeitura
                    value={textoAte(indice)}
                    aria-label={`Limite superior da faixa ${indice + 1}`}
                  />
                  <CampoTexto
                    rotulo="Preço"
                    prefixo="R$"
                    sufixo={`/${unidade}`}
                    inputMode="decimal"
                    placeholder="3,60"
                    value={faixa.preco}
                    erro={erroFaixa.preco}
                    onChange={(e) => alterarFaixa(indice, 'preco', e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className={estilos.rodapeFaixas}>
          <Botao
            variante="secundario"
            tamanho="sm"
            iconeEsquerda="add"
            desabilitado={dados.faixas.length >= MAX_FAIXAS}
            aria-label={
              dados.faixas.length >= MAX_FAIXAS
                ? 'Limite de 5 faixas de preço atingido'
                : 'Adicionar faixa de preço'
            }
            onClick={adicionarFaixa}
          >
            Adicionar faixa
          </Botao>
          <span className={estilos.resumoCard}>{resumoCard}</span>
        </div>
      </BlocoFormulario>

      <BlocoFormulario
        titulo="Estoque"
        descricao="Quanto há para vender agora e a partir de quanto você aceita pedido."
      >
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <CampoTexto
            rotulo="Quantidade disponível"
            sufixo={unidade}
            inputMode="numeric"
            placeholder="1200"
            value={dados.estoque}
            erro={erros.estoque}
            onChange={(e) => aoAlterar('estoque', e.target.value)}
          />
          <CampoTexto
            rotulo="Pedido mínimo"
            sufixo={unidade}
            inputMode="numeric"
            placeholder="50"
            dica={`No card: "mín. ${lerNumero(dados.pedidoMinimo).toLocaleString('pt-BR')} ${unidade}"`}
            value={dados.pedidoMinimo}
            erro={erros.pedidoMinimo}
            onChange={(e) => {
              aoAlterar('pedidoMinimo', e.target.value);
              if (dados.faixas[0]) {
                const atualizadas = dados.faixas.map((f, i) =>
                  i === 0 ? { ...f, minimo: e.target.value } : f
                );
                aoAlterar('faixas', atualizadas);
              }
            }}
          />
        </SimpleGrid>
      </BlocoFormulario>

      <BlocoFormulario
        titulo="Outlet"
        descricao="Opcional. Use quando o lote está fora do padrão de tamanho ou cor."
      >
        <Interruptor
          rotulo="Vender como Outlet"
          descricao="Desconto para lote fora do padrão."
          ligado={dados.outlet}
          aoAlterar={(ligado) => aoAlterar('outlet', ligado)}
        />

        {dados.outlet && (
          <div className={estilos.campoDesconto}>
            <CampoTexto
              rotulo="Desconto estimado"
              sufixo="%"
              inputMode="numeric"
              placeholder="30"
              dica="Mostra o selo dourado com o desconto e o preço anterior riscado."
              value={dados.descontoPercentual}
              erro={erros.descontoPercentual}
              onChange={(e) => aoAlterar('descontoPercentual', e.target.value)}
            />
          </div>
        )}

        <ul className={estilos.notasOutlet}>
          <li>
            <Icone nome="sell" tamanho={16} />
            <span>O anúncio ganha o selo Outlet e aparece no filtro &ldquo;Só Outlet&rdquo; da busca.</span>
          </li>
          <li>
            <Icone nome="check_circle" tamanho={16} />
            <span>
              Serve para lote fora do padrão de tamanho ou cor, com o mesmo sabor. Fruta passada ou
              estragada não entra.
            </span>
          </li>
        </ul>
      </BlocoFormulario>
    </div>
  );
}
