import { yupResolver } from '@hookform/resolvers/yup';
import { SimpleGrid } from '@mantine/core';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Acordeao } from '../componentes/Acordeao.jsx';
import { Aviso } from '../componentes/Aviso.jsx';
import { Botao } from '../componentes/Botao.jsx';
import { CampoArea, CampoSelect, CampoTexto } from '../componentes/Campo.jsx';
import { Chip } from '../componentes/Chip.jsx';
import { ControleSegmentado } from '../componentes/ControleSegmentado.jsx';
import { ImagemSegura } from '../componentes/ImagemSegura.jsx';
import { Pagina } from '../componentes/layout/Pagina.jsx';
import { useDoacoes } from '../contexto/useDoacoes.js';
import {
  ASSUNTOS_CONTATO,
  BENTO_POR_PUBLICO,
  PASSOS_POR_PUBLICO,
  PERGUNTAS_FAQ,
  PUBLICOS,
} from '../dados/comoFunciona.js';
import { caminhoImagem } from '../logica/imagens.js';
import estilos from './ComoFunciona.module.css';

const ESQUEMA_CONTATO = yup.object({
  nome: yup.string().trim().required('Digite seu nome.'),
  email: yup
    .string()
    .trim()
    .email('Digite um e-mail válido, como nome@empresa.com.br.')
    .required('Digite seu e-mail.'),
  assunto: yup.string().required('Escolha um assunto.'),
  mensagem: yup
    .string()
    .trim()
    .min(10, 'Escreva pelo menos 10 caracteres.')
    .max(500, 'Use até 500 caracteres.')
    .required('Escreva sua mensagem.'),
});

const FILTROS_FAQ = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'compradores', rotulo: 'Compradores' },
  { id: 'fornecedores', rotulo: 'Fornecedores' },
  { id: 'instituicoes', rotulo: 'Instituições' },
];

// Card do mosaico bento: foto com véu escuro ou bloco sólido verde 8/9, nunca clicável.
function PecaBento({ peca, classeArea }) {
  const classeTipo =
    peca.tipo === 'solido9'
      ? estilos.solido9
      : peca.tipo === 'solido8'
        ? estilos.solido8
        : estilos.comFoto;

  return (
    <article className={`${estilos.bentoCard} ${classeTipo} ${classeArea}`}>
      {peca.imagem && (
        <>
          <ImagemSegura src={peca.imagem} alt="" className={estilos.bentoFoto} aria-hidden="true" />
          <div className={estilos.bentoVeu} aria-hidden="true" />
        </>
      )}
      <div className={estilos.bentoTexto}>
        {peca.numero && <p className={estilos.bentoNumero}>{peca.numero}</p>}
        {peca.titulo && <h3 className={estilos.bentoTitulo}>{peca.titulo}</h3>}
        <p className={estilos.bentoDescricao}>{peca.texto}</p>
      </div>
    </article>
  );
}

