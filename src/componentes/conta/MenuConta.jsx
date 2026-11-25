import { Link } from 'react-router-dom';
import { Avatar } from '../Avatar.jsx';
import { Icone } from '../Icone.jsx';
import estilos from './MenuConta.module.css';

// Menu da conta à esquerda do perfil: cabeçalho com avatar, seções da página e atalhos.
// No celular vira uma fileira de pílulas que rola na horizontal.
// Recebe usuario, secoes ({ id, rotulo, icone }), ativa, aoSelecionar, atalhos ({ rotulo, icone, para }) e aoSair.
export function MenuConta({ usuario, secoes, ativa, aoSelecionar, atalhos = [], aoSair }) {
  return (
    <aside className={estilos.menu} aria-label="Menu da conta">
      <div className={estilos.cabecalho}>
        <Avatar foto={usuario.foto} nome={usuario.nome} tamanho={56} />
        <div className={estilos.textos}>
          <p className={estilos.nome}>{usuario.nome}</p>
          <p className={estilos.empresa}>{usuario.empresa}</p>
        </div>
      </div>

      <nav className={estilos.grupo} aria-label="Seções do perfil">
        <ul className={estilos.lista}>
          {secoes.map((secao) => (
            <li key={secao.id}>
              <button
                type="button"
                className={`${estilos.item} ${secao.id === ativa ? estilos.ativo : ''}`}
                aria-current={secao.id === ativa ? 'page' : undefined}
                onClick={() => aoSelecionar(secao.id)}
              >
                <Icone nome={secao.icone} tamanho={20} preenchido={secao.id === ativa} />
                <span>{secao.rotulo}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <nav className={`${estilos.grupo} ${estilos.atalhos}`} aria-label="Atalhos">
        <ul className={estilos.lista}>
          {atalhos.map((atalho) => (
            <li key={atalho.para}>
              <Link to={atalho.para} className={estilos.item}>
                <Icone nome={atalho.icone} tamanho={20} />
                <span>{atalho.rotulo}</span>
              </Link>
            </li>
          ))}
          <li>
            <button type="button" className={estilos.item} onClick={aoSair}>
              <Icone nome="logout" tamanho={20} />
              <span>Sair</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
