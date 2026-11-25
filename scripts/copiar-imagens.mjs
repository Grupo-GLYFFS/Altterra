import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const EXTENSOES_ACEITAS = new Set(['.webp', '.jpg', '.jpeg', '.png']);

const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));
const raizProjeto = path.resolve(diretorioAtual, '..');
const pastaOrigem = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(raizProjeto, '..', 'imagens-novas');
const pastaDestino = path.resolve(raizProjeto, 'public', 'img');

// Copia imagens novas (.webp, .jpg e .png) de imagens-novas/ para public/img/, mantendo os nomes.
async function copiarImagens() {
  try {
    await fs.access(pastaOrigem);
  } catch {
    console.log(`Pasta de origem não encontrada: ${pastaOrigem}`);
    return;
  }

  await fs.mkdir(pastaDestino, { recursive: true });

  const entradas = await fs.readdir(pastaOrigem, { withFileTypes: true });
  const imagens = entradas.filter(
    (entrada) =>
      entrada.isFile() && EXTENSOES_ACEITAS.has(path.extname(entrada.name).toLowerCase())
  );

  if (imagens.length === 0) {
    console.log(`Nenhuma imagem (.webp, .jpg ou .png) encontrada em ${pastaOrigem}.`);
    return;
  }

  for (const entrada of imagens) {
    const origem = path.join(pastaOrigem, entrada.name);
    const destino = path.join(pastaDestino, entrada.name);
    await fs.copyFile(origem, destino);
    console.log(`Copiada: ${entrada.name}`);
  }

  console.log(`Total copiado: ${imagens.length} arquivo(s) para ${pastaDestino}.`);
}

copiarImagens().catch((erro) => {
  console.error('Erro ao copiar imagens:', erro.message);
  process.exitCode = 1;
});
