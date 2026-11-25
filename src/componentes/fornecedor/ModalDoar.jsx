import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Botao } from '../Botao.jsx';
import { CampoArea, CampoSelect, CampoTexto, GrupoRadio } from '../Campo.jsx';
import { Icone } from '../Icone.jsx';
import { ModalBase } from '../Sobreposicoes.jsx';
import { esquemaDoacao } from '../../logica/esquemas.js';
import estilos from './ModalDoar.module.css';

const OPCOES_ENTREGA = [
  {
    valor: 'retirada',
    rotulo: 'A instituição retira',
    descricao: 'Retirada combinada na sua propriedade',
  },
  {
    valor: 'entrega',
    rotulo: 'Eu entrego',
    descricao: 'Entrega direta no endereço da instituição',
  },
];

// Modal para o fornecedor oferecer uma doação pelo Safra que Alimenta.
// Valida com React Hook Form + esquemaDoacao do yup; no celular vira gaveta clara.
export function ModalDoar({ instituicao, produtos = [], aoFechar, aoRegistrar }) {
  const [modo, setModo] = useState('retirada');
  const [observacao, setObservacao] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(esquemaDoacao),
    defaultValues: {
      instituicaoId: instituicao?.id || '',
      produtoId: produtos[0]?.id || '',
      quantidade: 50,
    },
  });

  useEffect(() => {
    if (instituicao) {
      reset({
        instituicaoId: instituicao.id,
        produtoId: produtos[0]?.id || '',
        quantidade: 50,
      });
    }
  }, [instituicao, produtos, reset]);

  const opcoesProdutos = produtos.map((p) => ({
    valor: p.id,
    rotulo: `${p.nome} · ${p.estoque.toLocaleString('pt-BR')} ${p.unidade} em estoque`,
  }));

  // Envia os dados validados da doação e limpa os campos opcionais.
  function enviar(dados) {
    const produto = produtos.find((p) => p.id === dados.produtoId);
    aoRegistrar({
      instituicaoId: instituicao.id,
      produtoId: dados.produtoId,
      produtoNome: produto ? produto.nome : 'Produto do catálogo',
      quantidade: Number(dados.quantidade),
      modo,
      observacao: observacao.trim(),
    });
    setObservacao('');
    setModo('retirada');
  }

  return (
    <ModalBase
      aberto={Boolean(instituicao)}
      aoFechar={aoFechar}
      titulo="Oferecer doação"
      subtitulo="Do seu estoque para uma instituição verificada"
      comFaixas
      tamanho={560}
      rodape={
        <div className={estilos.rodape}>
          <Botao variante="secundario" tamanho="sm" onClick={aoFechar}>
            Cancelar
          </Botao>
          <Botao
            variante="principal"
            tamanho="sm"
            iconeEsquerda="volunteer_activism"
            tipo="submit"
            form="form-oferecer-doacao"
          >
            Oferecer doação
          </Botao>
        </div>
      }
    >
      {instituicao && (
        <form id="form-oferecer-doacao" className={estilos.formulario} onSubmit={handleSubmit(enviar)} noValidate>
          <input type="hidden" {...register('instituicaoId')} />

          <div className={estilos.instituicaoResumo}>
            <span className={estilos.iconeInst} aria-hidden="true">
              <Icone nome="volunteer_activism" tamanho={20} />
            </span>
            <div>
              <p className={estilos.instNome}>
                <span>{instituicao.nome}</span>
                <Icone nome="verified" tamanho={16} preenchido className={estilos.verificado} />
              </p>
              <p className={estilos.instMeta}>
                {instituicao.cidade} · {instituicao.retirada}
              </p>
            </div>
          </div>

          <CampoSelect
            rotulo="Produto"
            placeholder="Escolha o produto"
            opcoes={opcoesProdutos}
            erro={errors.produtoId?.message}
            {...register('produtoId')}
          />

          <CampoTexto
            rotulo="Quantidade"
            type="number"
            min={1}
            step={1}
            sufixo="kg"
            erro={errors.quantidade?.message}
            {...register('quantidade')}
          />

          <GrupoRadio
            rotulo="Como chega"
            opcoes={OPCOES_ENTREGA}
            valor={modo}
            aoAlterar={setModo}
            cartao
          />

          <CampoArea
            rotulo="Observação para a instituição"
            opcional
            linhas={3}
            placeholder="Ex.: tomates maduros, bons para molho"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
        </form>
      )}
    </ModalBase>
  );
}
