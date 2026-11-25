import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Aviso } from '../componentes/Aviso.jsx';
import { Botao } from '../componentes/Botao.jsx';
import { CampoTexto } from '../componentes/Campo.jsx';
import { FormularioCadastroConta } from '../componentes/conta/FormularioCadastroConta.jsx';
import { LinkTexto } from '../componentes/LinkTexto.jsx';
import { LogoAltterra } from '../componentes/LogoAltterra.jsx';
import { useSessao } from '../contexto/useSessao.js';
import { LOGIN_PADRAO } from '../dados/usuarios.js';
import { esquemaRedefinir } from '../logica/esquemas.js';
import { caminhoImagem } from '../logica/imagens.js';
import estilos from './Login.module.css';

// Tela de acesso (V07): um campo de e-mail decide entre entrar e criar conta; inclui redefinição local de senha.
export function Login() {
  const navegar = useNavigate();
  const localizacao = useLocation();
  const [parametros] = useSearchParams();
  const { emailExiste, entrar, cadastrar, redefinirSenha } = useSessao();

  const destino = localizacao.state?.de || '/';
  const perfilParam = parametros.get('cadastro');

  const [etapa, setEtapa] = useState(perfilParam ? 'cadastro' : 'entrar');
  const [email, setEmail] = useState(perfilParam ? '' : LOGIN_PADRAO.email);
  const [senha, setSenha] = useState(perfilParam ? '' : LOGIN_PADRAO.senha);
  const [erroEntrar, setErroEntrar] = useState('');
  const [avisoSucesso, setAvisoSucesso] = useState('');

  const contaEncontrada = email.trim() ? emailExiste(email) : true;

  const formRedefinir = useForm({
    resolver: yupResolver(esquemaRedefinir),
    defaultValues: { email: LOGIN_PADRAO.email, senha: '' },
  });

  // Decide se entra com e-mail e senha ou avança para criar conta com o e-mail preenchido.
  function enviarEntrada(evento) {
    evento.preventDefault();
    setErroEntrar('');
    setAvisoSucesso('');

    const limpo = email.trim();
    if (!limpo || !limpo.includes('@')) {
      setErroEntrar('Digite um e-mail válido, como nome@empresa.com.br.');
      return;
    }

    if (!emailExiste(limpo)) {
      setEtapa('cadastro');
      return;
    }

    if (!senha) {
      setErroEntrar('Digite a senha para entrar.');
      return;
    }

    const resultado = entrar(limpo, senha);
    if (!resultado.ok) {
      setErroEntrar(resultado.erro);
      return;
    }
    navegar(destino, { replace: true });
  }

  // Redefine a senha localmente e volta para entrar já preenchido com a senha nova.
  function enviarRedefinicao(dados) {
    const resultado = redefinirSenha(dados.email, dados.senha);
    if (!resultado.ok) {
      formRedefinir.setError('email', { message: resultado.erro });
      return;
    }
    setEmail(dados.email);
    setSenha(dados.senha);
    setAvisoSucesso('Pronto, a senha nova já vale. É só entrar.');
    setEtapa('entrar');
  }

  const titulo =
    etapa === 'cadastro'
      ? 'Criar conta'
      : etapa === 'redefinir'
        ? 'Redefinir senha'
        : 'Entre ou cadastre-se';

  return (
    <div className={estilos.tela}>
      <div className={estilos.ladoFoto} aria-hidden="true">
        <img
          src={caminhoImagem(etapa === 'cadastro' ? 'tomate-carmem-5.webp' : 'tomate-carmem-4.webp')}
          alt=""
          className={estilos.foto}
        />
      </div>

      <main className={estilos.ladoForm}>
        <div className={`${estilos.caixa} ${etapa === 'cadastro' ? estilos.caixaLarga : ''}`}>
          <header className={estilos.cabecalho}>
            <Link to="/" className={estilos.logoLink} aria-label="Voltar para a página inicial">
              <LogoAltterra variante="escuro" tamanho="md" />
            </Link>
            <h1 className={estilos.titulo}>{titulo}</h1>
            {etapa === 'cadastro' && email && (
              <p className={estilos.subtitulo}>
                <strong>{email}</strong> ainda não tem conta. Preencha o resto e a conta entra na
                hora.
              </p>
            )}
            {etapa === 'redefinir' && (
              <p className={estilos.subtitulo}>
                Informe o e-mail da conta e escolha uma senha nova. Ela vale assim que você salvar.
              </p>
            )}
          </header>

          {etapa === 'entrar' && (
            <form onSubmit={enviarEntrada} className={estilos.formulario} noValidate>
              {avisoSucesso && (
                <Aviso tipo="sucesso" titulo="Senha redefinida" descricao={avisoSucesso} />
              )}
              {erroEntrar && <Aviso tipo="erro" titulo={erroEntrar} />}

              <CampoTexto
                rotulo="E-mail"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErroEntrar('');
                }}
                dica={
                  !contaEncontrada ? 'Esse e-mail ainda não tem conta. Continue para criar uma.' : ''
                }
              />

              {contaEncontrada && (
                <>
                  <CampoTexto
                    rotulo="Senha"
                    type="password"
                    autoComplete="current-password"
                    value={senha}
                    onChange={(e) => {
                      setSenha(e.target.value);
                      setErroEntrar('');
                    }}
                  />
                  <div className={estilos.linhaEsqueci}>
                    <LinkTexto
                      onClick={() => {
                        formRedefinir.setValue('email', email || LOGIN_PADRAO.email);
                        formRedefinir.setValue('senha', '');
                        setEtapa('redefinir');
                      }}
                    >
                      Esqueci a senha
                    </LinkTexto>
                  </div>
                </>
              )}

              <Botao
                tipo="submit"
                tamanho="md"
                larguraTotal
                iconeDireita={!contaEncontrada ? 'arrow_forward' : ''}
              >
                {contaEncontrada ? 'Entrar' : 'Continuar'}
              </Botao>

              <p className={estilos.termos}>
                Ao continuar, você aceita os Termos e a Privacidade do Altterra.
              </p>
            </form>
          )}

          {etapa === 'cadastro' && (
            <FormularioCadastroConta
              emailInicial={email}
              perfilInicial={perfilParam === 'fornecedor' ? 'fornecedor' : 'comprador'}
              aoTrocarEmail={() => setEtapa('entrar')}
              aoCadastrar={(dados) => {
                const res = cadastrar(dados);
                if (res.ok) navegar(destino, { replace: true });
                return res;
              }}
            />
          )}

          {etapa === 'redefinir' && (
            <form
              onSubmit={formRedefinir.handleSubmit(enviarRedefinicao)}
              className={estilos.formulario}
              noValidate
            >
              <CampoTexto
                rotulo="E-mail"
                type="email"
                autoComplete="email"
                erro={formRedefinir.formState.errors.email?.message}
                {...formRedefinir.register('email')}
              />
              <CampoTexto
                rotulo="Senha nova"
                type="password"
                autoComplete="new-password"
                dica="Pelo menos 8 caracteres, com um número."
                erro={formRedefinir.formState.errors.senha?.message}
                {...formRedefinir.register('senha')}
              />
              <Botao tipo="submit" tamanho="md" larguraTotal>
                Salvar senha nova
              </Botao>
              <div className={estilos.voltarCentro}>
                <LinkTexto onClick={() => setEtapa('entrar')}>Voltar para entrar</LinkTexto>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
