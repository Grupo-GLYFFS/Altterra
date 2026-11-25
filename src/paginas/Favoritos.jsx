import { SimpleGrid } from '@mantine/core';
import { useMemo, useState } from 'react';
import { CardProduto } from '../componentes/CardProduto.jsx';
import { BarraFiltrosFavoritos } from '../componentes/comprador/BarraFiltrosFavoritos.jsx';
import { GradeFornecedoresFavoritos } from '../componentes/comprador/GradeFornecedoresFavoritos.jsx';
import { LinkTexto } from '../componentes/LinkTexto.jsx';
import { EstadoVazio } from '../componentes/Estados.jsx';
import { Icone } from '../componentes/Icone.jsx';
import { Pagina } from '../componentes/layout/Pagina.jsx';
import { useAnuncios } from '../contexto/useAnuncios.js';
import { useFavoritos } from '../contexto/useFavoritos.js';
import { CATEGORIAS } from '../dados/categorias.js';
import { formatarReais } from '../logica/formatos.js';
import estilos from './Favoritos.module.css';

// Página de Favoritos (V03): sem painel de contagem, filtros de mudança nos chips e produtos que mudaram primeiro.
export function Favoritos() {
  const { favoritos, alternar, ehFavorito } = useFavoritos();
  const { produtos, produtosAtivos } = useAnuncios();

  const [visao, setVisao] = useState('produtos');
  const [filtro, setFiltro] = useState('todos');
  const [ordem, setOrdem] = useState('mudanca');

  // Junta cada favorito com o produto atual e calcula se o preço baixou, subiu ou ficou sem estoque.
  const itens = useMemo(() => {
    return favoritos
      .map((fav) => {
        const produto = produtos.find((p) => p.id === fav.id);
        if (!produto) return null;
        const diff = Math.round((produto.precoMin - fav.preco) * 100) / 100;
        const situacao =
          produto.estoque <= 0
            ? 'esgotado'
            : diff < -0.01
              ? 'baixou'
              : diff > 0.01
                ? 'subiu'
                : 'igual';
        return { produto, diff, situacao };
      })
      .filter(Boolean);
  }, [favoritos, produtos]);

  // Agrupa os fornecedores únicos dos produtos favoritados.
  const fornecedoresFavoritos = useMemo(() => {
    const mapa = new Map();
    itens.forEach(({ produto }) => {
      if (!produto.fornecedor) return;
      const atual = mapa.get(produto.fornecedor.id);
      if (atual) atual.quantidadeSalvos += 1;
      else mapa.set(produto.fornecedor.id, { fornecedor: produto.fornecedor, quantidadeSalvos: 1 });
    });
    return Array.from(mapa.values());
  }, [itens]);

  // Categorias presentes nos favoritos para montar os chips na barra.
  const categoriasPresentes = useMemo(() => {
    const mapa = new Map();
    itens.forEach(({ produto }) => {
      if (!produto.categoriaId) return;
      mapa.set(produto.categoriaId, (mapa.get(produto.categoriaId) || 0) + 1);
    });
    return Array.from(mapa.entries())
      .map(([id, contagem]) => {
        const info = CATEGORIAS.find((c) => c.id === id);
        return { id, nome: info?.nome || id, contagem };
      })
      .sort((a, b) => b.contagem - a.contagem);
  }, [itens]);

  const contagens = useMemo(
    () => ({
      todos: itens.length,
      baixou: itens.filter((i) => i.situacao === 'baixou').length,
      subiu: itens.filter((i) => i.situacao === 'subiu').length,
      esgotado: itens.filter((i) => i.situacao === 'esgotado').length,
      organico: itens.filter((i) => i.produto.organico).length,
      outlet: itens.filter((i) => i.produto.outlet).length,
    }),
    [itens]
  );

  const visiveis = useMemo(() => {
    const filtrados = itens.filter((item) => {
      if (filtro === 'baixou') return item.situacao === 'baixou';
      if (filtro === 'subiu') return item.situacao === 'subiu';
      if (filtro === 'esgotado') return item.situacao === 'esgotado';
      if (filtro === 'organico') return item.produto.organico;
      if (filtro === 'outlet') return item.produto.outlet;
      if (filtro.startsWith('cat:')) return item.produto.categoriaId === filtro.slice(4);
      return true;
    });

    const peso = { baixou: 0, subiu: 1, esgotado: 2, igual: 3 };
    return [...filtrados].sort((a, b) => {
      if (ordem === 'menor-preco') return a.produto.precoMin - b.produto.precoMin;
      if (ordem === 'maior-preco') return b.produto.precoMax - a.produto.precoMax;
      return peso[a.situacao] - peso[b.situacao];
    });
  }, [itens, filtro, ordem]);

  const maisProcurados = produtosAtivos.slice(0, 4);

  return (
    <Pagina>
      <div className={estilos.pagina}>
        <header className={estilos.cabecalho}>
          <h1 className={estilos.titulo}>Favoritos</h1>
          {itens.length > 0 && (
            <p className={estilos.contagem}>
              {itens.length} {itens.length === 1 ? 'produto' : 'produtos'} ·{' '}
              {fornecedoresFavoritos.length}{' '}
              {fornecedoresFavoritos.length === 1 ? 'fornecedor' : 'fornecedores'}
            </p>
          )}
        </header>

        {itens.length === 0 ? (
          <>
            <EstadoVazio
              icone="favorite"
              titulo="Nenhum favorito ainda"
              descricao="Toque no coração de um produto para guardá-lo aqui e comparar preços depois."
              textoAcao="Ver produtos"
              paraAcao="/busca"
            />

            <section className={estilos.sugestoes} aria-labelledby="titulo-procurados">
              <div className={estilos.topoSugestoes}>
                <h2 id="titulo-procurados" className={estilos.subtitulo}>
                  Mais procurados em São Paulo - SP
                </h2>
                <LinkTexto para="/busca">Ver mais</LinkTexto>
              </div>
              <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
                {maisProcurados.map((produto) => (
                  <CardProduto
                    key={produto.id}
                    produto={produto}
                    favoritado={ehFavorito(produto.id)}
                    aoAlternarFavorito={() => alternar(produto)}
                  />
                ))}
              </SimpleGrid>
            </section>
          </>
        ) : (
          <>
            <BarraFiltrosFavoritos
              visao={visao}
              aoAlterarVisao={setVisao}
              totalProdutos={itens.length}
              totalFornecedores={fornecedoresFavoritos.length}
              filtro={filtro}
              aoAlterarFiltro={setFiltro}
              ordem={ordem}
              aoAlterarOrdem={setOrdem}
              contagens={contagens}
              categorias={categoriasPresentes}
            />

            {visao === 'fornecedores' ? (
              <GradeFornecedoresFavoritos fornecedores={fornecedoresFavoritos} />
            ) : visiveis.length === 0 ? (
              <EstadoVazio
                icone="filter_alt_off"
                titulo="Nenhum favorito neste filtro"
                textoAcao="Ver todos os favoritos"
                aoClicarAcao={() => setFiltro('todos')}
              />
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
                {visiveis.map(({ produto, diff, situacao }) => (
                  <div key={produto.id} className={estilos.celula}>
                    <CardProduto
                      produto={produto}
                      favoritado
                      aoAlternarFavorito={() => alternar(produto)}
                    />
                    {situacao === 'baixou' && (
                      <p className={`${estilos.avisoMudanca} ${estilos.baixou}`}>
                        <Icone nome="trending_down" tamanho={16} />
                        <span>
                          Baixou {formatarReais(Math.abs(diff))}/{produto.unidade} desde que você salvou
                        </span>
                      </p>
                    )}
                    {situacao === 'subiu' && (
                      <p className={`${estilos.avisoMudanca} ${estilos.subiu}`}>
                        <Icone nome="trending_up" tamanho={16} />
                        <span>
                          Subiu {formatarReais(diff)}/{produto.unidade} desde que você salvou
                        </span>
                      </p>
                    )}
                  </div>
                ))}
              </SimpleGrid>
            )}
          </>
        )}
      </div>
    </Pagina>
  );
}
