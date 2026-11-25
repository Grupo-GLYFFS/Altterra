import { CATEGORIAS } from '../../dados/categorias.js';
import { completarProduto } from '../catalogo.js';
import { apenasDigitos, lerNumero } from '../formatos.js';

export const ETAPAS_CADASTRO = [
  { id: 'produto', titulo: 'Produto', subtitulo: 'Nome e categoria', tituloPagina: 'Sobre o produto' },
  { id: 'preco', titulo: 'Preço e estoque', subtitulo: 'Faixas e mínimo', tituloPagina: 'Preço e estoque' },
  { id: 'fotos', titulo: 'Fotos', subtitulo: 'Capa e mais 4', tituloPagina: 'Fotos do lote' },
  { id: 'entrega', titulo: 'Entrega', subtitulo: 'Saída e frete', tituloPagina: 'Entrega' },
  { id: 'revisao', titulo: 'Revisão', subtitulo: 'Antes de publicar', tituloPagina: 'Revisão' },
];

export const OPCOES_UNIDADE = [
  { valor: 'kg', rotulo: 'kg' },
  { valor: 't', rotulo: 't' },
  { valor: 'caixa', rotulo: 'caixa' },
  { valor: 'saco', rotulo: 'saco' },
  { valor: 'maço', rotulo: 'maço' },
];

export const OPCOES_CULTIVO = [
  { valor: 'convencional', rotulo: 'Convencional', descricao: 'Sem selo' },
  { valor: 'organico', rotulo: 'Orgânico', descricao: 'Mostra o selo Orgânico' },
  { valor: 'hidroponico', rotulo: 'Hidropônico', descricao: 'Aparece na ficha técnica' },
];

export const OPCOES_CALIBRE = [
  { valor: '', rotulo: 'Não informado' },
  { valor: '3A', rotulo: '3A' },
  { valor: '2A', rotulo: '2A' },
  { valor: '1A', rotulo: '1A' },
  { valor: 'Graúdo', rotulo: 'Graúdo' },
  { valor: 'Médio', rotulo: 'Médio' },
  { valor: 'Pequeno', rotulo: 'Pequeno' },
  { valor: 'Fora do padrão de tamanho', rotulo: 'Fora do padrão de tamanho' },
  { valor: 'Fora do padrão de cor', rotulo: 'Fora do padrão de cor' },
];

export const CHAVE_RASCUNHO = 'rascunho-anuncio';
export const MAX_FOTOS = 5;
export const MAX_FAIXAS = 5;

