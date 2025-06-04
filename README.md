# Lista Telefônica - CRUD com Node.js, Express e MongoDB

Uma aplicação completa de lista telefônica com operações CRUD (Create, Read, Update, Delete), construída com Node.js, Express e MongoDB, incluindo uma interface web responsiva.

## Recursos

- API RESTful com Node.js e Express
- Banco de dados MongoDB para armazenamento de dados
- Interface web responsiva com Bootstrap 5
- Operações CRUD completas (Criar, Ler, Atualizar, Excluir)
- Busca de contatos pelo nome ou telefone
- Docker para fácil instalação e execução
- Design responsivo que funciona em dispositivos móveis e desktop

## Estrutura do Projeto

```
lista-telefonica/
├── config/
├── public/                   # Arquivos da interface web
│   ├── css/
│   │   └── styles.css        # Estilos customizados
│   ├── js/
│   │   └── app.js            # JavaScript da aplicação
│   └── index.html            # Página principal
├── src/
│   ├── controllers/
│   │   └── contactController.js
│   ├── models/
│   │   └── contactModel.js
│   ├── routes/
│   │   └── contactRoutes.js
│   ├── utils/
│   │   └── seed.js           # Utilitário para popular o banco
│   └── server.js
├── .dockerignore
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

## Pré-requisitos

- Docker e Docker Compose

## Instalação e Execução

1. Clone o repositório:
   ```
   git clone <url-do-repositorio>
   cd lista-telefonica
   ```

2. Crie o arquivo .env baseado no .env.example:
   ```
   cp .env.example .env
   ```

3. Execute a aplicação com Docker Compose:
   ```
   docker-compose up
   ```

   A aplicação estará disponível em: http://localhost:3000

4. (Opcional) Popular o banco de dados com dados iniciais:
   ```
   docker-compose exec app npm run seed
   ```

## Interface Web

A aplicação inclui uma interface web completa com:

- Lista de contatos em formato de tabela
- Formulário para adicionar novos contatos
- Opções para editar e excluir contatos
- Campo de busca para filtrar contatos
- Mensagens de feedback para o usuário
- Design responsivo (funciona em celulares e desktops)

## Endpoints da API

- `GET /api/contacts` - Listar todos os contatos
  - Query Params:
    - `search`: Buscar contatos por nome ou telefone

- `GET /api/contacts/:id` - Obter um contato específico

- `POST /api/contacts` - Criar um novo contato
  - Body:
    ```json
    {
      "name": "Nome Completo",
      "phone": "31999999999",
      "email": "email@example.com",
      "address": "Rua Exemplo, 123",
      "notes": "Observações sobre o contato"
    }
    ```

- `PUT /api/contacts/:id` - Atualizar um contato

- `DELETE /api/contacts/:id` - Remover um contato

## Exemplos de Uso da API

### Criar um contato

```bash
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "phone": "31987654321",
    "email": "joao@example.com",
    "address": "Av. Brasil, 100",
    "notes": "Contato de trabalho"
  }'
```

### Buscar contatos

```bash
curl -X GET "http://localhost:3000/api/contacts?search=João"
```

## Desenvolvimento

Para desenvolvimento sem Docker:

1. Instale as dependências:
   ```
   npm install
   ```

2. Execute o servidor em modo de desenvolvimento:
   ```
   npm run dev
   ```

3. Popular o banco de dados com dados iniciais:
   ```
   npm run seed
   ```

## Tecnologias Utilizadas

- **Backend**: Node.js, Express.js, Mongoose
- **Banco de dados**: MongoDB
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Containerização**: Docker, Docker Compose

## Licença

MIT 