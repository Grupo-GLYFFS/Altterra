import estilos from './BannerFoto.module.css';

// Faixa com foto escura inteira, véu de verde 9 e texto branco direto sobre a foto.
// Recebe imagem, titulo, texto e children (botões); sem cards brancos sobre a imagem.
export function BannerFoto({ imagem, titulo, texto = '', children, altura = 'md', className = '' }) {
  return (
    <section className={`${estilos.banner} ${estilos[altura] || estilos.md} ${className}`}>
      {imagem && <img src={imagem} alt="" className={estilos.foto} />}
      <span className={estilos.veu} aria-hidden="true" />
      <div className={estilos.conteudo}>
        <h2 className={estilos.titulo}>{titulo}</h2>
        {texto && <p className={estilos.texto}>{texto}</p>}
        {children && <div className={estilos.acoes}>{children}</div>}
      </div>
    </section>
  );
}
