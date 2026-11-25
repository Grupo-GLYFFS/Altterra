import { Chip } from '../Chip.jsx';
import { ControleSegmentado } from '../ControleSegmentado.jsx';
import { MenuOrdenar } from '../Sobreposicoes.jsx';
import estilos from './BarraFiltrosFavoritos.module.css';

const OPCOES_ORDEM_FAV = [
  { valor: 'mudanca', rotulo: 'Mudou de preço primeiro', rotuloCurto: 'Mudou de preço primeiro' },
  { valor: 'menor-preco', rotulo: 'Menor preço por kg', rotuloCurto: 'Menor preço' },
  { valor: 'maior-preco', rotulo: 'Maior preço por kg', rotuloCurto: 'Maior preço' },
];

// Barra de controles dos Favoritos: segmentado Produtos/Fornecedores, ordenação em pill e chips de filtro.
export function BarraFiltrosFavoritos({
  visao,
  aoAlterarVisao,
  totalProdutos,
  totalFornecedores,
  filtro,
  aoAlterarFiltro,
  ordem,
  aoAlterarOrdem,
  contagens,
  categorias = [],
}) {
  const opcoesVisao = [
    { valor: 'produtos', rotulo: `Produtos (${totalProdutos})` },
    { valor: 'fornecedores', rotulo: `Fornecedores (${totalFornecedores})` },
  ];

  return (
    <div className={estilos.wrapper}>
      <div className={estilos.topo}>
        <ControleSegmentado
          opcoes={opcoesVisao}
          valor={visao}
          aoAlterar={aoAlterarVisao}
          tamanho="sm"
          rotulo="Alternar entre produtos e fornecedores favoritos"
        />

        {visao === 'produtos' && (
          <MenuOrdenar opcoes={OPCOES_ORDEM_FAV} valor={ordem} aoAlterar={aoAlterarOrdem} />
        )}
      </div>

      {visao === 'produtos' && (
        <div className={estilos.chips} role="group" aria-label="Filtrar favoritos">
          <Chip
            comBorda
            ativo={filtro === 'todos'}
            contagem={contagens.todos}
            aoClicar={() => aoAlterarFiltro('todos')}
          >
            Todos
          </Chip>
          <Chip
            comBorda
            icone="trending_down"
            ativo={filtro === 'baixou'}
            contagem={contagens.baixou}
            aoClicar={() => aoAlterarFiltro('baixou')}
          >
            Baixou de preço
          </Chip>
          <Chip
            comBorda
            icone="trending_up"
            ativo={filtro === 'subiu'}
            contagem={contagens.subiu}
            aoClicar={() => aoAlterarFiltro('subiu')}
          >
            Subiu de preço
          </Chip>
          <Chip
            comBorda
            icone="block"
            ativo={filtro === 'esgotado'}
            contagem={contagens.esgotado}
            aoClicar={() => aoAlterarFiltro('esgotado')}
          >
            Sem estoque
          </Chip>
          {categorias.map((cat) => (
            <Chip
              key={cat.id}
              comBorda
              ativo={filtro === `cat:${cat.id}`}
              contagem={cat.contagem}
              aoClicar={() => aoAlterarFiltro(`cat:${cat.id}`)}
            >
              {cat.nome}
            </Chip>
          ))}
          <Chip
            comBorda
            ativo={filtro === 'organico'}
            contagem={contagens.organico}
            aoClicar={() => aoAlterarFiltro('organico')}
          >
            Orgânicos
          </Chip>
          <Chip
            comBorda
            ativo={filtro === 'outlet'}
            contagem={contagens.outlet}
            aoClicar={() => aoAlterarFiltro('outlet')}
          >
            Outlet
          </Chip>
        </div>
      )}
    </div>
  );
}
