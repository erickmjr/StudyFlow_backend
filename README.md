# StudyFlow API

Documentação da API do StudyFlow, com endpoints, autenticação e configuração local.

**Base URL**
`/api`

Exemplo local:
`http://localhost:3000/api`

**Autenticação**
Alguns endpoints exigem JWT no header:
`Authorization: Bearer <token>`

O token é gerado nos endpoints de login/registro e expira em 2 horas.

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
- `password` (string hash, somente em listagem de usuários)

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
Cria usuário e retorna token.

Request JSON:
```json
{
  "email": "user@email.com",
  "password": "12345678",
  "name": "User Name"
}
```

Responses:
- `201` retorna `{ token, user: { id, name } }`
- `400` senha menor que 8 caracteres
- `409` email já usado
- `500` erro interno

**POST /api/user/auth/login**
Autentica usuário e retorna token.

Request JSON:
```json
{
  "email": "user@email.com",
  "password": "12345678"
}
```

Responses:
- `200` retorna `{ token, user: { sub, email, name } }`
- `401` credenciais inválidas
- `500` erro interno

**POST /api/user/forgot-password**
Envia email com link de redefinição se o usuário existir.

Request JSON:
```json
{
  "email": "user@email.com"
}
```

Responses:
- `200` sempre retorna `{ message: "If the user exists, an e-mail was sent." }`
- `400` email ausente
- `500` erro interno

**POST /api/user/reset-password**
Redefine a senha com token.

Request JSON:
```json
{
  "token": "jwt-reset-token",
  "newPassword": "12345678"
}
```

Responses:
- `200` sem corpo (ou corpo vazio)
- `400` token ou senha ausente, ou token inválido
- `401` token expirado ou inválido
- `404` usuário não encontrado
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

Headers:
`Authorization: Bearer <token>`

Responses:
- `200` retorna `{ topics, total }`
- `401` token ausente ou inválido
- `500` erro interno

**GET /api/topics/:id**
Busca tópico por ID do usuário autenticado.

Headers:
`Authorization: Bearer <token>`

Responses:
- `200` retorna `{ topic }`
- `400` ID inválido
- `204` tópico não encontrado
- `401` token ausente ou inválido
- `500` erro interno

**POST /api/topics**
Cria tópico.

Headers:
`Authorization: Bearer <token>`

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

Headers:
`Authorization: Bearer <token>`

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

Headers:
`Authorization: Bearer <token>`

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

Headers:
`Authorization: Bearer <token>`

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
curl -X POST http://localhost:3000/api/user/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@email.com","password":"12345678","name":"User Name"}'
```

Login:
```bash
curl -X POST http://localhost:3000/api/user/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@email.com","password":"12345678"}'
```

Criar tópico:
```bash
curl -X POST http://localhost:3000/api/topics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Estudar Node","description":"Revisar Express e Prisma","rawDueDate":"2026-02-20T18:00:00.000Z"}'
```
