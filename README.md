<h2>🚗 NestJS-Veiculos</h2>

NestJS-Veiculos é um sistema de gerenciamento de veículos construído com NestJS no back-end e uma interface estática simples (HTML/CSS/JS) no front-end. Ele demonstra boas práticas de arquitetura modular do NestJS, DTOs para validação, e um CRUD completo para a entidade Veículo.

📋 Sumário
Demonstração

Funcionalidades

Tecnologias

Estrutura do Projeto

Pré-requisitos

Instalação & Execução

API Veículos

Front-end

Contribuições

Licença

💻 Demonstração
Back-end: servidor NestJS rodando em http://localhost:3000 Front-end: abra FrontEnd/index.html no navegador

✨ Funcionalidades
Cadastro de veículos (marca, modelo, ano, preço)

Listagem de todos os veículos

Consulta de veículo por ID

Atualização de dados de um veículo

Exclusão de veículo

🛠 Tecnologias
Node.js & npm

NestJS (v10)

TypeScript

Jest (testes e2e)

HTML, CSS, JavaScript (front-end estático)

📁 Estrutura do Projeto
plaintext
NestJS-Veiculos/
├── BackEnd/                    # Server NestJS
│   ├── src/
│   │   ├── main.ts             # Ponto de entrada
│   │   ├── app.module.ts       # Módulo raiz
│   │   ├── app.controller.ts   # Rota de health-check
│   │   ├── app.service.ts      # Lógica de exemplo
│   │   └── veiculos/
│   │       ├── dto/
│   │       │   └── create-veiculo.dto.ts    # DTO de validação
│   │       ├── entities/
│   │       │   └── veiculo.entity.ts        # Classe entidade
│   │       ├── veiculos.controller.ts       # Definição de rotas
│   │       ├── veiculos.module.ts           # Módulo Veículos
│   │       └── veiculos.service.ts          # Lógica de negócio
│   ├── test/
│   │   ├── app.e2e-spec.ts     # Testes end-to-end
│   │   └── jest-e2e.json       # Config do Jest
│   ├── nest-cli.json           # CLI config
│   ├── tsconfig.json           # Config TS
│   ├── tsconfig.build.json     # Build config
│   └── package.json            # Dependências & scripts
└── FrontEnd/                   # Interface estática
    ├── index.html              # Página principal
    ├── style.css               # Estilos
    └── script.js               # Lógica de consumo da API
🔧 Pré-requisitos
Node.js v18+

npm ou yarn

(opcional) Docker

🚀 Instalação & Execução
Clone o repositório

bash
git clone https://github.com/lindembergz/NestJS-Veiculos.git
cd NestJS-Veiculos
Back-end

bash
cd BackEnd
npm install
npm run start:dev
# servidor disponível em http://localhost:3000
Front-end

Abra FrontEnd/index.html no seu navegador

O script faz chamadas à API para listar, criar e gerenciar veículos

🔗 API Veículos
Método	Rota	Descrição	Corpo (JSON)
GET	/veiculos	Lista todos os veículos	—
GET	/veiculos/:id	Retorna veículo por ID	—
POST	/veiculos	Cria um novo veículo	{ "marca": string, "modelo": string, "ano": number, "preco": number }
PUT	/veiculos/:id	Atualiza os dados de um veículo	{ "marca"?, "modelo"?, "ano"?, "preco"? }
DELETE	/veiculos/:id	Remove um veículo	—
🎨 Front-end
Dentro de FrontEnd/, o script.js utiliza fetch() para interagir com as rotas acima. Você pode:

Exibir a lista de veículos

Enviar formulários para criar ou editar registros

Remover veículos via botões dedicados

🤝 Contribuições
Pull requests, melhorias, e sugestões de novas funcionalidades são super bem-vindas!

Fork este repositório

Crie uma branch (git checkout -b feature/MinhaFeature)

Commit suas mudanças (git commit -m 'feat: Minha feature')

Push para a branch (git push origin feature/MinhaFeature)

Abra um Pull Request 🚀

📝 Licença
MIT © Lindemberg
