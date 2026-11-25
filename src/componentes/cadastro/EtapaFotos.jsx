import { useRef, useState } from 'react';
import { MAX_FOTOS } from '../../logica/cadastro/anuncio.js';
import { comprimirImagem } from '../../logica/cadastro/comprimirImagem.js';
import { Aviso } from '../Aviso.jsx';
import { Botao } from '../Botao.jsx';
import { BlocoFormulario } from '../Campo.jsx';
import { Icone } from '../Icone.jsx';
import { Selo } from '../Selo.jsx';
import estilos from './EtapaFotos.module.css';

// Etapa 3 do cadastro: Dropzone e galeria de até 5 fotos (capa + 4) com compressão no navegador.
export function EtapaFotos({ fotos = [], aoAlterarFotos }) {
  const inputRef = useRef(null);
  const [arrastando, setArrastando] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [erroUpload, setErroUpload] = useState('');

  // Comprime e adiciona os arquivos escolhidos respeitando o limite de 5 fotos.
  async function processarArquivos(listaArquivos) {
    const arquivos = Array.from(listaArquivos || []);
    if (arquivos.length === 0) return;

    const vagas = MAX_FOTOS - fotos.length;
    if (vagas <= 0) {
      setErroUpload(`Você já enviou o limite de ${MAX_FOTOS} fotos.`);
      return;
    }

    setErroUpload('');
    setProcessando(true);

    const selecionados = arquivos.slice(0, vagas);
    const novas = [];
    let primeiroErro = '';

    for (const arquivo of selecionados) {
      try {
        const dataUrl = await comprimirImagem(arquivo);
        novas.push(dataUrl);
      } catch (erro) {
        if (!primeiroErro) primeiroErro = erro.message;
      }
    }

    if (novas.length > 0) {
      aoAlterarFotos([...fotos, ...novas]);
    }
    if (primeiroErro) {
      setErroUpload(primeiroErro);
    }
    setProcessando(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  // Move uma foto para a primeira posição (capa do anúncio).
  function definirComoCapa(indice) {
    if (indice <= 0 || indice >= fotos.length) return;
    const escolhida = fotos[indice];
    const restantes = fotos.filter((_, i) => i !== indice);
    aoAlterarFotos([escolhida, ...restantes]);
  }

  // Troca a posição de uma foto com a vizinha (esquerda ou direita).
  function moverFoto(indice, deslocamento) {
    const destino = indice + deslocamento;
    if (destino < 0 || destino >= fotos.length) return;
    const copia = [...fotos];
    [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
    aoAlterarFotos(copia);
  }

  // Remove a foto pelo índice.
  function removerFoto(indice) {
    aoAlterarFotos(fotos.filter((_, i) => i !== indice));
  }

  // Trata o evento de soltar arquivos sobre a área de envio.
  function aoSoltar(evento) {
    evento.preventDefault();
    setArrastando(false);
    processarArquivos(evento.dataTransfer?.files);
  }

  const podeAdicionar = fotos.length < MAX_FOTOS;

  return (
    <BlocoFormulario
      titulo="Fotos"
      descricao="A primeira é a capa e aparece no card da busca. Envie até 5 fotos do lote."
    >
      {erroUpload && (
        <Aviso tipo="erro" descricao={erroUpload} aoFechar={() => setErroUpload('')} />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="somenteLeitor"
        aria-label="Selecionar fotos do produto"
        onChange={(e) => processarArquivos(e.target.files)}
      />

      {podeAdicionar && (
        <div
          className={`${estilos.dropzone} ${arrastando ? estilos.dropzoneAtivo : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setArrastando(true);
          }}
          onDragLeave={() => setArrastando(false)}
          onDrop={aoSoltar}
        >
          <span className={estilos.iconeDropzone} aria-hidden="true">
            <Icone nome="add_photo_alternate" tamanho={32} />
          </span>
          <div className={estilos.textosDropzone}>
            <p className={estilos.tituloDropzone}>
              {processando ? 'Comprimindo fotos…' : 'Arraste as fotos aqui ou escolha do aparelho'}
            </p>
            <p className={estilos.dicaDropzone}>
              JPG, PNG ou WebP. As fotos são reduzidas no navegador para carregar rápido.
            </p>
          </div>
          <Botao
            variante="secundario"
            tamanho="sm"
            iconeEsquerda="upload"
            carregando={processando}
            textoCarregando="Enviando…"
            onClick={() => inputRef.current?.click()}
          >
            Escolher fotos
          </Botao>
        </div>
      )}

      {fotos.length > 0 && (
        <div className={estilos.grade}>
          {fotos.map((src, indice) => (
            <figure
              key={`${indice}-${src.slice(0, 24)}`}
              className={`${estilos.item} ${indice === 0 ? estilos.capa : ''}`}
            >
              <img
                src={src}
                alt={indice === 0 ? 'Foto de capa do anúncio' : `Foto ${indice + 1} do anúncio`}
                className={estilos.imagem}
              />

              {indice === 0 && (
                <div className={estilos.seloCapa}>
                  <Selo variante="neutro" tamanho="sm" icone="">
                    Capa
                  </Selo>
                </div>
              )}

              <div className={estilos.acoesFoto}>
                {indice > 0 && (
                  <Botao
                    variante="icone"
                    tamanho="sm"
                    sobreFoto
                    iconeEsquerda="star"
                    aria-label={`Definir foto ${indice + 1} como capa`}
                    onClick={() => definirComoCapa(indice)}
                  />
                )}
                {indice > 0 && (
                  <Botao
                    variante="icone"
                    tamanho="sm"
                    sobreFoto
                    iconeEsquerda="arrow_back"
                    aria-label={`Mover foto ${indice + 1} para antes`}
                    onClick={() => moverFoto(indice, -1)}
                  />
                )}
                {indice < fotos.length - 1 && (
                  <Botao
                    variante="icone"
                    tamanho="sm"
                    sobreFoto
                    iconeEsquerda="arrow_forward"
                    aria-label={`Mover foto ${indice + 1} para depois`}
                    onClick={() => moverFoto(indice, 1)}
                  />
                )}
                <Botao
                  variante="icone"
                  tamanho="sm"
                  sobreFoto
                  iconeEsquerda="delete"
                  aria-label={`Remover foto ${indice + 1}`}
                  onClick={() => removerFoto(indice)}
                />
              </div>
            </figure>
          ))}
        </div>
      )}

      <p className={estilos.rodape} aria-live="polite">
        {fotos.length === 0
          ? 'Nenhuma foto enviada ainda. Você pode publicar sem foto e adicionar depois.'
          : `${fotos.length} de ${MAX_FOTOS} fotos. A primeira é a capa; use as setas ou a estrela para mudar a ordem.`}
      </p>
    </BlocoFormulario>
  );
}
