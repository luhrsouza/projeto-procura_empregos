Este projeto é uma plataforma completa de busca e oferta de empregos, desenvolvida como parte da avaliação da matéria de Tecnologia Cliente-Servidor. A aplicação consiste em uma API RESTful robusta construída com NestJS (backend) e uma interface de cliente dinâmica e interativa construída com React (frontend).

O sistema permite que usuários comuns se cadastrem, busquem vagas e gerenciem seus perfis, enquanto empresas podem se cadastrar para publicar e gerenciar suas próprias vagas de emprego. A comunicação entre cliente e servidor segue um protocolo de troca de mensagens bem definido, com autenticação baseada em tokens JWT para proteger as rotas.


🛠️ Tecnologias Utilizadas

Backend (Servidor)
Framework: NestJS (Node.js)

Linguagem: TypeScript

Banco de Dados: MySQL

ORM: TypeORM

Autenticação: Passport.js com estratégia JWT (JSON Web Tokens)

Validação: class-validator e class-transformer para seguir o protocolo da API.

Ambiente: Docker

Frontend (Cliente)
Framework: React (com Vite)

Linguagem: TypeScript

Navegação: React Router DOM

Requisições HTTP: Axios

Gerenciamento de Estado Global: React Context API (para o endereço da API e autenticação)

Ambiente: Docker

🚀 Como Rodar o Projeto Localmente

Para executar este projeto, você precisará ter o Git e o Docker Desktop instalados e em execução na sua máquina.

1. Clonar o Repositório
Bash

git clone https://github.com/luhrsouza/projeto-procura_empregos.git
cd projeto-procura_empregos
2. Configurar o Banco de Dados
Este projeto utiliza MySQL. A forma mais fácil de configurar o ambiente é usando o Laragon:

Inicie o Laragon e clique em "Iniciar Tudo".

Clique em "Banco de Dados" para abrir o HeidiSQL.

Crie um novo banco de dados com o nome projeto_empregos e collation utf8mb4_0900_ai_ci.

3. Iniciar o Backend
Abra um novo terminal na pasta do projeto.

Bash

# Navegue até a pasta do backend
cd backend

# Inicie o contêiner do Docker
docker run -it --rm -p 3000:3000 -v "${PWD}:/app" -w /app node:22 sh

# Dentro do contêiner, instale as dependências e inicie o servidor
npm install
npm run start:dev
O servidor backend estará rodando em http://localhost:3000.

4. Iniciar o Frontend
Abra um segundo terminal, separado do primeiro.

Bash

# Navegue até a pasta do frontend
cd frontend

# Inicie o contêiner do Docker
docker run -it --rm -p 5173:5173 -v "${PWD}:/app" -w /app node:22 sh

# Dentro do contêiner, instale as dependências e inicie o servidor
npm install
npm run dev -- --host
5. Configurar e Usar a Aplicação
Abra seu navegador e acesse http://localhost:5173.

A primeira página será a de Configurações. O endereço do seu servidor local (http://localhost:3000) já estará preenchido. Clique em "Salvar".
