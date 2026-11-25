import { SimpleGrid } from '@mantine/core';
import { useRef, useState } from 'react';
import { apenasDigitos, mascararCep } from '../../logica/formatos.js';
import { buscarCep } from '../../logica/viacep.js';
import { CampoTexto } from '../Campo.jsx';

// Campos de endereço com busca de CEP no ViaCEP (preenche rua, bairro, cidade e estado).
// Recebe as funções do React Hook Form (register, setValue) e os erros da validação.
export function CamposEndereco({ register, setValue, errors, comApelido = false }) {
  const [situacao, setSituacao] = useState('parado');
  const requisicaoAtual = useRef(0);

  // Consulta o CEP no ViaCEP e preenche os campos de endereço se for a requisição mais recente.
  async function consultarCep(valor) {
    const digitos = apenasDigitos(valor);
    if (digitos.length !== 8) {
      setSituacao('parado');
      return;
    }

    const idRequisicao = requisicaoAtual.current + 1;
    requisicaoAtual.current = idRequisicao;
    setSituacao('buscando');

    try {
      const dados = await buscarCep(digitos);
      if (requisicaoAtual.current !== idRequisicao) return;
      setValue('rua', dados.rua, { shouldValidate: true });
      setValue('bairro', dados.bairro, { shouldValidate: true });
      setValue('cidade', dados.cidade, { shouldValidate: true });
      setValue('uf', dados.uf, { shouldValidate: true });
      setSituacao('encontrado');
    } catch {
      if (requisicaoAtual.current === idRequisicao) {
        setSituacao('erro');
      }
    }
  }

  const erroCep =
    errors.cep?.message ||
    (situacao === 'erro'
      ? 'CEP não encontrado. Confira os 8 números ou preencha o endereço abaixo.'
      : '');

  const { onChange: onChangeCep, ...registroCep } = register('cep');

  return (
    <>
      {comApelido && (
        <CampoTexto
          rotulo="Nome do endereço"
          placeholder="Ex.: Loja Centro"
          erro={errors.apelido?.message}
          {...register('apelido')}
        />
      )}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <CampoTexto
          rotulo="CEP"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="00000-000"
          carregando={situacao === 'buscando'}
          sucesso={situacao === 'encontrado'}
          erro={erroCep}
          {...registroCep}
          onChange={(evento) => {
            const mascarado = mascararCep(evento.target.value);
            evento.target.value = mascarado;
            onChangeCep(evento);
            consultarCep(mascarado);
          }}
        />
        <span />
      </SimpleGrid>
      <CampoTexto
        rotulo="Rua"
        autoComplete="address-line1"
        erro={errors.rua?.message}
        {...register('rua')}
      />
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <CampoTexto rotulo="Número" erro={errors.numero?.message} {...register('numero')} />
        <CampoTexto
          rotulo="Complemento"
          opcional
          placeholder="Galpão, sala, box"
          {...register('complemento')}
        />
      </SimpleGrid>
      <CampoTexto rotulo="Bairro" erro={errors.bairro?.message} {...register('bairro')} />
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <CampoTexto rotulo="Cidade" erro={errors.cidade?.message} {...register('cidade')} />
        <CampoTexto
          rotulo="Estado"
          maxLength={2}
          placeholder="SP"
          erro={errors.uf?.message}
          {...register('uf')}
        />
      </SimpleGrid>
    </>
  );
}
