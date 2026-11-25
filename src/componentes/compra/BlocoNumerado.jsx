import { Icone } from '../Icone.jsx';
import { Botao } from '../Botao.jsx';
import estilos from './BlocoNumerado.module.css';

// Bloco numerado da finalização em uma página só.
// Estados: "aberto" (mostra o conteúdo), "concluido" (mostra o resumo e "Alterar") e "bloqueado" (cinza, aguarda a etapa anterior).
export function BlocoNumerado({
  numero,
  titulo,
  resumo = '',
  estado = 'aberto',
  aoAlterar,
  id,
  children,
}) {
  const idTitulo = `${id}-titulo`;

  return (
    <section
      className={`${estilos.bloco} ${estilos[estado] || ''}`}
      aria-labelledby={idTitulo}
      aria-disabled={estado === 'bloqueado' || undefined}
    >
      <header className={estilos.cabecalho}>
        <span className={estilos.numero} aria-hidden="true">
          {estado === 'concluido' ? <Icone nome="check" tamanho={20} /> : numero}
        </span>
        <div className={estilos.textos}>
          <h2 id={idTitulo} className={estilos.titulo}>
            <span className="somenteLeitor">Passo {numero}: </span>
            {titulo}
          </h2>
          {estado !== 'aberto' && resumo && <p className={estilos.resumo}>{resumo}</p>}
        </div>
        {estado === 'concluido' && aoAlterar && (
          <Botao variante="terciario" tamanho="sm" onClick={aoAlterar} aria-label={`Alterar ${titulo.toLowerCase()}`}>
            Alterar
          </Botao>
        )}
      </header>
      {estado === 'aberto' && <div className={estilos.corpo}>{children}</div>}
    </section>
  );
}
