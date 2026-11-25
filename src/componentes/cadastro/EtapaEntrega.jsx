import { SimpleGrid } from '@mantine/core';
import { useRef, useState } from 'react';
import { apenasDigitos, mascararCep } from '../../logica/formatos.js';
import { buscarCep } from '../../logica/viacep.js';
import { Aviso } from '../Aviso.jsx';
import { BlocoFormulario, CampoSelect, CampoTexto, Interruptor } from '../Campo.jsx';
import { Divisor } from '../Divisor.jsx';
import estilos from './EtapaEntrega.module.css';

// Etapa 4 do cadastro: endereço de saída (salvo ou novo via ViaCEP) e opções de entrega/retirada.
export function EtapaEntrega({ dados, erros = {}, enderecos = [], aoAlterar }) {
  const [situacaoCep, setSituacaoCep] = useState('parado');
  const requisicaoRef = useRef(0);

  const opcoesEndereco = [
    ...enderecos.map((end) => ({
      valor: end.id,
      rotulo: `${end.apelido} · ${end.cidade} - ${end.uf}`,
    })),
    { valor: 'outro', rotulo: 'Outro endereço (informar CEP)' },
  ];

  const selecionado = enderecos.find((e) => e.id === dados.enderecoId) || null;

  // Consulta o CEP no ViaCEP e preenche rua, bairro, cidade e estado.
  async function consultarCep(valor) {
    const digitos = apenasDigitos(valor);
    if (digitos.length !== 8) {
      setSituacaoCep('parado');
      return;
    }

    const idReq = requisicaoRef.current + 1;
    requisicaoRef.current = idReq;
    setSituacaoCep('buscando');

    try {
      const resultado = await buscarCep(digitos);
      if (requisicaoRef.current !== idReq) return;
      aoAlterar('rua', resultado.rua);
      aoAlterar('bairro', resultado.bairro);
      aoAlterar('cidade', resultado.cidade);
      aoAlterar('uf', resultado.uf);
      setSituacaoCep('encontrado');
    } catch {
      if (requisicaoRef.current === idReq) {
        setSituacaoCep('erro');
      }
    }
  }

  // Troca o endereço de saída e copia os campos básicos quando escolher um salvo.
  function selecionarEndereco(novoId) {
    aoAlterar('enderecoId', novoId);
    const encontrado = enderecos.find((e) => e.id === novoId);
    if (encontrado) {
      aoAlterar('cep', encontrado.cep || '');
      aoAlterar('rua', encontrado.rua || '');
      aoAlterar('numero', encontrado.numero || '');
      aoAlterar('bairro', encontrado.bairro || '');
      aoAlterar('cidade', encontrado.cidade || '');
      aoAlterar('uf', encontrado.uf || '');
      setSituacaoCep('parado');
    }
  }

  const erroCep =
    erros.cep ||
    (situacaoCep === 'erro'
      ? 'CEP não encontrado. Confira os 8 números ou preencha a cidade abaixo.'
      : '');

  return (
    <div className={estilos.pilha}>
      <BlocoFormulario
        titulo="De onde sai"
        descricao="O endereço de saída define a distância e o frete."
      >
        {enderecos.length > 0 && (
          <CampoSelect
            rotulo="Endereço de saída"
            opcoes={opcoesEndereco}
            value={dados.enderecoId}
            onChange={(e) => selecionarEndereco(e.target.value)}
          />
        )}

        {selecionado ? (
          <p className={estilos.resumoEndereco}>
            {selecionado.rua}, {selecionado.numero}
            {selecionado.bairro ? ` · ${selecionado.bairro}` : ''} · {selecionado.cidade} -{' '}
            {selecionado.uf} · {selecionado.cep}
          </p>
        ) : (
          <div className={estilos.novoEndereco}>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <CampoTexto
                rotulo="CEP"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                carregando={situacaoCep === 'buscando'}
                sucesso={situacaoCep === 'encontrado'}
                erro={erroCep}
                value={dados.cep}
                onChange={(e) => {
                  const mascarado = mascararCep(e.target.value);
                  aoAlterar('cep', mascarado);
                  consultarCep(mascarado);
                }}
              />
              <CampoTexto
                rotulo="Rua"
                opcional
                value={dados.rua}
                onChange={(e) => aoAlterar('rua', e.target.value)}
              />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <CampoTexto
                rotulo="Cidade"
                value={dados.cidade}
                erro={erros.cidade}
                onChange={(e) => aoAlterar('cidade', e.target.value)}
              />
              <CampoTexto
                rotulo="Estado"
                maxLength={2}
                placeholder="SP"
                value={dados.uf}
                erro={erros.uf}
                onChange={(e) => aoAlterar('uf', e.target.value.toUpperCase())}
              />
            </SimpleGrid>
          </div>
        )}
      </BlocoFormulario>

      <BlocoFormulario
        titulo="Como entrega"
        descricao="Pode ligar as duas opções. O comprador escolhe no pedido."
      >
        {erros.entrega && <Aviso tipo="erro" descricao={erros.entrega} />}

        <div className={estilos.opcaoEntrega}>
          <Interruptor
            rotulo="Entrega própria"
            descricao="Você leva até o comprador."
            ligado={dados.entregaPropria}
            aoAlterar={(ligado) => aoAlterar('entregaPropria', ligado)}
          />

          {dados.entregaPropria && (
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <CampoTexto
                rotulo="Raio de entrega"
                sufixo="km"
                inputMode="numeric"
                placeholder="150"
                value={dados.raioKm}
                onChange={(e) => aoAlterar('raioKm', e.target.value)}
              />
              <CampoTexto
                rotulo="Prazo"
                sufixo="dias úteis"
                placeholder="2 a 4"
                value={dados.prazoDias}
                erro={erros.prazoDias}
                onChange={(e) => aoAlterar('prazoDias', e.target.value)}
              />
              <CampoTexto
                rotulo="Frete"
                opcional
                prefixo="R$"
                sufixo="/km"
                inputMode="decimal"
                placeholder="0,40"
                value={dados.fretePorKm}
                onChange={(e) => aoAlterar('fretePorKm', e.target.value)}
              />
            </SimpleGrid>
          )}
        </div>

        <Divisor />

        <div className={estilos.opcaoEntrega}>
          <Interruptor
            rotulo="Retirada no local"
            descricao="O comprador busca no endereço de saída."
            ligado={dados.retiradaLocal}
            aoAlterar={(ligado) => aoAlterar('retiradaLocal', ligado)}
          />

          {dados.retiradaLocal && (
            <CampoTexto
              rotulo="Horário de retirada"
              placeholder="Seg. a sáb., das 6h às 14h"
              value={dados.horarioRetirada}
              erro={erros.horarioRetirada}
              onChange={(e) => aoAlterar('horarioRetirada', e.target.value)}
            />
          )}
        </div>
      </BlocoFormulario>
    </div>
  );
}
