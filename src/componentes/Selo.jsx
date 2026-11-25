import { Icone } from './Icone.jsx';
import estilos from './Selo.module.css';

const ICONES_PADRAO = {
  outlet: 'sell',
  organico: 'eco',
  novo: 'auto_awesome',
  verificado: 'verified',
  doador: 'volunteer_activism',
  sucesso: 'check_circle',
  aviso: 'schedule',
  erro: 'cancel',
  info: 'local_shipping',
  neutro: '',
};

// Selo em pill com ícone e texto (padrão Miúdos V03).
// Variantes: outlet, organico, novo, verificado, doador, sucesso, aviso, erro, info, neutro.
export function Selo({
  children,
  variante = 'neutro',
  tamanho = 'md',
  icone,
  preencherIcone = false,
  className = '',
}) {
  const nomeIcone = icone === undefined ? ICONES_PADRAO[variante] : icone;
  const classes = [
    estilos.selo,
    estilos[variante] || estilos.neutro,
    tamanho === 'sm' ? estilos.sm : '',
    nomeIcone ? estilos.comIcone : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {nomeIcone && (
        <Icone
          nome={nomeIcone}
          tamanho={16}
          preenchido={preencherIcone || variante === 'verificado'}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
