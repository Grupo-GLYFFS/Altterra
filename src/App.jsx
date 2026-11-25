import { Route, Routes } from 'react-router-dom';
import { ProvedorToast } from './componentes/ProvedorToast.jsx';
import { Anuncios } from './paginas/Anuncios.jsx';
import { CadastroProduto } from './paginas/CadastroProduto.jsx';
import { NaoEncontrada } from './paginas/NaoEncontrada.jsx';
import { PedidosRecebidos } from './paginas/PedidosRecebidos.jsx';
import { SafraQueAlimenta } from './paginas/SafraQueAlimenta.jsx';
import { Busca } from './paginas/Busca.jsx';
import { Carrinho } from './paginas/Carrinho.jsx';
import { ComoFunciona } from './paginas/ComoFunciona.jsx';
import { Favoritos } from './paginas/Favoritos.jsx';
import { Finalizacao } from './paginas/Finalizacao.jsx';
import { Fornecedor } from './paginas/Fornecedor.jsx';
import { Home } from './paginas/Home.jsx';
import { Login } from './paginas/Login.jsx';
import { Pedidos } from './paginas/Pedidos.jsx';
import { Perfil } from './paginas/Perfil.jsx';
import { Produto } from './paginas/Produto.jsx';
import { VitrineComponentes } from './paginas/VitrineComponentes.jsx';

// Define todas as rotas previstas do marketplace Altterra com HashRouter.
export function App() {
  return (
    <ProvedorToast>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
        <Route path="/busca" element={<Busca />} />
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="/fornecedor/:id" element={<Fornecedor />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/finalizar" element={<Finalizacao />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/pedidos/:id" element={<Pedidos />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/anuncios" element={<Anuncios />} />
        <Route path="/pedidos-recebidos" element={<PedidosRecebidos />} />
        <Route path="/anunciar" element={<CadastroProduto />} />
        <Route path="/anunciar/:id" element={<CadastroProduto />} />
        <Route path="/safra-que-alimenta" element={<SafraQueAlimenta />} />
        <Route path="/componentes" element={<VitrineComponentes />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Routes>
    </ProvedorToast>
  );
}

export default App;
