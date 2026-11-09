# Projeto Docker — Aplicação Web com 3 Containers

Projeto desenvolvido para a disciplina de Sistemas Operacionais, com o objetivo de demonstrar a utilização do Docker e Docker Compose na execução de uma aplicação web composta por três serviços independentes.

## Tecnologias utilizadas

- Docker e Docker Compose
- Nginx
- HTML, CSS e JavaScript
- Python e Flask
- PostgreSQL
- API REST

## Arquitetura

A aplicação utiliza três containers:

1. **Frontend:** Nginx disponibiliza a interface web desenvolvida com HTML, CSS e JavaScript.
2. **Backend:** Python com Flask fornece uma API REST para gerenciamento de posts.
3. **Banco de Dados:** PostgreSQL armazena os posts cadastrados.

Os serviços se comunicam por uma rede interna criada automaticamente pelo Docker Compose.

## Funcionalidades

A aplicação permite realizar operações CRUD:

- CREATE — cadastrar posts.
- READ — listar posts.
- UPDATE — editar posts.
- DELETE — excluir posts.

## Estrutura do projeto

```text
trabalho-docker/
├── backend/
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Como executar

É necessário ter Docker e Docker Compose instalados.

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
cd trabalho-docker
```

### 2. Configurar as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` caso queira alterar as credenciais do banco.

### 3. Iniciar a aplicação

```bash
docker compose up -d --build
```

### 4. Acessar os serviços

Frontend:

http://localhost:8080

Backend (API REST):

http://localhost:5000/api/posts

### 5. Verificar os containers

```bash
docker compose ps
```

### 6. Encerrar a aplicação

```bash
docker compose down
```

O volume do PostgreSQL mantém os dados persistidos mesmo após a remoção dos containers.

## Conceitos demonstrados

- Criação de imagens com Dockerfile.
- Orquestração de serviços com Docker Compose.
- Comunicação entre containers.
- Utilização de variáveis de ambiente.
- Persistência de dados com volumes Docker.
- Desenvolvimento e consumo de API REST.
