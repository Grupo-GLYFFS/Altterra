// Extraído de renderNavbar() em js/components.js (projeto original).
// O CategoriesPanel.jsx anterior só renderizava o grupo "Frutas" fixo com
// 3 itens hardcoded — faltavam os outros 8 grupos inteiros.
export const categories = [
  { name: 'Frutas', items: ['Maçã', 'Mamão', 'Laranja', 'Uva', 'Manga', 'Pera', 'Abacaxi', 'Cereja', 'Melancia', 'Kiwi', 'Pêssego', 'Ameixa', 'Framboesa', 'Morango', 'Coco', 'Banana', 'Limão'] },
  { name: 'Verduras e folhas', items: ['Alface', 'Espinafre', 'Rúcula', 'Couve', 'Brócolis', 'Repolho', 'Acelga', 'Agrião'] },
  { name: 'Legumes', items: ['Abóbora', 'Abobrinha', 'Berinjela', 'Chuchu', 'Pepino', 'Pimentão', 'Quiabo', 'Tomate'] },
  { name: 'Ervas', items: ['Alecrim', 'Cebolinha', 'Coentro', 'Hortelã', 'Manjericão', 'Orégano', 'Salsa', 'Sálvia'] },
  { name: 'Tubérculos e raízes', items: ['Batata', 'Batata-doce', 'Beterraba', 'Cenoura', 'Inhame', 'Mandioca', 'Nabo', 'Rabanete'] },
  { name: 'Bulbos', items: ['Alho', 'Alho-poró', 'Cebola', 'Cebola roxa', 'Chalota', 'Funcho', 'Cebola pérola', 'Alho-nirá'] },
  { name: 'Grãos e cereais', items: ['Arroz', 'Aveia', 'Centeio', 'Cevada', 'Milho', 'Quinoa', 'Sorgo', 'Trigo'] },
  { name: 'Leguminosas', items: ['Amendoim', 'Ervilha', 'Fava', 'Feijão', 'Grão-de-bico', 'Lentilha', 'Soja', 'Tremoço'] },
  { name: 'Sementes e mudas', items: ['S. Linhaça', 'S. Chia', 'S. Girassol', 'S. Abóbora', 'S. Gergelim', 'Muda Tomate', 'Muda Alface', 'Muda Pimenta'] },
]

// Extraído de #location-popup em js/components.js.
export const locationCities = [
  'São Paulo - SP',
  'Rio de Janeiro - RJ',
  'Belo Horizonte - MG',
  'Curitiba - PR',
  'Porto Alegre - RS',
  'Florianópolis - SC',
  'Salvador - BA',
  'Recife - PE',
  'Fortaleza - CE',
  'Goiânia - GO',
  'Brasília - DF',
]
