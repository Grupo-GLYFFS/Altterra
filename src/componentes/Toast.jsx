import { Botao } from './Botao.jsx';
import { Icone } from './Icone.jsx';
import estilos from './Toast.module.css';

// Card de toast "Adicionado ao carrinho" (Feedback V02).
// No computador exibe dois botões; no celular exibe apenas "Ver carrinho (N)".
export function ToastCarrinho({
  titulo = 'Adicionado ao carrinho',
  produto,
  detalhe = '',
  preco = '',
  totalItens = 1,
  aoFechar,
  aoVerCarrinho,
  inline = false,
}) {
  return (
    <div
      className={`${estilos.toast} ${inline ? estilos.inline : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className={estilos.cabecalho}>
        <Icone nome="check_circle" tamanho={20} className={estilos.check} />
        <p className={estilos.titulo}>{titulo}</p>
        {aoFechar && (
          <button
            type="button"
            className={estilos.fechar}
            onClick={aoFechar}
            aria-label="Fechar notificação"
          >
            <Icone nome="close" tamanho={20} />
          </button>
        )}
      </div>

      {produto && (
        <div className={estilos.produto}>
          {produto.imagem && (
            <img src={produto.imagem} alt={produto.nome} className={estilos.miniatura} />
          )}
          <div className={estilos.produtoTexto}>
            <p className={estilos.nome}>{produto.nome}</p>
            {detalhe && <p className={estilos.detalhe}>{detalhe}</p>}
            {preco && <p className={estilos.preco}>{preco}</p>}
          </div>
        </div>
      )}

      <div className={estilos.acoes}>
        <Botao
          variante="secundario"
          tamanho="sm"
          className={estilos.botaoContinuar}
          onClick={aoFechar}
        >
          Continuar comprando
        </Botao>
        <Botao
          variante="principal"
          tamanho="sm"
          larguraTotal
          para={!aoVerCarrinho ? '/carrinho' : ''}
          onClick={aoVerCarrinho}
        >
          Ver carrinho ({totalItens})
        </Botao>
      </div>
    </div>
  );
}
