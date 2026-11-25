import { Botao } from '../Botao.jsx';
import { CardProduto } from '../CardProduto.jsx';
import { Icone } from '../Icone.jsx';
import estilos from './TelaSucessoCadastro.module.css';

// Confirmação exibida após publicar um anúncio novo ou salvar alterações de um existente.
export function TelaSucessoCadastro({ produto, modoEdicao = false, aoNovoCadastro }) {
  return (
    <section className={estilos.container} aria-live="polite">
      <div className={estilos.cartao}>
        <div className={estilos.colunaTexto}>
          <span className={estilos.circulo} aria-hidden="true">
            <Icone nome="check" tamanho={32} />
          </span>

          <div className={estilos.textos}>
            <h2 className={estilos.titulo}>
              {modoEdicao ? `Alterações salvas em ${produto.nome}` : `${produto.nome} está no ar`}
            </h2>
            <p className={estilos.descricao}>
              {modoEdicao
                ? 'Os novos preços, estoque e detalhes já valem para os próximos pedidos.'
                : `Compradores já encontram o anúncio na busca e em ${produto.categoria}. Preço e estoque mudam em Meus anúncios.`}
            </p>
          </div>

          <div className={estilos.acoes}>
            <Botao variante="principal" tamanho="md" para={`/produto/${produto.id}`}>
              Ver anúncio
            </Botao>
            {modoEdicao ? (
              <Botao variante="secundario" tamanho="md" para="/anuncios">
                Voltar para Meus anúncios
              </Botao>
            ) : (
              <Botao variante="secundario" tamanho="md" onClick={aoNovoCadastro}>
                Anunciar outro produto
              </Botao>
            )}
          </div>
        </div>

        <div className={estilos.colunaCard}>
          <CardProduto produto={produto} aoAlternarFavorito={() => {}} />
        </div>
      </div>
    </section>
  );
}
