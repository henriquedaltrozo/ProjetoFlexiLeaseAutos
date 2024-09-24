# Projeto Desafio Compacine API

FlexiLeaseAutos é uma API REST para a gestão de reservas de carros. Carros, usuários e reservas podem ser cadastrados, listados, modificados e deletados.

## 🛠️ Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **Mongoose**
- **MongoDB**
- **Swagger** 
- **Jest**

### Requisitos

- Node.js (versão 20.11.1)
- NPM (versão 6 ou superior)

## 📦 Configuração do Ambiente

### Arquivo `.env`

Apague `.example` do arquivo `.env.example` na raiz do projeto e adicione as seguintes variáveis de ambiente:

```
MONGODB_URI=
JWT_SECRET=
```
Exemplo de .env:
```
MONGODB_URI=mongodb+srv://henriquedaltrozo:7P0Ahd7s5sBfIppD@flexileaseautos-api.9lhdhb0.mongodb.net/?retryWrites=true&w=majority&appName=flexileaseautos-api
JWT_SECRET=eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyMDMxNTYzNiwiaWF0IjoxNzIwMzE1NjM2fQ
```

### Instalação

1. Clone o repositório:

   ```bash
   git clone https: https://github.com/henriquedaltrozo/ProjetoFlexiLeaseAutos.git
   ```
   
   ```bash
   cd ProjetoFlexiLeaseAutos
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor:
   ```bash
   npm run dev
   ```
   
4. Para testes:
   ```bash
   npm run test
   ```

A API estará disponível em `http://localhost:3000/api/v1`.

## 🎯 Endpoints da API

### Carros

| Método | URL         | Descrição                                                          |
| ------ | ----------- | -------------------------------------------------------------------|
| GET    | /car        | Listar carros: Retorna a lista de carros                           |
| GET    | /car/:id    | Buscar carros: Retorna as informações de um carro específico       |
| POST   | /car        | Cadastrar carro: Cria um novo filme                                |
| PUT    | /car/:id    | Atualizar carro: Atualiza as informações de um filme existente     |
| DELETE | /car/:id    | Excluir carro: Deleta um filme existente                           |
| PATCH  | /car/:id/accessories/:id | Modificar acessórios: Modifica acessórios de um carro |

### Usuários

| Método | URL                             | Descrição                                    |
| ------ | ------------------------------- | ---------------------------------------------|
| GET    | /user     | Listar usuários: Retorna a lista de usuários                       |
| GET    | /user/:id | Buscar usuário: Retorna as informações de um usuário específico    |
| POST   | /user     | Cadastrar usuário: Cria um novo usuário                            |
| PUT    | /user/:id | Atualizar usuário: Atualiza as informações de um usuário existente |
| DELETE | /user/:id | Excluir usuário: Exclui um usuário existente                       |
| POST   | /authenticate | Autenticar um usuário: Gera um token para o usuário            |

### Reservas

| Método | URL                             | Descrição                                        |
| ------ | ------------------------------- | -------------------------------------------------|
| GET    | /reserve     | Listar reservas: Retorna a lista de reservas                        |
| GET    | /reserve/:id | Buscar reserva: Retorna as informações de uma reserva específica    |
| POST   | /reserve     | Cadastrar reserva: Cria uma nova reserva                            |
| PUT    | /reserve/:id | Atualizar reserva: Atualiza as informações de uma reserva existente |
| DELETE | /reserve/:id | Excluir reserva: Exclui uma reserva existente                       |

##  📖 Documentação da API
A documentação da API foi gerada utilizando Swagger e está disponível em http://localhost:3000/api-docs

## 🔎 Contato

Para mais informações, entre em contato com henriquedaltrozo3@gmail.com
