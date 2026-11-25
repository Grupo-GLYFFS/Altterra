import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Botao } from '../Botao.jsx';
import { Icone } from '../Icone.jsx';
import { Selo } from '../Selo.jsx';
import { Gaveta, PopoverBase } from '../Sobreposicoes.jsx';
import { formatarFaixaPreco } from '../../logica/formatos.js';
import estilos from './MenuAcoesAnuncio.module.css';

// Menu "Mais" de um anúncio: Popover no computador e gaveta clara no celular.
// Reúne Editar, Pausar/Reativar, Duplicar, alternar Outlet e Excluir.
export function MenuAcoesAnuncio({
  produto,
  aoAlternarPausa,
  aoDuplicar,
  aoAlternarOutlet,
  aoPedirExclusao,
}) {
  const [aberto, setAberto] = useState(false);
  const ehCelular = useMediaQuery('(max-width: 63.99em)', false, {
    getInitialValueInEffect: false,
  });
  const pausado = produto.status === 'pausado';
  const esgotado = produto.estoque <= 0;

  // Executa a ação e fecha o menu.
  function executar(acao) {
    setAberto(false);
    acao?.();
  }

  const listaAcoes = (
    <ul className={estilos.lista} role="menu" aria-label={`Ações para ${produto.nome}`}>
      <li role="none">
        <Link
          to={`/anunciar/${produto.id}`}
          role="menuitem"
          className={estilos.item}
          onClick={() => setAberto(false)}
        >
          <Icone nome="edit" tamanho={20} />
          <span className={estilos.textos}>
            <span className={estilos.rotulo}>Editar anúncio</span>
          </span>
        </Link>
      </li>

      {!esgotado && (
        <li role="none">
          <button
            type="button"
            role="menuitem"
            className={estilos.item}
            onClick={() => executar(() => aoAlternarPausa(produto))}
          >
            <Icone nome={pausado ? 'play_arrow' : 'pause'} tamanho={20} />
            <span className={estilos.textos}>
              <span className={estilos.rotulo}>
                {pausado ? 'Reativar anúncio' : 'Pausar anúncio'}
              </span>
              <span className={estilos.dica}>
                {pausado ? 'Volta a aparecer na busca' : 'Sai da busca até você reativar'}
              </span>
            </span>
          </button>
        </li>
      )}

      <li role="none">
        <button
          type="button"
          role="menuitem"
          className={estilos.item}
          onClick={() => executar(() => aoDuplicar(produto))}
        >
          <Icone nome="content_copy" tamanho={20} />
          <span className={estilos.textos}>
            <span className={estilos.rotulo}>Duplicar</span>
            <span className={estilos.dica}>Cria uma cópia pausada</span>
          </span>
        </button>
      </li>

      <li role="none">
        <button
          type="button"
          role="menuitem"
          className={estilos.item}
          onClick={() => executar(() => aoAlternarOutlet(produto))}
        >
          <Icone nome="sell" tamanho={20} />
          <span className={estilos.textos}>
            <span className={estilos.rotulo}>
              {produto.outlet ? 'Remover do Outlet' : 'Marcar como Outlet'}
            </span>
            <span className={estilos.dica}>
              {produto.outlet ? 'Volta ao preço padrão' : 'Desconto para escoar o lote rápido'}
            </span>
          </span>
        </button>
      </li>

      <li role="separator" className={estilos.divisor} />

      <li role="none">
        <button
          type="button"
          role="menuitem"
          className={`${estilos.item} ${estilos.perigo}`}
          onClick={() => executar(() => aoPedirExclusao(produto))}
        >
          <Icone nome="delete" tamanho={20} />
          <span className={estilos.textos}>
            <span className={estilos.rotulo}>Excluir anúncio</span>
          </span>
        </button>
      </li>
    </ul>
  );

  const gatilho = (
    <Botao
      variante="icone"
      tamanho="sm"
      iconeEsquerda="more_horiz"
      aria-label={`Mais ações para ${produto.nome}`}
      aria-haspopup="menu"
      aria-expanded={aberto}
      onClick={() => setAberto((atual) => !atual)}
    />
  );

  if (ehCelular) {
    return (
      <>
        {gatilho}
        <Gaveta aberto={aberto} aoFechar={() => setAberto(false)}>
          <div className={estilos.resumoGaveta}>
            <div className={estilos.miniatura}>
              {produto.imagem ? (
                <img src={produto.imagem} alt="" className={estilos.imagem} />
              ) : (
                <Icone nome="image" tamanho={20} />
              )}
            </div>
            <div className={estilos.resumoTextos}>
              <p className={estilos.resumoNome}>{produto.nome}</p>
              <p className={estilos.resumoMeta}>
                {formatarFaixaPreco(produto.precoMin, produto.precoMax)} /{produto.unidade} ·{' '}
                {produto.estoque.toLocaleString('pt-BR')} {produto.unidade}
              </p>
            </div>
            <Selo
              variante={esgotado ? 'erro' : pausado ? 'neutro' : 'sucesso'}
              tamanho="sm"
            >
              {esgotado ? 'Sem estoque' : pausado ? 'Pausado' : 'Ativo'}
            </Selo>
          </div>
          {listaAcoes}
        </Gaveta>
      </>
    );
  }

  return (
    <PopoverBase aberto={aberto} aoAlterar={setAberto} gatilho={gatilho} largura={268}>
      {listaAcoes}
    </PopoverBase>
  );
}
