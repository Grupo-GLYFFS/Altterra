import { SimpleGrid } from '@mantine/core';
import { Link } from 'react-router-dom';
import { Icone } from '../Icone.jsx';
import estilos from './SecaoPerfil.module.css';

// Grade de atalhos rápidos do perfil com contagem real de cada área.
export function SecaoAtalhosPerfil({ atalhos = [] }) {
  return (
    <section className={estilos.secaoAtalhos} aria-label="Atalhos da conta">
      <h2 className={estilos.cardTitulo}>Atalhos</h2>
      <SimpleGrid cols={{ base: 2, sm: Math.min(atalhos.length, 4) }} spacing="md">
        {atalhos.map((atalho) => (
          <Link key={atalho.para} to={atalho.para} className={estilos.cardAtalho}>
            <div className={estilos.atalhoTopo}>
              <Icone nome={atalho.icone} tamanho={24} className={estilos.iconeAtalho} />
              <Icone nome="chevron_right" tamanho={20} className={estilos.setaAtalho} />
            </div>
            <strong className={estilos.atalhoRotulo}>{atalho.rotulo}</strong>
            {atalho.resumo && <span className={estilos.atalhoResumo}>{atalho.resumo}</span>}
          </Link>
        ))}
      </SimpleGrid>
    </section>
  );
}
