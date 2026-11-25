import { Botao } from '../Botao.jsx';
import { Icone } from '../Icone.jsx';
import { Selo } from '../Selo.jsx';
import { ModalBase } from '../Sobreposicoes.jsx';
import estilos from './ModalExcluirAnuncio.module.css';

// Modal de confirmação para excluir um anúncio (ModalBase vira gaveta clara no celular).
// Exibe o resumo do produto e pede confirmação antes de remover do catálogo.
export function ModalExcluirAnuncio({ produto, aoFechar, aoConfirmar }) {
  const pausado = produto?.status === 'pausado';
  const esgotado = (produto?.estoque ?? 0) <= 0;

  return (
    <ModalBase
      aberto={Boolean(produto)}
      aoFechar={aoFechar}
      titulo="Excluir o anúncio?"
      comFaixas
      rodape={
        <div className={estilos.rodape}>
          <Botao variante="secundario" tamanho="sm" onClick={aoFechar}>
            Manter anúncio
          </Botao>
          <Botao
            variante="perigo"
            tamanho="sm"
            onClick={() => {
              if (produto) aoConfirmar(produto);
            }}
          >
            Excluir
          </Botao>
        </div>
      }
    >
      {produto && (
        <div className={estilos.corpo}>
          <p className={estilos.aviso}>
            Ele sai da busca e dos favoritos dos compradores. Os pedidos já feitos continuam
            valendo. Para parar de vender só por um tempo, pause o anúncio.
          </p>

          <div className={estilos.preview}>
            <div className={estilos.miniatura}>
              {produto.imagem ? (
                <img src={produto.imagem} alt="" className={estilos.imagem} />
              ) : (
                <Icone nome="image" tamanho={20} />
              )}
            </div>
            <div className={estilos.textos}>
              <p className={estilos.nome}>{produto.nome}</p>
              <p className={estilos.meta}>
                {produto.estoque.toLocaleString('pt-BR')} {produto.unidade} em estoque
              </p>
            </div>
            <Selo
              variante={esgotado ? 'erro' : pausado ? 'neutro' : 'sucesso'}
              tamanho="sm"
            >
              {esgotado ? 'Sem estoque' : pausado ? 'Pausado' : 'Ativo'}
            </Selo>
          </div>
        </div>
      )}
    </ModalBase>
  );
}
