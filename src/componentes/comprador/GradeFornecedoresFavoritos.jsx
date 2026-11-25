import { SimpleGrid } from '@mantine/core';
import { NotaCompacta } from '../Avaliacao.jsx';
import { IdentidadeFornecedor } from '../Avatar.jsx';
import { Botao } from '../Botao.jsx';
import { Selo } from '../Selo.jsx';
import estilos from './GradeFornecedoresFavoritos.module.css';

// Grade de fornecedores ligados aos produtos favoritados pelo comprador.
export function GradeFornecedoresFavoritos({ fornecedores = [] }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
      {fornecedores.map(({ fornecedor, quantidadeSalvos }) => (
        <article key={fornecedor.id} className={estilos.card}>
          <IdentidadeFornecedor
            nome={fornecedor.nome}
            subtitulo={`${fornecedor.tipo} · ${fornecedor.cidade}`}
            logo={fornecedor.logo}
            verificado={fornecedor.verificado}
            tamanhoAvatar={44}
          />

          <div className={estilos.metaLinha}>
            <NotaCompacta nota={fornecedor.nota} totalAvaliacoes={fornecedor.totalAvaliacoes} />
            <span className={estilos.salvos}>
              {quantidadeSalvos} {quantidadeSalvos === 1 ? 'produto salvo' : 'produtos salvos'}
            </span>
          </div>

          {fornecedor.kgDoados > 0 && (
            <div>
              <Selo variante="doador" tamanho="sm">
                Doou {fornecedor.kgDoados.toLocaleString('pt-BR')} kg pelo Safra que Alimenta
              </Selo>
            </div>
          )}

          <div className={estilos.rodape}>
            <Botao
              variante="secundario"
              tamanho="sm"
              larguraTotal
              para={`/fornecedor/${fornecedor.id}`}
            >
              Ver loja
            </Botao>
          </div>
        </article>
      ))}
    </SimpleGrid>
  );
}
