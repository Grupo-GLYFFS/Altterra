import { Menu } from '@mantine/core';
import { Botao } from '../Botao.jsx';
import { Icone } from '../Icone.jsx';
import { Selo } from '../Selo.jsx';
import estilos from './CardEndereco.module.css';

// Card de endereço com menu de três pontos (editar, definir como principal e excluir).
export function CardEndereco({ endereco, aoEditar, aoDefinirPrincipal, aoExcluir }) {
  return (
    <article className={estilos.card}>
      <div className={estilos.topo}>
        <h3 className={estilos.apelido}>{endereco.apelido}</h3>
        {endereco.principal && <Selo variante="neutro">Principal</Selo>}
        <Menu position="bottom-end" width={240} radius="lg" shadow="md">
          <Menu.Target>
            <Botao
              variante="icone"
              tamanho="sm"
              iconeEsquerda="more_vert"
              aria-label={`Mais ações para ${endereco.apelido}`}
              className={estilos.mais}
            />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<Icone nome="edit" tamanho={20} />} onClick={() => aoEditar(endereco)}>
              Editar
            </Menu.Item>
            {!endereco.principal && (
              <Menu.Item
                leftSection={<Icone nome="check_circle" tamanho={20} />}
                onClick={() => aoDefinirPrincipal(endereco.id)}
              >
                Definir como principal
              </Menu.Item>
            )}
            <Menu.Item
              color="erro"
              leftSection={<Icone nome="delete" tamanho={20} />}
              onClick={() => aoExcluir(endereco)}
            >
              Excluir
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <p className={estilos.linha}>
        {endereco.rua}, {endereco.numero}
        {endereco.complemento ? ` · ${endereco.complemento}` : ''}
      </p>
      <p className={estilos.linha}>
        {endereco.bairro} · {endereco.cidade} - {endereco.uf} · CEP {endereco.cep}
      </p>
    </article>
  );
}
