import { yupResolver } from '@hookform/resolvers/yup';
import { SimpleGrid } from '@mantine/core';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Aviso } from '../Aviso.jsx';
import { Botao } from '../Botao.jsx';
import { BlocoFormulario, CampoSelect, CampoTexto } from '../Campo.jsx';
import { ControleSegmentado } from '../ControleSegmentado.jsx';
import { CamposEndereco } from '../formulario/CamposEndereco.jsx';
import { Icone } from '../Icone.jsx';
import { esquemaCadastro } from '../../logica/esquemas.js';
import { mascararCnpj } from '../../logica/formatos.js';
import estilos from './FormularioCadastroConta.module.css';

const PERFIS = [
  { valor: 'comprador', rotulo: 'Comprador', icone: 'store' },
  { valor: 'fornecedor', rotulo: 'Fornecedor', icone: 'local_shipping' },
];

const TIPOS_COMPRADOR = ['Mercado', 'Restaurante', 'Sacolão', 'Cozinha industrial', 'Indústria'];
const TIPOS_FORNECEDOR = ['Produtor', 'Cooperativa', 'Distribuidor'];

// Formulário completo de criação de conta (padrão C5 com blocos brancos e segmentado Comprador/Fornecedor).
export function FormularioCadastroConta({
  emailInicial = '',
  perfilInicial = 'comprador',
  aoCadastrar,
  aoTrocarEmail,
}) {
  const [erroGeral, setErroGeral] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(esquemaCadastro),
    defaultValues: {
      perfil: perfilInicial,
      cnpj: '',
      tipoNegocio: '',
      empresa: '',
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      nome: '',
      email: emailInicial,
      senha: '',
    },
  });

  const perfil = useWatch({ control, name: 'perfil' });

  // Envia os dados validados para criar a conta e entrar na hora.
  function enviar(dados) {
    setErroGeral('');
    const resultado = aoCadastrar(dados);
    if (!resultado.ok) setErroGeral(resultado.erro);
  }

  return (
    <form onSubmit={handleSubmit(enviar)} className={estilos.formulario} noValidate>
      {erroGeral && <Aviso tipo="erro" titulo={erroGeral} />}

      <div className={estilos.seletorPerfil}>
        <p className={estilos.pergunta}>Como você vai usar o Altterra?</p>
        <ControleSegmentado
          opcoes={PERFIS}
          valor={perfil}
          larguraTotal
          rotulo="Perfil da conta"
          aoAlterar={(novoPerfil) => {
            setValue('perfil', novoPerfil);
            setValue('tipoNegocio', '');
          }}
        />
        <div className={estilos.resumoPerfil}>
          <p className={estilos.resumoTexto}>
            {perfil === 'comprador'
              ? 'Compro para o meu negócio: mercado, restaurante, sacolão ou cozinha industrial.'
              : 'Vendo minha produção ou estoque: produtor rural, cooperativa ou distribuidor.'}
          </p>
          <ul className={estilos.beneficios}>
            <li>
              <Icone nome="check" tamanho={16} />
              <span>
                {perfil === 'comprador'
                  ? 'Pedidos por kg, caixa ou tonelada'
                  : 'Anúncios com faixas de preço por volume'}
              </span>
            </li>
            <li>
              <Icone nome="check" tamanho={16} />
              <span>
                {perfil === 'comprador'
                  ? 'Frete calculado pelo CEP de entrega'
                  : 'Acesso ao Safra que Alimenta para doar excedentes'}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <BlocoFormulario titulo="Empresa" descricao="Vai na nota e no pedido que o fornecedor recebe.">
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <CampoTexto
            rotulo="CNPJ"
            inputMode="numeric"
            placeholder="00.000.000/0000-00"
            erro={errors.cnpj?.message}
            {...register('cnpj', {
              onChange: (evento) => {
                evento.target.value = mascararCnpj(evento.target.value);
              },
            })}
          />
          <CampoSelect
            rotulo="Tipo de negócio"
            placeholder="Escolha"
            opcoes={perfil === 'comprador' ? TIPOS_COMPRADOR : TIPOS_FORNECEDOR}
            erro={errors.tipoNegocio?.message}
            {...register('tipoNegocio')}
          />
        </SimpleGrid>
        <CampoTexto
          rotulo="Razão social"
          placeholder="Ex.: Cantina da Nona Ltda"
          erro={errors.empresa?.message}
          {...register('empresa')}
        />
      </BlocoFormulario>

      <BlocoFormulario
        titulo={perfil === 'comprador' ? 'Onde você recebe' : 'Onde fica a produção'}
        descricao="Usamos para calcular o frete. Você pode salvar outros endereços depois."
      >
        <CamposEndereco register={register} setValue={setValue} errors={errors} />
      </BlocoFormulario>

      <BlocoFormulario titulo="Acesso" descricao="Quem entra na conta em nome da empresa.">
        <CampoTexto
          rotulo="Nome completo"
          autoComplete="name"
          erro={errors.nome?.message}
          {...register('nome')}
        />
        <div className={estilos.linhaEmail}>
          <CampoTexto
            rotulo="E-mail"
            type="email"
            somenteLeitura={Boolean(emailInicial)}
            erro={errors.email?.message}
            className={estilos.campoEmail}
            {...register('email')}
          />
          {emailInicial && aoTrocarEmail && (
            <Botao variante="terciario" tamanho="sm" onClick={aoTrocarEmail}>
              Trocar
            </Botao>
          )}
        </div>
        <CampoTexto
          rotulo="Senha"
          type="password"
          autoComplete="new-password"
          dica="Pelo menos 8 caracteres, com um número."
          erro={errors.senha?.message}
          {...register('senha')}
        />
      </BlocoFormulario>

      <div className={estilos.rodape}>
        <p className={estilos.nota}>
          A conta já entra liberada. Ao criar, você aceita os Termos e a Privacidade.
        </p>
        <Botao tipo="submit" tamanho="md">
          Criar conta
        </Botao>
      </div>
    </form>
  );
}
