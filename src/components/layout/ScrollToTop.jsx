import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// O React Router troca a tela mas NÃO rola a página: ao clicar num produto
// com a Home (ou "Produtos similares") no fim da pagina, a nova pagina
// abria no mesmo ponto, no meio/fim do conteúdo. Este componente não
// desenha nada: só volta ao topo a cada mudança de rota.
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop