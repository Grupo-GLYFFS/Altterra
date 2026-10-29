import { Link } from 'react-router-dom'

// Rota coringa (path="*"): qualquer endereço que nenhuma rota reconhece.
// Reaproveita o visual do estado vazio de "Meus pedidos" (.orders-page /
// .orders-empty, em orders.css), como a tela de "Produto não encontrado".
function NotFoundPage() {
  return (
    <div className="orders-page">
      <h1 className="title-2xl">Página não encontrada</h1>
      <div className="orders-empty">
        <p className="text-muted">O endereço que você acessou não existe.</p>
        <Link className="button-primary" to="/">
          Ir para o início
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage