// Comprador fixo usado enquanto não existe autenticação no projeto.
// Serve para sustentar a relação User --> Order do diagrama de classes:
// todo pedido criado registra quem o realizou, mesmo que hoje seja
// sempre o mesmo usuário. Quando o login for implementado (fase futura),
// basta trocar esta constante pelo usuário da sessão — o resto do código
// que consome `user` continua igual.
export const currentUser = {
  id: 'user-demo',
  nome: 'Distribuidora São João',
  email: 'compras@saojoao.com.br',
}