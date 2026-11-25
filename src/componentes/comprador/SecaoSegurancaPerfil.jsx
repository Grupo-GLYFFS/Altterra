import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Aviso } from '../Aviso.jsx';
import { Botao } from '../Botao.jsx';
import { CampoTexto } from '../Campo.jsx';
import { Icone } from '../Icone.jsx';
import { ModalBase } from '../Sobreposicoes.jsx';
import { esquemaSenha } from '../../logica/esquemas.js';
import estilos from './SecaoPerfil.module.css';

// Bloco de segurança do perfil com modal/gaveta de troca de senha.
export function SecaoSegurancaPerfil({ aoAlterarSenha }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [aviso, setAviso] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(esquemaSenha),
    defaultValues: { atual: '', nova: '', confirmar: '' },
  });

  // Valida a senha atual e aplica a nova senha na sessão local.
  function enviar(dados) {
    const res = aoAlterarSenha(dados.atual, dados.nova);
    if (!res.ok) {
      setError('atual', { message: res.erro });
      return;
    }
    reset();
    setModalAberto(false);
    setAviso('Senha alterada com sucesso.');
  }

  return (
    <section id="perfil-seguranca" className={estilos.card}>
      <div className={estilos.cardTopo}>
        <div>
          <h2 className={estilos.cardTitulo}>Segurança</h2>
          <p className={estilos.meta}>Senha de acesso à sua conta.</p>
        </div>
      </div>

      {aviso && <Aviso tipo="sucesso" titulo={aviso} aoFechar={() => setAviso('')} />}

      <div className={estilos.linhaSeguranca}>
        <div className={estilos.linhaIcone}>
          <Icone nome="lock" tamanho={20} />
          <div>
            <strong>Senha</strong>
            <p className={estilos.meta}>Use pelo menos 8 caracteres, com um número.</p>
          </div>
        </div>
        <Botao variante="secundario" tamanho="sm" onClick={() => setModalAberto(true)}>
          Trocar senha
        </Botao>
      </div>

      <ModalBase
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        titulo="Trocar senha"
        comFaixas
      >
        <form onSubmit={handleSubmit(enviar)} className={estilos.formulario} noValidate>
          <CampoTexto
            rotulo="Senha atual"
            type="password"
            erro={errors.atual?.message}
            {...register('atual')}
          />
          <CampoTexto
            rotulo="Senha nova"
            type="password"
            dica="Pelo menos 8 caracteres, com um número."
            erro={errors.nova?.message}
            {...register('nova')}
          />
          <CampoTexto
            rotulo="Confirmar senha nova"
            type="password"
            erro={errors.confirmar?.message}
            {...register('confirmar')}
          />
          <div className={estilos.acoesLinha}>
            <Botao variante="secundario" tamanho="sm" onClick={() => setModalAberto(false)}>
              Cancelar
            </Botao>
            <Botao tipo="submit" tamanho="sm">
              Salvar senha
            </Botao>
          </div>
        </form>
      </ModalBase>
    </section>
  );
}
