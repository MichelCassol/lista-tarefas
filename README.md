# Todo List - CRUD com Node.js, Express e MongoDB

Uma aplicação completa de lista de tarefas com operações CRUD (Create, Read, Update, Delete), construída com Node.js, Express e MongoDB, incluindo uma interface web responsiva.

## Recursos

- API RESTful com Node.js e Express
- Banco de dados MongoDB para armazenamento de dados
- Interface web responsiva com Bootstrap 5
- Operações CRUD completas (Criar, Ler, Atualizar, Excluir)
- Busca de tarefas pela descrição ou pela data de inicio
- Docker para fácil instalação e execução
- Design responsivo que funciona em dispositivos móveis e desktop

## Estrutura do Projeto

```
lista-tarefas/
├── config/
├── public/                   # Arquivos da interface web
│   ├── css/
│   │   └── styles.css        # Estilos customizados
│   ├── js/
│   │   └── app.js            # JavaScript da aplicação
│   └── index.html            # Página principal
├── src/
│   ├── controllers/
│   │   └── todoController.js
│   ├── models/
│   │   └── todoModel.js
│   ├── routes/
│   │   └── todoRoutes.js
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
   git clone https://github.com/MichelCassol/lista-tarefas.git
   cd lista-tarefas
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

## Interface Web

A aplicação inclui uma interface web completa com:

- Lista de tarefas em formato de tabela
- Formulário para adicionar novas tarefas
- Opções para editar e excluir tarefas
- Campo de busca para filtrar tarefas
- Mensagens de feedback para o usuário
- Design responsivo (funciona em celulares e desktops)

## Endpoints da API

- `GET /api/todos` - Listar todas as tarefas
  - Query Params:
    - `search`: Buscar tarefas pela descrição ou data de inicio

- `GET /api/todos/:id` - Obter uma tarefa específica

- `POST /api/todos` - Criar uma nova tarefa
  - Body:
    ```json
    {
      "tarefa": "descrição",
      "start_date": "2025-06-16",
      "end_date": "2025-06-20",
    }
    ```

- `PUT /api/todos/:id` - Atualizar uma tarefa

- `DELETE /api/todos/:id` - Remover uma tarefa

## Exemplos de Uso da API

### Criar uma tarefa

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "tarefa": "Descrição",
    "start_date": "2025-06-16",
    "end_date": "",
  }'
```

### Buscar tarefas

```bash
curl -X GET "http://localhost:3000/api/todo?search=Descrição"
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

## Tecnologias Utilizadas

- **Backend**: Node.js, Express.js, Mongoose
- **Banco de dados**: MongoDB
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Containerização**: Docker, Docker Compose
- **Teste unitários**: Jest

## Licença

MIT 