# Altterra

Marketplace B2B de alimentos direto do produtor para mercados, restaurantes, cozinhas industriais e distribuidores. O projeto se organiza em três pilares alinhados ao ODS 2 (Fome Zero e Agricultura Sustentável):

- **Marketplace Direto:** compra em atacado direto de produtores, cooperativas e distribuidores, com faixas de preço por volume.
- **Outlet Sustentável:** lotes fora do padrão visual (tamanho ou cor) vendidos com desconto para evitar descarte.
- **Safra que Alimenta:** doação de excedentes da colheita para instituições cadastradas, com acompanhamento no perfil do fornecedor.

## Links

- Site: https://grupo-glyffs.github.io/Altterra/
- Vídeo de apresentação: `[LINK DO VÍDEO]`

## Como rodar localmente

```bash
npm install
npm run dev
```

### Contas de teste

O login é local (sem backend):

- **Compradora:** já vem preenchida na tela de entrar (`compras@mercadosaojorge.com.br` / `altterra123`).
- **Fornecedor:** `contato@valeverde.coop.br` / `altterra123`.

## Stack

- React + Vite
- React Router (`HashRouter`)
- Mantine
- React Hook Form + yup
- ViaCEP (preenchimento automático de endereço por CEP)
- `localStorage` (persistência local de sessão, anúncios, carrinho, favoritos, pedidos e doações)

## Grupo GLYFFS

- Gabriel de Lucca Chiapetta Santana (RM573610)
- Leonardo de Lima Dias (RM569286)
- Fabricio Cardoso Nicoli (RM571627)
- Felipe Santos (RM574050)
- Samuel Almeida Santos (RM572554)

## Uso de IA

Usamos IA (Claude, Gemini e ElevenLabs) como apoio no design, no código e na voz do vídeo.