// Tela Como funciona (W06): bento em mosaico, 4 passos, impacto do Safra, FAQ e Fale conosco.
export function ComoFunciona() {
  const [publico, setPublico] = useState('compradores');
  const [filtroFaq, setFiltroFaq] = useState('todos');
  const [enviado, setEnviado] = useState(false);
  const { totais } = useDoacoes();

  const bento = BENTO_POR_PUBLICO[publico];
  const passos = PASSOS_POR_PUBLICO[publico];
  const perguntasVisiveis =
    filtroFaq === 'todos' ? PERGUNTAS_FAQ : PERGUNTAS_FAQ.filter((p) => p.publico === filtroFaq);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ESQUEMA_CONTATO),
    defaultValues: { nome: '', email: '', assunto: '', mensagem: '' },
  });

  // Registra o envio da mensagem e mostra a confirmação na própria página.
  function enviarContato() {
    setEnviado(true);
    reset();
  }

  return (
    <Pagina>
      <div className={estilos.pagina}>
        {/* 1. Por que o Altterra */}
        <section className={estilos.secao} aria-labelledby="titulo-porque">
          <div className={estilos.topoSecao}>
            <h1 id="titulo-porque" className={estilos.tituloSecao}>
              Por que o Altterra?
            </h1>
            <ControleSegmentado
              opcoes={PUBLICOS}
              valor={publico}
              aoAlterar={setPublico}
              tamanho="sm"
              rotulo="Escolher perfil para ver benefícios"
            />
          </div>

          <div className={estilos.bentoGrade}>
            <PecaBento peca={bento.altoEsquerda} classeArea={estilos.areaAltoEsq} />
            <PecaBento peca={bento.topoMeio} classeArea={estilos.areaTopoMeio} />
            <PecaBento peca={bento.topoDireita} classeArea={estilos.areaTopoDir} />
            <PecaBento peca={bento.meioSolido} classeArea={estilos.areaMeioSolido} />
            <PecaBento peca={bento.altoDireita} classeArea={estilos.areaAltoDir} />
            <PecaBento peca={bento.baseLarga} classeArea={estilos.areaBaseLarga} />
          </div>
        </section>

        {/* 2. Como funciona para você */}
        <section className={estilos.secao} aria-labelledby="titulo-passos">
          <div className={estilos.topoSecao}>
            <div>
              <h2 id="titulo-passos" className={estilos.tituloSecao}>
                Como funciona para você
              </h2>
              <p className={estilos.subtituloSecao}>
                Escolha quem você é para ver o caminho do começo ao fim.
              </p>
            </div>
            <ControleSegmentado
              opcoes={PUBLICOS}
              valor={publico}
              aoAlterar={setPublico}
              tamanho="sm"
              rotulo="Escolher perfil para ver os passos"
            />
          </div>

          <ol className={estilos.gradePassos}>
            {passos.map((passo) => (
              <li key={passo.numero} className={estilos.passo}>
                <span className={estilos.numeroPasso}>{passo.numero}</span>
                <h3 className={estilos.tituloPasso}>{passo.titulo}</h3>
                <p className={estilos.textoPasso}>{passo.texto}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 3. Impacto do Safra que Alimenta */}
        <section className={estilos.secao} aria-labelledby="titulo-impacto">
          <div>
            <h2 id="titulo-impacto" className={estilos.tituloSecao}>
              Impacto do Safra que Alimenta
            </h2>
            <p className={estilos.subtituloSecao}>Somado desde março de 2026, quando o programa começou.</p>
          </div>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            <article className={`${estilos.bentoCard} ${estilos.comFoto} ${estilos.cardImpacto}`}>
              <ImagemSegura src={caminhoImagem('safra-kg-doados.webp')} alt="" className={estilos.bentoFoto} aria-hidden="true" />
              <div className={estilos.bentoVeu} aria-hidden="true" />
              <div className={estilos.bentoTexto}>
                <p className={estilos.bentoNumero}>{totais.kg.toLocaleString('pt-BR')} kg</p>
                <p className={estilos.bentoTitulo}>de alimentos doados</p>
                <p className={estilos.bentoDescricao}>em {totais.doacoes} doações registradas</p>
              </div>
            </article>

            <article className={`${estilos.bentoCard} ${estilos.comFoto} ${estilos.cardImpacto}`}>
              <ImagemSegura src={caminhoImagem('safra-fornecedores.webp')} alt="" className={estilos.bentoFoto} aria-hidden="true" />
              <div className={estilos.bentoVeu} aria-hidden="true" />
              <div className={estilos.bentoTexto}>
                <p className={estilos.bentoNumero}>{totais.doacoes}</p>
                <p className={estilos.bentoTitulo}>doações realizadas</p>
                <p className={estilos.bentoDescricao}>por cooperativas e produtores</p>
              </div>
            </article>

            <article className={`${estilos.bentoCard} ${estilos.comFoto} ${estilos.cardImpacto}`}>
              <ImagemSegura src={caminhoImagem('safra-instituicoes.webp')} alt="" className={estilos.bentoFoto} aria-hidden="true" />
              <div className={estilos.bentoVeu} aria-hidden="true" />
              <div className={estilos.bentoTexto}>
                <p className={estilos.bentoNumero}>{totais.instituicoes}</p>
                <p className={estilos.bentoTitulo}>instituições atendidas</p>
                <p className={estilos.bentoDescricao}>em cidades do Sudeste</p>
              </div>
            </article>
          </SimpleGrid>
        </section>

        {/* 4. Perguntas frequentes */}
        <section className={estilos.secaoCentral} aria-labelledby="titulo-faq">
          <div className={estilos.cabecalhoCentro}>
            <h2 id="titulo-faq" className={estilos.tituloSecao}>
              Perguntas frequentes
            </h2>
            <div className={estilos.filtrosFaq}>
              {FILTROS_FAQ.map((filtro) => (
                <Chip
                  key={filtro.id}
                  ativo={filtroFaq === filtro.id}
                  aoClicar={() => setFiltroFaq(filtro.id)}
                >
                  {filtro.rotulo}
                </Chip>
              ))}
            </div>
          </div>

          <div className={estilos.colunaLeitura}>
            <Acordeao
              itens={perguntasVisiveis}
              abertoInicial={perguntasVisiveis[0]?.id || ''}
            />
          </div>
        </section>

        {/* 5. Ainda tem dúvidas (Fale conosco) */}
        <section id="fale-conosco" className={estilos.secaoCentral} aria-labelledby="titulo-duvidas">
          <div className={estilos.cabecalhoCentro}>
            <h2 id="titulo-duvidas" className={estilos.tituloSecao}>
              Ainda tem dúvidas?
            </h2>
            <p className={estilos.subtituloSecao}>Escreva para a equipe do Altterra.</p>
          </div>

          <div className={`${estilos.colunaLeitura} ${estilos.cardContato}`}>
            <div className={estilos.cabecalhoContato}>
              <h3 className={estilos.tituloContato}>Fale conosco</h3>
              <p className={estilos.textoPasso}>Dúvida, cadastro de instituição ou problema com pedido.</p>
            </div>

            {enviado && (
              <Aviso
                tipo="sucesso"
                titulo="Mensagem enviada"
                descricao="Recebemos seu contato. Respondemos em até 2 dias úteis no e-mail informado."
                aoFechar={() => setEnviado(false)}
              />
            )}

            <form onSubmit={handleSubmit(enviarContato)} className={estilos.formContato} noValidate>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <CampoTexto
                  rotulo="Nome"
                  placeholder="Nome e sobrenome"
                  erro={errors.nome?.message}
                  {...register('nome')}
                />
                <CampoTexto
                  rotulo="E-mail"
                  type="email"
                  placeholder="nome@empresa.com.br"
                  erro={errors.email?.message}
                  {...register('email')}
                />
              </SimpleGrid>

              <CampoSelect
                rotulo="Assunto"
                placeholder="Escolha um assunto"
                opcoes={ASSUNTOS_CONTATO}
                erro={errors.assunto?.message}
                {...register('assunto')}
              />

              <CampoArea
                rotulo="Mensagem"
                placeholder="Conte o que você precisa"
                erro={errors.mensagem?.message}
                {...register('mensagem')}
              />

              <div className={estilos.rodapeContato}>
                <Botao tipo="submit" tamanho="md" iconeDireita="send">
                  Enviar mensagem
                </Botao>
                <span className={estilos.prazoContato}>Respondemos em até 2 dias úteis.</span>
              </div>
            </form>
          </div>
        </section>
      </div>
    </Pagina>
  );
}
