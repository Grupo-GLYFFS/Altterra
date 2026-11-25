import estilos from './Tabela.module.css';

// Tabela de dados: tabela de verdade no computador e lista de cartões com rótulos no celular.
// Recebe colunas ({ id, titulo, render, alinhar, ocultarRotulo }), linhas e chave (função que devolve o id).
export function Tabela({ colunas, linhas, chave, legenda, className = '' }) {
  return (
    <div className={`${estilos.envoltorio} ${className}`}>
      <table className={estilos.tabela}>
        <caption className="somenteLeitor">{legenda}</caption>
        <thead>
          <tr>
            {colunas.map((coluna) => (
              <th key={coluna.id} scope="col" className={coluna.alinhar === 'direita' ? estilos.direita : ''}>
                {coluna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => (
            <tr key={chave(linha)}>
              {colunas.map((coluna) => (
                <td
                  key={coluna.id}
                  data-rotulo={coluna.ocultarRotulo ? '' : coluna.titulo}
                  className={coluna.alinhar === 'direita' ? estilos.direita : ''}
                >
                  {coluna.render(linha)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
