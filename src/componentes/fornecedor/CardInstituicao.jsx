import { Botao } from '../Botao.jsx';
import { Icone } from '../Icone.jsx';
import estilos from './CardInstituicao.module.css';

// Card de uma instituição cadastrada no programa Safra que Alimenta.
// Mostra nome, cidade, alimentos aceitos, horário de retirada e, para fornecedores, o botão "Doar".
export function CardInstituicao({ instituicao, mostrarBotaoDoar = false, aoDoar }) {
  return (
    <article className={estilos.card}>
      <div className={estilos.topo}>
        <span className={estilos.circulo} aria-hidden="true">
          <Icone nome="volunteer_activism" tamanho={20} />
        </span>
        <div className={estilos.cabecalhoTextos}>
          <h3 className={estilos.nome}>
            <span>{instituicao.nome}</span>
            <Icone nome="verified" tamanho={16} preenchido className={estilos.verificado} />
          </h3>
          <p className={estilos.cidade}>{instituicao.cidade}</p>
        </div>
      </div>

      <div className={estilos.blocoAceita}>
        <span className={estilos.rotuloAceita}>Aceita</span>
        <ul className={estilos.tags} aria-label="Categorias aceitas">
          {instituicao.aceita.map((item) => (
            <li key={item} className={estilos.tag}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <ul className={estilos.detalhes}>
        <li>
          <Icone nome="schedule" tamanho={16} />
          <span>{instituicao.retirada}</span>
        </li>
        <li>
          <Icone nome="location_on" tamanho={16} />
          <span>{instituicao.endereco}</span>
        </li>
        <li>
          <Icone nome="groups" tamanho={16} />
          <span>{instituicao.atende}</span>
        </li>
      </ul>

      {mostrarBotaoDoar && (
        <div className={estilos.rodape}>
          <Botao
            variante="principal"
            tamanho="sm"
            iconeEsquerda="volunteer_activism"
            onClick={() => aoDoar?.(instituicao)}
          >
            Doar
          </Botao>
        </div>
      )}
    </article>
  );
}