// Formata um número decimal para exibir em campo de preço ("3.6" -> "3,60").
export function formatarCampoPreco(valor) {
  const num = Number(valor);
  if (!num && num !== 0) return '';
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Cria o estado inicial vazio do formulário de anúncio, usando o endereço principal do fornecedor.
export function criarEstadoInicial(usuario) {
  const enderecoPrincipal =
    usuario?.enderecos?.find((e) => e.principal) || usuario?.enderecos?.[0] || null;

  return {
    categoriaId: '',
    tipoProduto: '',
    variedade: '',
    nome: '',
    descricao: '',
    modoCultivo: 'convencional',
    umidade: '',
    avarias: '',
    calibre: '',
    unidade: 'kg',
    faixas: [
      { minimo: '50', preco: '' },
      { minimo: '200', preco: '' },
    ],
    estoque: '',
    pedidoMinimo: '50',
    outlet: false,
    descontoPercentual: '20',
    fotos: [],
    enderecoId: enderecoPrincipal?.id || 'outro',
    cep: enderecoPrincipal?.cep || '',
    rua: enderecoPrincipal?.rua || '',
    numero: enderecoPrincipal?.numero || '',
    complemento: enderecoPrincipal?.complemento || '',
    bairro: enderecoPrincipal?.bairro || '',
    cidade: enderecoPrincipal?.cidade || '',
    uf: enderecoPrincipal?.uf || '',
    entregaPropria: true,
    raioKm: '150',
    prazoDias: '2 a 4',
    fretePorKm: '0,40',
    retiradaLocal: true,
    horarioRetirada: 'Seg. a sáb., das 6h às 14h',
  };
}

// Converte um produto já cadastrado para o estado editável do formulário.
export function produtoParaFormulario(produto, usuario) {
  const base = criarEstadoInicial(usuario);
  if (!produto) return base;

  const modoCultivo = produto.organico
    ? 'organico'
    : produto.modoCultivo || (String(produto.cultivo || '').toLowerCase().includes('hidrop') ? 'hidroponico' : 'convencional');

  const faixas =
    produto.faixas && produto.faixas.length > 0
      ? produto.faixas.map((f) => ({
          minimo: String(f.minimo),
          preco: formatarCampoPreco(f.preco),
        }))
      : base.faixas;

  const fotos =
    produto.imagens && produto.imagens.length > 0
      ? [...produto.imagens]
      : produto.imagem
        ? [produto.imagem]
        : [];

  return {
    ...base,
    categoriaId: produto.categoriaId || '',
    tipoProduto: produto.tipoProduto || produto.nome.split(' ')[0] || '',
    variedade: produto.variedade || '',
    nome: produto.nome || '',
    descricao: produto.descricao || '',
    modoCultivo,
    umidade: produto.umidade ? String(produto.umidade) : '',
    avarias: produto.avarias ? String(produto.avarias) : '',
    calibre: produto.calibre || '',
    unidade: produto.unidade || 'kg',
    faixas,
    estoque: String(produto.estoque ?? ''),
    pedidoMinimo: String(produto.pedidoMinimo || faixas[0]?.minimo || '50'),
    outlet: Boolean(produto.outlet),
    descontoPercentual: produto.descontoPercentual ? String(produto.descontoPercentual) : '20',
    fotos,
    enderecoId: produto.enderecoSaidaId || base.enderecoId,
    cep: produto.cepSaida || base.cep,
    cidade: produto.cidadeSaida || base.cidade,
    uf: produto.ufSaida || base.uf,
    entregaPropria: produto.entregaPropria ?? true,
    raioKm: produto.raioKm ? String(produto.raioKm) : base.raioKm,
    prazoDias: produto.prazoDias ? String(produto.prazoDias) : base.prazoDias,
    fretePorKm: produto.fretePorKm ? formatarCampoPreco(produto.fretePorKm) : base.fretePorKm,
    retiradaLocal: produto.retiradaLocal ?? true,
    horarioRetirada: produto.horarioRetirada || base.horarioRetirada,
  };
}

// Converte as faixas digitadas em objetos numéricos ordenados para cálculo e salvamento.
export function normalizarFaixas(faixasFormulario = []) {
  return faixasFormulario
    .map((f) => ({
      minimo: Math.max(1, Math.round(lerNumero(f.minimo))),
      preco: Math.round(lerNumero(f.preco) * 100) / 100,
    }))
    .filter((f) => f.minimo > 0 && f.preco > 0)
    .sort((a, b) => a.minimo - b.minimo);
}

// Monta o objeto de produto pronto para salvar no contexto ou exibir na prévia do card K4.
export function montarProdutoDoFormulario(dados, usuario, produtoOriginal = null) {
  const categoriaObj = CATEGORIAS.find((c) => c.id === dados.categoriaId);
  const faixasValidas = normalizarFaixas(dados.faixas);
  const pedidoMinimo = Math.max(1, Math.round(lerNumero(dados.pedidoMinimo))) || faixasValidas[0]?.minimo || 1;
  const faixasFinais =
    faixasValidas.length > 0 ? faixasValidas : [{ minimo: pedidoMinimo, preco: 0 }];

  const enderecoSelecionado =
    usuario?.enderecos?.find((e) => e.id === dados.enderecoId) || null;
  const cidadeSaida = enderecoSelecionado?.cidade || dados.cidade || '';
  const ufSaida = enderecoSelecionado?.uf || dados.uf || '';
  const cepSaida = enderecoSelecionado?.cep || dados.cep || '';

  const fornecedorPadrao = usuario?.fornecedor || {
    id: usuario?.fornecedorId || 'fornecedor-local',
    nome: usuario?.empresa || usuario?.nome || 'Seu negócio',
    tipo: usuario?.tipoNegocio || 'Fornecedor',
    cidade: cidadeSaida && ufSaida ? `${cidadeSaida} - ${ufSaida}` : 'São Paulo - SP',
    logo: '',
    verificado: false,
  };

  const rotuloCultivo =
    OPCOES_CULTIVO.find((c) => c.valor === dados.modoCultivo)?.rotulo || 'Convencional';

  const bruto = {
    ...(produtoOriginal || {}),
    nome: dados.nome.trim() || 'Nome do produto',
    tipoProduto: dados.tipoProduto.trim(),
    categoriaId: dados.categoriaId || 'legumes',
    categoria: categoriaObj?.nome || produtoOriginal?.categoria || 'Legumes',
    variedade: dados.variedade.trim(),
    descricao: dados.descricao.trim(),
    modoCultivo: dados.modoCultivo,
    cultivo: rotuloCultivo,
    organico: dados.modoCultivo === 'organico',
    umidade: dados.umidade.trim(),
    avarias: dados.avarias.trim(),
    calibre: dados.calibre.trim(),
    unidade: dados.unidade || 'kg',
    faixas: faixasFinais,
    estoque: Math.max(0, Math.round(lerNumero(dados.estoque))),
    pedidoMinimo,
    outlet: Boolean(dados.outlet),
    descontoPercentual: dados.outlet
      ? Math.min(90, Math.max(5, Math.round(lerNumero(dados.descontoPercentual)) || 20))
      : 0,
    imagem: dados.fotos[0] || '',
    imagens: [...dados.fotos],
    fornecedor: produtoOriginal?.fornecedor || fornecedorPadrao,
    fornecedorId: produtoOriginal?.fornecedorId || fornecedorPadrao.id,
    enderecoSaidaId: dados.enderecoId,
    cepSaida,
    cidadeSaida,
    ufSaida,
    entregaPropria: Boolean(dados.entregaPropria),
    raioKm: Math.max(0, Math.round(lerNumero(dados.raioKm))),
    prazoDias: dados.prazoDias.trim(),
    fretePorKm: Math.round(lerNumero(dados.fretePorKm) * 100) / 100,
    retiradaLocal: Boolean(dados.retiradaLocal),
    horarioRetirada: dados.horarioRetirada.trim(),
  };

  return completarProduto(bruto);
}

// Valida os campos obrigatórios de uma etapa específica; devolve um mapa { campo: mensagem }.
export function validarEtapa(idEtapa, dados) {
  const erros = {};

  if (idEtapa === 'produto') {
    if (!dados.categoriaId) erros.categoriaId = 'Escolha a categoria do produto.';
    if (!dados.nome.trim() || dados.nome.trim().length < 3) {
      erros.nome = 'Digite um título com pelo menos 3 caracteres.';
    }
    if (dados.descricao.length > 600) {
      erros.descricao = 'Use até 600 caracteres na descrição.';
    }
  }

  if (idEtapa === 'preco') {
    const estoqueNum = lerNumero(dados.estoque);
    const minimoNum = lerNumero(dados.pedidoMinimo);
    if (dados.estoque === '' || estoqueNum < 0) {
      erros.estoque = 'Digite a quantidade disponível em estoque.';
    }
    if (!dados.pedidoMinimo || minimoNum < 1) {
      erros.pedidoMinimo = 'Informe o pedido mínimo (pelo menos 1).';
    }

    const faixasErros = [];
    let temFaixaValida = false;
    dados.faixas.forEach((faixa, indice) => {
      const erroFaixa = {};
      const min = lerNumero(faixa.minimo);
      const preco = lerNumero(faixa.preco);
      if (min <= 0) erroFaixa.minimo = 'Digite a quantidade inicial.';
      if (preco <= 0) erroFaixa.preco = 'Digite o preço por unidade.';
      if (indice > 0) {
        const minAnterior = lerNumero(dados.faixas[indice - 1].minimo);
        if (min <= minAnterior) {
          erroFaixa.minimo = `Precisa ser maior que ${minAnterior}.`;
        }
      }
      if (min > 0 && preco > 0 && !erroFaixa.minimo) temFaixaValida = true;
      faixasErros[indice] = erroFaixa;
    });

    if (faixasErros.some((e) => Object.keys(e).length > 0)) {
      erros.faixas = faixasErros;
    }
    if (!temFaixaValida) {
      erros.faixasGeral = 'Preencha pelo menos uma faixa de preço válida.';
    }
    if (dados.outlet) {
      const desc = lerNumero(dados.descontoPercentual);
      if (desc < 5 || desc > 90) {
        erros.descontoPercentual = 'Use um desconto entre 5% e 90%.';
      }
    }
  }

  if (idEtapa === 'entrega') {
    if (dados.enderecoId === 'outro') {
      if (apenasDigitos(dados.cep).length !== 8) erros.cep = 'Digite o CEP com 8 números.';
      if (!dados.cidade.trim()) erros.cidade = 'Digite a cidade de saída.';
      if (dados.uf.trim().length !== 2) erros.uf = 'Use a sigla do estado (ex.: SP).';
    }
    if (!dados.entregaPropria && !dados.retiradaLocal) {
      erros.entrega = 'Ative pelo menos uma opção: entrega própria ou retirada no local.';
    }
    if (dados.entregaPropria && !dados.prazoDias.trim()) {
      erros.prazoDias = 'Informe o prazo de entrega (ex.: 2 a 4).';
    }
    if (dados.retiradaLocal && !dados.horarioRetirada.trim()) {
      erros.horarioRetirada = 'Informe o horário de retirada.';
    }
  }

  return erros;
}

// Compara o formulário atual com o estado inicial do anúncio em edição para marcar o que mudou.
export function mapearAlteracoes(atual, inicial) {
  if (!inicial) return {};
  const alteracoes = {};
  const chaves = [
    'nome',
    'categoriaId',
    'variedade',
    'modoCultivo',
    'descricao',
    'estoque',
    'pedidoMinimo',
    'outlet',
    'descontoPercentual',
    'unidade',
    'enderecoId',
    'cep',
    'entregaPropria',
    'raioKm',
    'prazoDias',
    'retiradaLocal',
    'horarioRetirada',
  ];

  chaves.forEach((chave) => {
    if (String(atual[chave] ?? '') !== String(inicial[chave] ?? '')) {
      alteracoes[chave] = true;
    }
  });

  alteracoes.fotos = JSON.stringify(atual.fotos) !== JSON.stringify(inicial.fotos);
  alteracoes.faixas = atual.faixas.map((faixa, indice) => {
    const antiga = inicial.faixas[indice];
    if (!antiga) return true;
    return antiga.minimo !== faixa.minimo || antiga.preco !== faixa.preco;
  });

  return alteracoes;
}
