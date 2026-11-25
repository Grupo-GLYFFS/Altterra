import { yupResolver } from '@hookform/resolvers/yup';
import { Menu, SimpleGrid } from '@mantine/core';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Botao } from '../Botao.jsx';
import { EstadoVazio } from '../Estados.jsx';
import { CamposEndereco } from '../formulario/CamposEndereco.jsx';
import { Selo } from '../Selo.jsx';
import { ModalBase } from '../Sobreposicoes.jsx';
import { esquemaEndereco } from '../../logica/esquemas.js';
import estilos from './SecaoPerfil.module.css';

const ENDERECO_VAZIO = {
  apelido: '',
  cep: '',
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
};

// Bloco de endereços do perfil com menu de três pontos (Conta V05) e modal/gaveta de edição.
export function SecaoEnderecosPerfil({
  enderecos = [],
  ehFornecedor,
  aoSalvar,
  aoRemover,
  aoDefinirPrincipal,
}) {
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(esquemaEndereco),
    defaultValues: ENDERECO_VAZIO,
  });

  // Abre o modal vazio para cadastro ou preenchido para edição.
  function abrirModal(endereco = null) {
    setEditando(endereco);
    reset(endereco || ENDERECO_VAZIO);
    setModalAberto(true);
  }

  // Salva o endereço novo ou atualizado e fecha o modal.
  function enviar(dados) {
    aoSalvar(editando ? { ...dados, id: editando.id } : dados);
    setModalAberto(false);
  }

  return (
    <section id="perfil-enderecos" className={estilos.card}>
      <div className={estilos.cardTopo}>
        <div>
          <h2 className={estilos.cardTitulo}>
            {ehFornecedor ? 'Endereços de saída' : 'Endereços de entrega'}
          </h2>
          <p className={estilos.meta}>
            {ehFornecedor
              ? 'O padrão aparece no anúncio como a sua região.'
              : 'O padrão entra no cálculo do frete.'}
          </p>
        </div>
        <Botao
          variante="secundario"
          tamanho="sm"
          iconeEsquerda="add"
          onClick={() => abrirModal()}
        >
          Adicionar
        </Botao>
      </div>

      {enderecos.length === 0 ? (
        <EstadoVazio
          icone="location_on"
          titulo="Nenhum endereço salvo"
          descricao="Cadastre um endereço para agilizar seus pedidos e o cálculo de frete."
          textoAcao="Adicionar endereço"
          aoClicarAcao={() => abrirModal()}
        />
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {enderecos.map((end) => (
            <article key={end.id} className={estilos.cardEndereco}>
              <div className={estilos.endTopo}>
                <div className={estilos.endTitulo}>
                  <strong>{end.apelido}</strong>
                  {end.principal && (
                    <Selo variante="sucesso" tamanho="sm">
                      Padrão
                    </Selo>
                  )}
                </div>

                <Menu position="bottom-end" radius="lg" shadow="md">
                  <Menu.Target>
                    <Botao
                      variante="icone"
                      tamanho="sm"
                      iconeEsquerda="more_vert"
                      aria-label={`Opções de ${end.apelido}`}
                    />
                  </Menu.Target>
                  <Menu.Dropdown>
                    {!end.principal && (
                      <Menu.Item onClick={() => aoDefinirPrincipal(end.id)}>
                        Definir como padrão
                      </Menu.Item>
                    )}
                    <Menu.Item onClick={() => abrirModal(end)}>Editar</Menu.Item>
                    {enderecos.length > 1 && (
                      <Menu.Item color="red" onClick={() => aoRemover(end.id)}>
                        Remover
                      </Menu.Item>
                    )}
                  </Menu.Dropdown>
                </Menu>
              </div>

              <p className={estilos.meta}>
                {end.rua}, {end.numero}
                {end.complemento ? ` · ${end.complemento}` : ''}
              </p>
              <p className={estilos.meta}>
                {end.bairro ? `${end.bairro}, ` : ''}
                {end.cidade} - {end.uf} · CEP {end.cep}
              </p>
            </article>
          ))}
        </SimpleGrid>
      )}

      <ModalBase
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        titulo={editando ? 'Editar endereço' : 'Novo endereço'}
        comFaixas
        tamanho={560}
        rodape={
          <div className={estilos.acoesLinha}>
            <Botao variante="secundario" tamanho="sm" onClick={() => setModalAberto(false)}>
              Cancelar
            </Botao>
            <Botao tipo="submit" form="form-endereco-perfil" tamanho="sm">
              Salvar endereço
            </Botao>
          </div>
        }
      >
        <form
          id="form-endereco-perfil"
          onSubmit={handleSubmit(enviar)}
          className={estilos.formulario}
          noValidate
        >
          <CamposEndereco comApelido register={register} setValue={setValue} errors={errors} />
        </form>
      </ModalBase>
    </section>
  );
}
