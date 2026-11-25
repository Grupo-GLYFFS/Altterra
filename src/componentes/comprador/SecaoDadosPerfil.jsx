import { yupResolver } from '@hookform/resolvers/yup';
import { SimpleGrid } from '@mantine/core';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Aviso } from '../Aviso.jsx';
import { Botao } from '../Botao.jsx';
import { CampoTexto } from '../Campo.jsx';
import { esquemaDados } from '../../logica/esquemas.js';
import { mascararCelular, mascararCnpj } from '../../logica/formatos.js';
import estilos from './SecaoPerfil.module.css';

// Bloco "Meus dados" do perfil, com alternância entre leitura e edição validada pelo yup.
export function SecaoDadosPerfil({ usuario, editando, aoAlterarEditando, aoSalvar }) {
  const [aviso, setAviso] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(esquemaDados),
    values: {
      nome: usuario.nome || '',
      empresa: usuario.empresa || '',
      cnpj: usuario.cnpj || '',
      celular: usuario.celular || '',
    },
  });

  // Salva as alterações de dados pessoais e da empresa.
  function enviar(dados) {
    aoSalvar(dados);
    aoAlterarEditando(false);
    setAviso('Seus dados foram atualizados.');
  }

  // Cancela a edição restaurando os valores salvos.
  function cancelar() {
    reset();
    aoAlterarEditando(false);
  }

  return (
    <section id="perfil-dados" className={estilos.card}>
      <div className={estilos.cardTopo}>
        <div>
          <h2 className={estilos.cardTitulo}>Meus dados</h2>
          <p className={estilos.meta}>Vão no pedido e na nota fiscal.</p>
        </div>
        {!editando && (
          <Botao
            variante="secundario"
            tamanho="sm"
            iconeEsquerda="edit"
            onClick={() => aoAlterarEditando(true)}
          >
            Editar
          </Botao>
        )}
      </div>

      {aviso && <Aviso tipo="sucesso" titulo={aviso} aoFechar={() => setAviso('')} />}

      {editando ? (
        <form onSubmit={handleSubmit(enviar)} className={estilos.formulario} noValidate>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <CampoTexto rotulo="Nome completo" erro={errors.nome?.message} {...register('nome')} />
            <CampoTexto
              rotulo="Celular"
              inputMode="numeric"
              erro={errors.celular?.message}
              {...register('celular', {
                onChange: (e) => {
                  e.target.value = mascararCelular(e.target.value);
                },
              })}
            />
            <CampoTexto
              rotulo="Razão social"
              erro={errors.empresa?.message}
              {...register('empresa')}
            />
            <CampoTexto
              rotulo="CNPJ"
              inputMode="numeric"
              erro={errors.cnpj?.message}
              {...register('cnpj', {
                onChange: (e) => {
                  e.target.value = mascararCnpj(e.target.value);
                },
              })}
            />
          </SimpleGrid>

          <div className={estilos.acoesLinha}>
            <Botao variante="secundario" tamanho="sm" onClick={cancelar}>
              Cancelar
            </Botao>
            <Botao tipo="submit" tamanho="sm">
              Salvar alterações
            </Botao>
          </div>
        </form>
      ) : (
        <dl className={estilos.gradeDados}>
          <div>
            <dt>Nome completo</dt>
            <dd>{usuario.nome}</dd>
          </div>
          <div>
            <dt>Celular</dt>
            <dd>{usuario.celular || 'Não informado'}</dd>
          </div>
          <div>
            <dt>E-mail</dt>
            <dd>{usuario.email}</dd>
          </div>
          <div>
            <dt>Razão social</dt>
            <dd>{usuario.empresa}</dd>
          </div>
          <div>
            <dt>CNPJ</dt>
            <dd>{usuario.cnpj}</dd>
          </div>
          <div>
            <dt>Tipo de negócio</dt>
            <dd>{usuario.tipoNegocio}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}
