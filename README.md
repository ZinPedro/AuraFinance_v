# 💰 AuraFinance

![Status](https://img.shields.io/badge/status-MVP%20publicado-brightgreen)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-blue)
![Backend](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-green)
![Database](https://img.shields.io/badge/database-MySQL%20%2B%20Railway-orange)
![API](https://img.shields.io/badge/API-REST-purple)
![License](https://img.shields.io/badge/license-Acad%C3%AAmico-lightgrey)

**AuraFinance** é uma plataforma web de gestão financeira pessoal desenvolvida para ajudar jovens adultos a organizarem suas finanças, controlarem transações, acompanharem objetivos financeiros e visualizarem informações por meio de dashboards.

O projeto foi desenvolvido na disciplina **PI: Projeto e Implementação de Aplicativos**, do curso de **Engenharia da Computação** da **PUC-Campinas**, seguindo uma arquitetura em camadas com **Front-end**, **Back-end/API** e **Banco de Dados**.

---

# 🔗 Acesso e Materiais do Projeto

| Recurso                     | Link                                                                                                                                                                     | Descrição                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| 🌐 Aplicação publicada      | [AuraFinance - Railway](https://aurafinance.up.railway.app/)                                                                                                             | Versão online do MVP acadêmico, publicada para demonstração, validação das funcionalidades e testes de acesso externo.              |
| 🎞️ Apresentação do projeto | [Apresentação - Lovable](https://aurafinanceapresentacao.lovable.app/)                                                                                                   | Página de apoio para apresentação final do projeto, com explicação visual da proposta, funcionamento e estrutura da solução.        |
| 📁 Evidências e testes      | [Google Drive - AuraFinance](https://drive.google.com/drive/folders/1zaEG4X0tI42aWYF_2QuSvMdCTGNPvHgj)                                                                   | Diretório com prints, vídeos, testes, evidências de funcionamento, validações da API, banco de dados e telas responsivas.           |
| 💻 Repositório              | [GitHub - AuraFinance](https://github.com/viniciusMoraesChaves/AuraFinance)                                                                                              | Código-fonte completo do projeto, contendo Front-end, Back-end, estrutura de rotas, models, controllers e arquivos de configuração. |
| 📋 Organização              | [Coda.io - AuraFinance](https://coda.io/d/AuraFinance_dgHTPlJW6kH/AuraFinance_suvB3ZXO#_luaSsazv)                                                                        | Ambiente de organização do grupo, utilizado para controle de tarefas, backlog, Kanban e acompanhamento das sprints.                 |
| 🎨 Protótipo                | [Figma - Protótipo AuraFinance](https://www.figma.com/make/VtTXI8s9P1x8KHdQNPvlMY/Prototipo-de-site-AuraFinance?p=f&t=ahcsJj4RR9A8ziiw-0)                                | Protótipo visual da aplicação, contendo a concepção das telas, fluxo de navegação e identidade visual do sistema.                   |
| 🗂️ Modelagem e fluxo       | [LucidSpark - Banco e Navegação](https://lucid.app/lucidspark/e7f91d1e-726e-404b-b8d9-fbd44f820478/edit?invitationId=inv_40577595-b45c-45e2-b1ec-d6a54f3d7a3a&page=0_0#) | Espaço utilizado para modelagem do banco de dados, MER/DER e organização do fluxo de navegação da aplicação.                        |

---

# 📑 Índice

* [Sobre o Projeto](#-sobre-o-projeto)
* [Problema](#️-problema)
* [Público-Alvo](#-público-alvo)
* [Funcionalidades Implementadas](#️-funcionalidades-implementadas)
* [Protótipo e Interface](#️-protótipo-e-interface)
* [Arquitetura do Sistema](#️-arquitetura-do-sistema)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Organização do Projeto](#-organização-do-projeto)
* [Estrutura do Repositório](#-estrutura-do-repositório)
* [Rotas da API](#️-rotas-da-api)
* [Banco de Dados](#️-banco-de-dados)
* [Como Executar Localmente](#-como-executar-localmente)
* [Testes e Evidências](#-testes-e-evidências)
* [Implantação](#-implantação)
* [Planejamento Ágil](#-planejamento-ágil)
* [ODS Relacionadas](#-ods-relacionadas)
* [Impacto e Valor Social](#-impacto-e-valor-social)
* [Roadmap](#️-roadmap)
* [Equipe](#-equipe)
* [Licença](#-licença)

---

# 📌 Sobre o Projeto

O **AuraFinance** é uma aplicação web voltada para **educação financeira** e **gestão de finanças pessoais**.

A plataforma permite que usuários:

* cadastrem uma conta e acessem seus próprios dados financeiros;
* registrem entradas e saídas de dinheiro;
* filtrem e acompanhem transações financeiras;
* visualizem indicadores e gráficos no Dashboard;
* criem e acompanhem objetivos financeiros;
* adicionem valores ao progresso das metas;
* consultem uma área inicial de investimentos;
* utilizem a aplicação em diferentes tamanhos de tela.

O objetivo central é facilitar o controle financeiro e apoiar decisões econômicas mais conscientes, especialmente para jovens adultos em início de independência financeira.

---

# ⚠️ Problema

Grande parte dos jovens adultos toma decisões financeiras sem compreender seus impactos de médio e longo prazo.

Esse cenário pode gerar:

* endividamento;
* uso excessivo de crédito;
* ausência de planejamento econômico;
* dificuldade para formar reserva financeira;
* baixa organização de entradas e saídas;
* pouca clareza sobre metas e investimentos.

O **AuraFinance** busca enfrentar esse problema com uma ferramenta simples, visual, acessível e educativa de gestão financeira pessoal.

---

# 👥 Público-Alvo

O público-alvo do aplicativo é formado principalmente por **jovens adultos entre 18 e 35 anos**, incluindo:

* universitários;
* recém-formados;
* profissionais em início de carreira;
* pessoas em processo de independência financeira;
* usuários com renda limitada ou variável;
* pessoas com familiaridade tecnológica, mas com dificuldade de organização financeira.

A proposta também pode ser utilizada como ferramenta educativa para introdução à educação financeira em outros contextos, como acompanhamento familiar e orientação inicial sobre controle de gastos.

---

# ⚙️ Funcionalidades Implementadas

## 👤 Cadastro e Autenticação de Usuário

* cadastro de novos usuários;
* validação de campos obrigatórios;
* validação de e-mail;
* criptografia de senha com bcrypt;
* login com geração de token JWT;
* consulta de usuário autenticado;
* proteção de rotas por token;
* edição de dados pessoais;
* alteração de senha;
* logout;
* exclusão de conta.

## 💸 Controle de Transações

* criação de transações financeiras;
* listagem de transações do usuário autenticado;
* edição de transações;
* exclusão de transações;
* classificação por categoria;
* definição de tipo de movimentação: entrada ou saída;
* filtros por categoria, status, tipo e período;
* paginação da listagem;
* cálculo de entradas, saídas e saldo líquido.

## 📊 Dashboard Financeiro

* visualização geral da situação financeira;
* indicadores de ganhos, despesas e saldo;
* gráficos de fluxo de caixa;
* distribuição de gastos por categoria;
* listagem de transações recentes;
* componentes visuais para análise rápida dos dados.

## 🎯 Objetivos Financeiros

* cadastro de metas financeiras;
* listagem de objetivos por usuário;
* edição de objetivos;
* exclusão de objetivos;
* adição de valor ao progresso da meta;
* cálculo de progresso;
* cálculo de valor faltante;
* estimativa de contribuição mensal.

## 📈 Investimentos

* tela dedicada para visualização de investimentos;
* base inicial para acompanhamento e simulação;
* organização visual de informações relacionadas a aplicações financeiras;
* estrutura preparada para futuras integrações e expansão do módulo.

## 📱 Responsividade e Usabilidade

* layout adaptado para diferentes tamanhos de tela;
* menu lateral fixo na versão desktop;
* navegação simplificada entre páginas;
* cards, gráficos, tabelas e modais;
* ajustes de interface para melhorar a clareza das informações.

---

# 🖥️ Protótipo e Interface

O protótipo do **AuraFinance** foi desenvolvido com foco em uma interface moderna, limpa e orientada a dados.

Principais telas:

* Landing Page;
* Login e Cadastro;
* Dashboard;
* Transações;
* Objetivos;
* Investimentos;
* Configurações do Usuário.

A navegação foi pensada para ser direta: o usuário acessa a Landing Page, realiza cadastro ou login e é direcionado ao Dashboard principal. A partir dele, pode navegar entre as seções de Transações, Objetivos, Investimentos e Configurações.

O projeto utiliza uma identidade visual baseada em:

* dashboards;
* cartões informativos;
* gráficos;
* listas organizadas;
* menu lateral;
* modais de cadastro;
* componentes responsivos.

---

# 🏗️ Arquitetura do Sistema

A arquitetura do MVP foi organizada em três camadas principais:

```text
Usuário / Navegador
        ↓
Front-end React + Vite
        ↓
API REST Node.js + Express
        ↓
Sequelize ORM
        ↓
Banco de Dados MySQL
```

## Front-end

Responsável pela interface, navegação, exibição dos dados financeiros e interação do usuário com o sistema.

## Back-end API

Responsável por:

* processar requisições HTTP;
* aplicar regras de negócio;
* validar dados;
* autenticar usuários;
* proteger rotas;
* comunicar-se com o banco de dados.

## Banco de Dados

Responsável por armazenar dados como:

* usuários;
* categorias;
* transações;
* objetivos financeiros;
* investimentos;
* tipos de investimento.

## Autenticação

O sistema utiliza **JWT** para autenticação e proteção das rotas internas, garantindo que cada usuário visualize e manipule apenas seus próprios dados.

---

# 🧰 Tecnologias Utilizadas

## Front-end

* React;
* Vite;
* JavaScript;
* TypeScript;
* HTML5;
* CSS3;
* React Router DOM;
* Recharts;
* Lucide React;
* Spline / Three.js.

## Back-end

* Node.js;
* Express.js;
* Sequelize;
* MySQL2;
* JSON Web Token;
* bcryptjs;
* Validator;
* Dotenv;
* CORS;
* Nodemon.

## Banco de Dados e Hospedagem

* MySQL;
* Railway;
* Sequelize ORM.

## Ferramentas de Desenvolvimento e Organização

* Git;
* GitHub;
* Coda.io;
* Figma;
* LucidSpark;
* Postman;
* Thunder Client.

---

# 🧩 Organização do Projeto

O desenvolvimento foi dividido em três áreas técnicas principais:

| Área                                     | Responsáveis                                    |
| ---------------------------------------- | ----------------------------------------------- |
| Front-end                                | Vinicius de Moraes Chaves                       |
| Back-end                                 | Eloise dos Santos Ruiz e Lucas Leal Ibrahim     |
| Banco de Dados                           | Pedro Henrique Coan Zin e Felipe Ishizawa Diniz |
| Documentação, testes e decisões técnicas | Todos os integrantes                            |

Apesar da divisão por área, o projeto foi desenvolvido de forma colaborativa, com decisões técnicas discutidas pelo grupo ao longo das sprints.

---

# 📁 Estrutura do Repositório

```text
AuraFinance/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   │   └── conn.js
│   │   ├── middlewares/
│   │   │   └── checkToken.js
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
├── src/
│   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── img/
│   │   ├── landing/
│   │   └── pages/
│   ├── config/
│   │   └── api.ts
│   ├── main.jsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

# 🛣️ Rotas da API

## Autenticação e Usuário

| Método | Rota                | Descrição                               |
| ------ | ------------------- | --------------------------------------- |
| POST   | `/auth/register`    | Cadastra um novo usuário                |
| POST   | `/auth/login`       | Realiza login e retorna token JWT       |
| GET    | `/auth/me`          | Retorna os dados do usuário autenticado |
| PUT    | `/auth/edit-user`   | Atualiza dados do usuário autenticado   |
| DELETE | `/auth/delete-user` | Exclui a conta do usuário autenticado   |

## Transações

| Método | Rota                               | Descrição                                |
| ------ | ---------------------------------- | ---------------------------------------- |
| POST   | `/transacoes/create`               | Cria uma nova transação financeira       |
| GET    | `/transacoes/list`                 | Lista transações com filtros e paginação |
| PUT    | `/transacoes/edit/:id`             | Edita uma transação existente            |
| DELETE | `/transacoes/delete-transacao/:id` | Exclui uma transação                     |
| GET    | `/transacoes/listcategorias`       | Lista categorias de transações           |
| GET    | `/transacoes/resumo`               | Retorna resumo financeiro                |
| GET    | `/transacoes/gastos-categoria`     | Retorna gastos agrupados por categoria   |

## Objetivos

| Método | Rota                    | Descrição                                  |
| ------ | ----------------------- | ------------------------------------------ |
| POST   | `/objetivos/create`     | Cria um novo objetivo financeiro           |
| GET    | `/objetivos/list`       | Lista os objetivos do usuário autenticado  |
| PUT    | `/objetivos/edit/:id`   | Edita um objetivo financeiro               |
| DELETE | `/objetivos/delete/:id` | Exclui um objetivo financeiro              |
| PUT    | `/objetivos/add/:id`    | Adiciona valor ao progresso de um objetivo |

## Testes

| Método | Rota                 | Descrição                                                     |
| ------ | -------------------- | ------------------------------------------------------------- |
| GET    | `/test/teste-insert` | Rota de teste para inserção de usuário, categoria e transação |
| GET    | `/`                  | Verifica se a API está rodando                                |

---

# 🗄️ Banco de Dados

O banco de dados foi modelado em **MySQL**, seguindo uma estrutura relacional para manter consistência entre usuários, movimentações financeiras, objetivos e investimentos.

Principais entidades:

* `usuario`;
* `categoria_transacao`;
* `transacao`;
* `objetivo`;
* `investimento`;
* `tipo_investimento`.

A comunicação entre o Back-end e o Banco de Dados é realizada com **Sequelize ORM**, facilitando a manipulação dos dados por meio de models e associações.

---

## 3. Configurar o Front-end

Em outro terminal, volte para a raiz do projeto:

```bash
cd ..
npm install
```

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

Execute o Front-end:

```bash
npm run dev
```

O Vite exibirá o endereço local da aplicação, geralmente:

```text
http://localhost:5173
```

---

# 🧪 Testes e Evidências

Durante o desenvolvimento, foram realizados testes manuais e exploratórios para validar o funcionamento do sistema e a integração entre as camadas.

Foram testados:

* cadastro de usuário;
* login bem-sucedido;
* erro de login;
* proteção de rotas com JWT;
* consulta de usuário autenticado;
* edição e exclusão de usuário;
* cadastro de nova transação;
* listagem, edição e exclusão de transações;
* filtros e paginação;
* cadastro e listagem de objetivos;
* validação dos dados no banco MySQL/Railway;
* tela inicial no navegador;
* navegação entre páginas;
* responsividade da interface.

As evidências estão disponíveis no diretório de testes e materiais do projeto:

[📁 Acessar evidências no Google Drive](https://drive.google.com/drive/folders/1zaEG4X0tI42aWYF_2QuSvMdCTGNPvHgj)

---

# 🌐 Implantação

O MVP do **AuraFinance** foi publicado em ambiente web por meio da plataforma **Railway**.

A implantação envolveu:

* hospedagem da aplicação;
* configuração do Back-end;
* conexão com banco de dados hospedado;
* ajustes de variáveis de ambiente;
* validação de acesso externo;
* testes de login, cadastro, navegação e funcionalidades financeiras.

Aplicação publicada:

[🌐 Acessar AuraFinance](https://aurafinance.up.railway.app/)

---

# 📋 Planejamento Ágil

O projeto utilizou metodologias ágeis para organização e acompanhamento do desenvolvimento.

## Scrum

Organização do desenvolvimento em sprints, permitindo entregas progressivas e revisão contínua das prioridades.

## Kanban

Controle visual das tarefas em colunas como:

* A Fazer;
* Em Andamento;
* Concluído.

Ferramenta utilizada:

[📋 Coda.io - Organização AuraFinance](https://coda.io/d/AuraFinance_dgHTPlJW6kH/AuraFinance_suvB3ZXO#_luaSsazv)

---

# 🌎 ODS Relacionadas

O projeto está alinhado com os seguintes Objetivos de Desenvolvimento Sustentável da ONU:

* **ODS 1 — Erradicação da Pobreza**;
* **ODS 4 — Educação de Qualidade**;
* **ODS 8 — Trabalho Decente e Crescimento Econômico**;
* **ODS 10 — Redução das Desigualdades**.

---

# 🌱 Impacto e Valor Social

O **AuraFinance** busca gerar valor social ao oferecer uma ferramenta acessível para organização financeira e educação econômica.

Impactos esperados:

* apoio ao controle de gastos;
* incentivo ao planejamento financeiro;
* redução de decisões financeiras impulsivas;
* fortalecimento da autonomia financeira;
* contribuição para educação financeira digital;
* estímulo a hábitos econômicos mais sustentáveis;
* possibilidade de auxiliar usuários na redução de endividamento.

O projeto também teve relevância acadêmica ao permitir a aplicação prática de conhecimentos de desenvolvimento web, banco de dados, API REST, autenticação, testes, versionamento e trabalho em equipe.

---

# 🗺️ Roadmap

## MVP Concluído

* Landing Page;
* Login e Cadastro;
* Dashboard;
* Transações;
* Objetivos;
* Investimentos;
* Configurações do Usuário;
* Back-end com autenticação JWT;
* CRUD de usuários;
* CRUD de transações;
* CRUD de objetivos;
* integração com MySQL;
* deploy na Railway;
* testes manuais e evidências.

## Evoluções Futuras

* autenticação em dois fatores;
* recuperação de senha por e-mail;
* testes automatizados no Front-end e Back-end;
* tratamento visual de erros mais completo;
* dashboards mais dinâmicos;
* relatórios financeiros detalhados;
* exportação de dados em PDF ou planilhas;
* notificações sobre vencimentos, metas e limites;
* integração com APIs externas de investimentos;
* expansão do módulo de investimentos;
* melhorias de acessibilidade;
* versão mobile.

---

# 👨‍💻 Equipe

**Grupo:** AuraFinance

| Integrante                | RA       |
| ------------------------- | -------- |
| Eloise dos Santos Ruiz    | 24002341 |
| Felipe Ishizawa Diniz     | 24002300 |
| Lucas Leal Ibrahim        | 24014012 |
| Pedro Henrique Coan Zin   | 24026585 |
| Vinicius de Moraes Chaves | 24007303 |

---

# 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos no contexto da disciplina **PI: Projeto e Implementação de Aplicativos**, da **PUC-Campinas**.

Caso seja expandido futuramente, poderá receber uma licença formal de distribuição.
