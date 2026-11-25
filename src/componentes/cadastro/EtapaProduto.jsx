import { SimpleGrid } from '@mantine/core';
import { CATEGORIAS } from '../../dados/categorias.js';
import { OPCOES_CALIBRE, OPCOES_CULTIVO } from '../../logica/cadastro/anuncio.js';
import { BlocoFormulario, CampoArea, CampoSelect, CampoTexto, GrupoRadio } from '../Campo.jsx';
import estilos from './EtapaProduto.module.css';

const OPCOES_CATEGORIAS = CATEGORIAS.map((cat) => ({ valor: cat.id, rotulo: cat.nome }));

// Etapa 1 do cadastro: tipo de produto, título/descrição do anúncio e dados de cultivo.
export function EtapaProduto({ dados, erros = {}, aoAlterar }) {
  const opcoesCalibre =
    dados.calibre && !OPCOES_CALIBRE.some((o) => o.valor === dados.calibre)
      ? [...OPCOES_CALIBRE, { valor: dados.calibre, rotulo: dados.calibre }]
      : OPCOES_CALIBRE;

  return (
    <div className={estilos.pilha}>
      <BlocoFormulario
        titulo="Tipo de produto"
        descricao="Define em que categoria e filtro o anúncio aparece na busca."
      >
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <CampoSelect
            rotulo="Categoria"
            placeholder="Escolha a categoria"
            opcoes={OPCOES_CATEGORIAS}
            value={dados.categoriaId}
            erro={erros.categoriaId}
            onChange={(e) => aoAlterar('categoriaId', e.target.value)}
          />
          <CampoTexto
            rotulo="Produto"
            opcional
            placeholder="Ex.: Tomate"
            value={dados.tipoProduto}
            onChange={(e) => aoAlterar('tipoProduto', e.target.value)}
          />
          <CampoTexto
            rotulo="Variedade"
            opcional
            placeholder="Ex.: Carmem, longa vida"
            value={dados.variedade}
            onChange={(e) => aoAlterar('variedade', e.target.value)}
          />
        </SimpleGrid>
      </BlocoFormulario>

      <BlocoFormulario
        titulo="Anúncio"
        descricao="O que o comprador lê no card e na página do produto."
      >
        <div className={estilos.campoContado}>
          <CampoTexto
            rotulo="Título"
            placeholder="Ex.: Tomate Carmem longa vida, calibre 3A"
            maxLength={80}
            value={dados.nome}
            erro={erros.nome}
            onChange={(e) => aoAlterar('nome', e.target.value)}
          />
          <span className={estilos.contador} aria-live="polite">
            {dados.nome.length}/80
          </span>
        </div>

        <div className={estilos.campoContado}>
          <CampoArea
            rotulo="Descrição"
            opcional
            linhas={4}
            maxLength={600}
            placeholder="Conte como o lote é colhido, selecionado e embalado."
            value={dados.descricao}
            erro={erros.descricao}
            onChange={(e) => aoAlterar('descricao', e.target.value)}
          />
          <span className={estilos.contador} aria-live="polite">
            {dados.descricao.length}/600
          </span>
        </div>
      </BlocoFormulario>

      <BlocoFormulario titulo="Cultivo" descricao="Aparece como selo e na ficha técnica.">
        <GrupoRadio
          rotulo="Modo de cultivo"
          cartao
          opcoes={OPCOES_CULTIVO}
          valor={dados.modoCultivo}
          aoAlterar={(valor) => aoAlterar('modoCultivo', valor)}
          className={estilos.radioCultivo}
        />

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <CampoTexto
            rotulo="Umidade"
            opcional
            sufixo="%"
            inputMode="numeric"
            placeholder="Ex.: 94"
            value={dados.umidade}
            onChange={(e) => aoAlterar('umidade', e.target.value)}
          />
          <CampoTexto
            rotulo="Avarias"
            opcional
            sufixo="%"
            inputMode="numeric"
            placeholder="Ex.: 2"
            value={dados.avarias}
            onChange={(e) => aoAlterar('avarias', e.target.value)}
          />
          <CampoSelect
            rotulo="Calibre"
            opcional
            opcoes={opcoesCalibre}
            value={dados.calibre}
            onChange={(e) => aoAlterar('calibre', e.target.value)}
          />
        </SimpleGrid>
      </BlocoFormulario>
    </div>
  );
}
