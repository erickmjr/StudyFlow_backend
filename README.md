# StudyFlow API

Documentação da API do StudyFlow, com endpoints, autenticação e configuração local.

**Base URL**
`/api`

Exemplo local:
`http://localhost:3000/api`

**Autenticação**
Esta API usa JWT, mas o token de sessão não é enviado via `Authorization: Bearer ...`.
Em vez disso, no `login`/`register` a API faz `Set-Cookie` de um cookie chamado `token` com as flags:
- `HttpOnly` 
- `SameSite=Lax`
- `Secure` apenas em produção (`NODE_ENV=production`)
- `Max-Age` de 2 horas

Para consumir no browser, o frontend precisa enviar cookies nas requisições:
- `fetch(..., { credentials: 'include' })`
- `axios` com `withCredentials: true`

**Rodar localmente**
```bash
npm install
npm run start:dev
```

**Modelos**
`User` (retornado em alguns endpoints):
- `id` (number)
- `name` (string)
- `email` (string)
- `type` (string)
- `createdAt` (string ISO)
- `password` (string hash, pode aparecer em endpoints administrativos ou conforme implementação atual)

`Topic`:
- `id` (number)
- `createdAt` (string ISO)
- `title` (string)
- `description` (string | null)
- `dueDate` (string ISO | null)
- `updatedAt` (string ISO)
- `done` (boolean)
- `userId` (number)

**Endpoints**

**POST /api/user/auth/register**
Cria usuário e autentica a sessão setando o cookie `token` (HttpOnly).

Request JSON:
```json
{
  "email": "user@email.com",
  "password": "12345678",
  "name": "User Name"
}
```

Responses:
- `201` seta cookie `token` e retorna `{ user: { id, name } }`
- `400` senha menor que 8 caracteres
- `409` email já usado
- `500` erro interno

**POST /api/user/auth/login**
Autentica usuário e seta o cookie `token` (HttpOnly).

Request JSON:
```json
{
  "email": "user@email.com",
  "password": "12345678"
}
```

Responses:
- `200` seta cookie `token` e retorna `{ user: { sub, email, name } }`
- `401` credenciais inválidas
- `500` erro interno

**POST /api/user/forgot-password**
Inicia o fluxo de recuperação de senha.
Se o usuário existir, a API envia um e-mail com link de redefinição contendo um token JWT de curta duração.

Request JSON:
```json
{
  "email": "user@email.com"
}
```

Responses:
- `200` sempre retorna `{ message: "If the user exists, an e-mail was sent." }` para evitar enumeração de usuários
- `400` email ausente
- `500` erro interno

**POST /api/user/reset-password**
Conclui o fluxo de recuperação de senha, trocando a senha do usuário com base no token recebido por e-mail.

Request JSON:
```json
{
  "token": "jwt-reset-token",
  "newPassword": "12345678"
}
```

Responses:
- `200` sem corpo (ou corpo vazio)
- `400` token ausente, senha ausente, senha menor que 8 caracteres, purpose inválido ou subject inválido
- `401` token expirado ou JWT inválido
- `404` usuário não encontrado
- `500` erro interno

Fluxo esperado:
1. Cliente chama `POST /api/user/forgot-password` com o e-mail.
2. API envia e-mail com link no formato:
   `${BACKEND_URL}/reset-password?token=<jwt>`
3. Cliente extrai o token do link e envia para `POST /api/user/reset-password` junto com `newPassword`.
4. API valida token, prazo e usuário, e atualiza a senha.

**POST /api/user/edit-username**
Atualiza o `name` (username) do usuário autenticado.
Requer cookie `token` (HttpOnly).

Request JSON:
```json
{
  "username": "Novo Nome"
}
```

Responses:
- `200` retorna `{ user }` (usuário atualizado)
- `400` username ausente ou username com menos de 4 caracteres
- `401` token ausente ou inválido
- `500` erro interno

**GET /api/users**
Lista usuários. **Não possui middleware de autenticação** e valida `userType` no body.

Request JSON:
```json
{
  "userType": "admin"
}
```

Responses:
- `200` lista de usuários (inclui campo `password` hash e `type`)
- `204` sem usuários
- `403` permissão insuficiente
- `500` erro interno

Observação:
- Este endpoint usa body em GET, o que pode não ser suportado por alguns clientes.

**GET /api/topics**
Lista tópicos do usuário autenticado.
Requer cookie `token` (HttpOnly).

Responses:
- `200` retorna `{ topics, total }`
- `401` token ausente ou inválido
- `500` erro interno

**GET /api/topics/:id**
Busca tópico por ID do usuário autenticado.
Requer cookie `token` (HttpOnly).

Responses:
- `200` retorna `{ topic }`
- `400` ID inválido
- `204` tópico não encontrado
- `401` token ausente ou inválido
- `500` erro interno

**POST /api/topics**
Cria tópico.
Requer cookie `token` (HttpOnly).

Request JSON:
```json
{
  "title": "Estudar Node",
  "description": "Revisar Express e Prisma",
  "rawDueDate": "2026-02-20T18:00:00.000Z"
}
```

Responses:
- `201` retorna `{ createdTopic }`
- `400` campos ausentes ou data inválida
- `401` token ausente ou inválido
- `500` erro interno

**PUT /api/topics/:id**
Atualiza tópico completo.
Requer cookie `token` (HttpOnly).

Request JSON:
```json
{
  "title": "Estudar Node",
  "description": "Revisar Express e Prisma",
  "dueDate": "2026-02-20T18:00:00.000Z",
  "done": false
}
```

Responses:
- `200` retorna `{ topicUpdated }`
- `400` payload incompleto, `done` inválido ou `dueDate` inválido
- `404` tópico não encontrado
- `401` token ausente ou inválido
- `500` erro interno

**PATCH /api/topics/:id**
Atualiza campos parciais do tópico.
Requer cookie `token` (HttpOnly).

Request JSON (qualquer combinação):
```json
{
  "title": "Novo titulo",
  "done": true
}
```

Responses:
- `200` retorna `{ updatedTopic }`
- `400` nenhum campo válido informado
- `204` tópico não encontrado
- `401` token ausente ou inválido
- `500` erro interno

**DELETE /api/topics/:id**
Remove tópico.
Requer cookie `token` (HttpOnly).

Responses:
- `200` retorna o objeto do service (status/body) conforme implementação atual
- `404` tópico não encontrado
- `401` token ausente ou inválido
- `500` erro interno

Observação:
- O retorno do DELETE atualmente não devolve diretamente o tópico removido. Se quiser, posso ajustar a implementação e atualizar a doc.

**Exemplos rápidos (curl)**

Registro:
```bash
curl -i -X POST http://localhost:3000/api/user/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"user@email.com","password":"12345678","name":"User Name"}'
```

Login:
```bash
curl -i -X POST http://localhost:3000/api/user/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"user@email.com","password":"12345678"}'
```

Editar username:
```bash
curl -X POST http://localhost:3000/api/user/edit-username \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"username":"Novo Nome"}'
```

Solicitar recuperação de senha:
```bash
curl -X POST http://localhost:3000/api/user/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@email.com"}'
```

Redefinir senha:
```bash
curl -X POST http://localhost:3000/api/user/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"<jwt-reset-token>","newPassword":"novaSenha123"}'
```

Criar tópico:
```bash
curl -X POST http://localhost:3000/api/topics \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Estudar Node","description":"Revisar Express e Prisma","rawDueDate":"2026-02-20T18:00:00.000Z"}'
```
