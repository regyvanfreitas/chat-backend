# Chat Backend API

Uma API REST robusta para aplicações de chat em tempo real, construída com NestJS, Prisma e Socket.IO.

## 🚀 Funcionalidades

- **Autenticação JWT**: Sistema de registro e login seguro
- **Chat em Tempo Real**: Mensagens instantâneas via WebSockets (Socket.IO)
- **Gerenciamento de Usuários**: CRUD completo de usuários com proteção de dados
- **Sistema de Chat**: Criação automática ou reutilização de chats existentes
- **Mensagens**: Envio e recebimento de mensagens com histórico completo
- **Validação de Dados**: Validação robusta com class-validator
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Segurança**: Hash de senhas com bcrypt e autenticação JWT

## 🛠️ Tecnologias

- **Framework**: [NestJS](https://nestjs.com/) v11.x
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/) v6.x
- **WebSockets**: [Socket.IO](https://socket.io/)
- **Autenticação**: JWT (JSON Web Tokens)
- **Validação**: class-validator & class-transformer
- **Criptografia**: bcrypt

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18.x ou superior)
- [PostgreSQL](https://www.postgresql.org/) (versão 12.x ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## ⚙️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/regyvanfreitas/chat-backend.git
cd chat-backend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/chatdb?schema=public"
JWT_SECRET="seu_jwt_secret_super_seguro_aqui"
PORT=4000
```

### 4. Configurar banco de dados

```bash
# Executar migrações
npx prisma migrate dev

# (Opcional) Visualizar dados no Prisma Studio
npx prisma studio
```

## 🚀 Executar o projeto

```bash
# Desenvolvimento com watch mode
npm run start:dev

# Desenvolvimento
npm run start

# Produção
npm run start:prod

# Build
npm run build
```

## 📊 Estrutura do Banco de Dados

```sql
User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
}

Chat {
  id        Int      @id @default(autoincrement())
  title     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

Message {
  id        Int      @id @default(autoincrement())
  content   String
  chatId    Int
  authorId  Int
  createdAt DateTime @default(now())
}

Participant {
  id     Int @id @default(autoincrement())
  userId Int
  chatId Int
}
```

## 🔌 API Endpoints

### Autenticação

- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login do usuário

### Usuários

- `GET /users` - Listar usuários (autenticado)
- `GET /users/:id` - Buscar usuário por ID

### Chats

- `GET /chats` - Listar chats do usuário
- `POST /chats` - Criar novo chat
- `GET /chats/:id/participants` - Listar participantes do chat

### Mensagens

- `GET /chats/:id/messages` - Listar mensagens do chat
- `POST /chats/:id/messages` - Enviar mensagem

### WebSocket Events

- `join-chat` - Entrar em um chat
- `leave-chat` - Sair de um chat
- `message-created` - Receber nova mensagem

## 🔐 Segurança

- Senhas são hasheadas com bcrypt
- Autenticação via JWT tokens
- Validação de dados em todas as rotas
- Proteção contra exposição de senhas em responses
- Middleware de autenticação para rotas protegidas

## 🏗️ Arquitetura

```
src/
├── auth/           # Módulo de autenticação
├── users/          # Módulo de usuários
├── chats/          # Módulo de chats
├── messages/       # Módulo de mensagens
├── gateway/        # WebSocket gateway
├── prisma/         # Serviço do Prisma
└── main.ts         # Entry point da aplicação
```

## 👨‍💻 Autor

**Regivan Freitas**

- GitHub: [@regyvanfreitas](https://github.com/regyvanfreitas)
