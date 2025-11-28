# 🛒 Glowered Store - E-commerce API

<div align="center">

![GitHub](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

**Uma API robusta para gestão completa de e-commerce com arquitetura escalável**

</div>

## 📋 Índice
- [🧱 Sistema Completo](#-sistema-de-e-commerce-completo)
- [🧩 Descrição](#-descrição)
- [🎯 Problema que Resolve](#-problema-que-resolve)
- [⚙️ Tecnologias](#️-tecnologias-utilizadas)
- [📁 Estrutura](#-estrutura-de-pastas-do-projeto)
- [🔁 Fluxo](#-fluxo-de-execução-da-aplicação)
- [📌 Módulos](#-módulos-e-funcionalidades)
- [🏛️ Arquitetura](#️-arquitetura-do-projeto)
- [💡 SOLID](#-princípios-solid-aplicados)
- [🔒 Autenticação](#-sistema-de-autenticação-e-autorização)
- [💾 Como Usar](#-como-rodar-o-projeto)
- [🧪 Testes](#-testando-a-api)
- [📊 Endpoints](#-endpoints-principais)
- [🔮 Futuro](#-próximas-funcionalidades)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contribuir](#-contribuindo)
- [📚 Referências](#-referências)
- [👨‍💻 Autor](#-autor)
- [📄 Licença](#-licença)

---

## 🧱 Sistema de E-commerce Completo
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #007bff; margin: 1rem 0;">
Uma API robusta para gestão completa de e-commerce, construída com <strong>arquitetura escalável</strong> e organizada para <strong>alta performance</strong> e <strong>manutenibilidade</strong>.
</div>

## 🧩 Descrição
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #28a745; margin: 1rem 0;">
Este projeto é um sistema completo de e-commerce que gerencia desde autenticação de usuários até pedidos, estoque e entregas. A arquitetura modular permite:

• <strong>Gestão completa de usuários</strong> (clientes e administradores)<br>
• <strong>Sistema de autenticação JWT</strong> com diferentes níveis de acesso<br>
• <strong>Catálogo de produtos</strong> com categorias, estoque e promoções<br>
• <strong>Carrinho de compras persistente</strong><br>
• <strong>Sistema de pedidos</strong> com fluxo completo<br>
• <strong>Gestão de entregas</strong> e rastreamento<br>
• <strong>Cupons de desconto</strong> e promoções<br>
• <strong>Dashboard administrativo</strong> completo
</div>

## 🎯 Problema que Resolve
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #ffc107; margin: 1rem 0;">
<strong>❌ Problemas Comuns:</strong><br>
• Controllers sobrecarregados com lógica complexa<br>
• Regras de negócio misturadas com lógica de apresentação<br>
• Dificuldade em manter e escalar funcionalidades<br>
• Acoplamento alto entre módulos<br>
• Dificuldade na implementação de testes<br><br>

<strong>✅ Este projeto resolve através de:</strong><br>
• Separação clara de responsabilidades em camadas<br>
• Arquitetura modular e escalável<br>
• Código testável e de fácil manutenção<br>
• Documentação clara das funcionalidades
</div>

## ⚙️ Tecnologias Utilizadas
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #17a2b8; margin: 1rem 0;">
<strong>🟢 Backend:</strong><br>
• Node.js - Runtime JavaScript<br>
• Express.js - Framework web<br>
• Sequelize - ORM para banco de dados<br>
• MySQL/MariaDB - Banco de dados relacional<br>
• JWT - Autenticação por tokens<br>
• bcrypt - Criptografia de senhas<br>
• dotenv - Gerenciamento de variáveis de ambiente<br>
• CORS - Controle de acesso entre origens<br><br>

<strong>🎨 Frontend:</strong><br>
• HTML5 - Estrutura semântica<br>
• CSS3 - Estilização moderna com variáveis CSS<br>
• JavaScript ES6+ - Interatividade e consumo de API<br>
• Fetch API - Comunicação com backend<br><br>

<strong>🛠️ Ferramentas:</strong><br>
• Postman - Testes de API<br>
• Git - Controle de versão
</div>

## 📁 Estrutura de Pastas do Projeto
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #6f42c1; margin: 1rem 0;">
<pre>
backend/
├── 📄 server.js                 # Ponto de entrada da aplicação
├── 📁 middleware/               # Middlewares customizados
│   └── auth.middleware.js      # Middleware de autenticação JWT
├── 📁 controller/               # Controladores das rotas
│   ├── auth.controller.js      # Autenticação e login
│   ├── usuario.controller.js   # Gestão de usuários
│   ├── produto.controller.js   # CRUD de produtos
│   ├── estoque.controller.js   # Controle de estoque
│   ├── carrinho.controller.js  # Gestão do carrinho
│   ├── pedidos.controller.js   # Processamento de pedidos
│   ├── cupom.controller.js     # Sistema de cupons
│   ├── entrega.controller.js   # Gestão de entregas
│   └── config.controller.js    # Configurações do usuário
├── 📁 model/                   # Modelos do Sequelize
│   ├── Usuario.js             # Modelo de usuários
│   ├── Produto.js             # Modelo de produtos
│   ├── Estoque.js             # Modelo de estoque
│   ├── Carrinho.js            # Modelo do carrinho
│   ├── Pedido.js              # Modelo de pedidos
│   ├── Cupom.js               # Modelo de cupons
│   ├── Entrega.js             # Modelo de entregas
│   ├── Config.js              # Modelo de configurações
│   └── rel.js                 # Associações entre modelos
├── 📁 service/                 # Lógica de negócio
│   └── bcrypt.service.js      # Serviço de criptografia
├── 📁 db/                      # Configuração do banco
│   └── conn.js                # Conexão com banco de dados
└── 📁 public/                  # Arquivos estáticos (se necessário)

frontend/
├── 📄 index.html              # Página principal da loja
├── 📁 html/                   # Páginas da aplicação
│   ├── login.html            # Página de login
│   ├── register.html         # Página de cadastro
│   ├── carrinho.html         # Carrinho de compras
│   ├── profile.html          # Perfil do usuário
│   └── 📁 admin/             # Painel administrativo
│       ├── admin-dashboard.html
│       ├── admin-produtos.html
│       ├── admin-pedidos.html
│       ├── admin-clientes.html
│       ├── admin-entregas.html
│       └── admin-cupons.html
├── 📁 css/                    # Estilos da aplicação
│   ├── style.css             # Estilos principais
│   ├── admin.css             # Estilos do admin
│   └── login.css             # Estilos de login
└── 📁 js/                     # JavaScript da aplicação
    ├── auth.js               # Autenticação e usuários
    ├── produtos.js           # Gestão de produtos
    ├── carrinho.js           # Funcionalidades do carrinho
    ├── perfil.js             # Gestão do perfil
    └── 📁 admin/             # Scripts do painel admin
        ├── admin-dashboard.js
        ├── admin-produtos.js
        ├── admin-pedidos.js
        ├── admin-clientes.js
        ├── admin-entregas.js
        └── admin-cupons.js
</pre>
</div>

## 🔁 Fluxo de Execução da Aplicação
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #20c997; margin: 1rem 0;">
<pre>
Requisição HTTP
     ↓
Rotas (server.js)
     ↓
Middleware de Autenticação
     ↓
Controller Específico
     ↓
Service (Regras de Negócio)
     ↓
Model (Sequelize)
     ↓
Banco de Dados MySQL
     ↓
Resposta JSON
</pre>
</div>

## 📌 Módulos e Funcionalidades
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #fd7e14; margin: 1rem 0;">
<strong>🔐 Módulo de Autenticação</strong><br>
• Cadastro de usuários com validação completa<br>
• Login seguro com JWT<br>
• Tipos de usuário: Cliente e Administrador<br>
• Middleware de proteção para rotas privadas<br><br>

<strong>🛍️ Módulo de Produtos</strong><br>
• CRUD completo de produtos<br>
• Categorias: Camisas, Moletons, Calças, Acessórios<br>
• Sistema de promoções com percentual de desconto<br>
• Gestão de imagens via URL<br>
• Controle de disponibilidade<br><br>

<strong>📦 Módulo de Estoque</strong><br>
• Entradas e saídas de estoque<br>
• Histórico de movimentações<br>
• Alertas de estoque baixo<br>
• Ajustes manuais de quantidade<br><br>

<strong>🛒 Módulo de Carrinho</strong><br>
• Carrinho persistente por usuário<br>
• Adição/remoção de itens<br>
• Atualização de quantidades<br>
• Cálculo automático de totais<br>
• Aplicação de cupons<br><br>

<strong>📋 Módulo de Pedidos</strong><br>
• Criação de pedidos a partir do carrinho<br>
• Fluxo de status: Pendente → Processando → Enviado → Entregue<br>
• Histórico de pedidos por usuário<br>
• Cancelamento com reestocagem<br><br>

<strong>🚚 Módulo de Entregas</strong><br>
• Gestão de transportadoras<br>
• Códigos de rastreamento<br>
• Status de entrega em tempo real<br>
• Relatórios de desempenho<br><br>

<strong>🎫 Módulo de Cupons</strong><br>
• Criação e gestão de cupons<br>
• Validação automática (data, uso único)<br>
• Statistísticas de utilização<br>
• Tipos de desconto (percentual)
</div>

## 🏛️ Arquitetura do Projeto
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #e83e8c; margin: 1rem 0;">
<strong>🎯 Princípios Aplicados:</strong><br>
• Clean Architecture - Separação clara de responsabilidades<br>
• Service Layer - Regras de negócio isoladas<br>
• Repository Pattern - Abstração do acesso a dados<br>
• Dependency Injection - Baixo acoplamento<br><br>

<strong>✅ Benefícios da Arquitetura:</strong><br>
• Baixo acoplamento entre módulos<br>
• Facilidade de testes unitários e integração<br>
• Escalabilidade para novas funcionalidades<br>
• Manutenibilidade do código<br>
• Separação clara de responsabilidades
</div>

## 💡 Princípios SOLID Aplicados
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #6f42c1; margin: 1rem 0;">
<strong>🎯 S — Single Responsibility Principle</strong><br>
• Cada controller tem uma responsabilidade específica<br>
• Services focam em regras de negócio únicas<br>
• Models gerenciam apenas acesso a dados<br><br>

<strong>🔄 O — Open/Closed Principle</strong><br>
• Sistema aberto para extensão, fechado para modificação<br>
• Novas funcionalidades podem ser adicionadas sem alterar código existente<br><br>

<strong>🔁 L — Liskov Substitution Principle</strong><br>
• Interfaces consistentes entre controllers<br>
• Contratos claros entre camadas<br><br>

<strong>🎯 I — Interface Segregation Principle</strong><br>
• Interfaces específicas para cada módulo<br>
• Clients não dependem de interfaces que não usam<br><br>

<strong>📊 D — Dependency Inversion Principle</strong><br>
• Camadas de alto nível não dependem de implementações específicas<br>
• Inversão de dependência através de interfaces
</div>

## 🔒 Sistema de Autenticação e Autorização
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #007bff; margin: 1rem 0;">
<strong>🔑 Estrutura do Token JWT:</strong>
<pre>
{
  id: "user_id",
  email: "user@email.com",
  tipo: "cliente" | "admin",
  iat: timestamp,
  exp: timestamp
}
</pre>

<strong>🎯 Níveis de Acesso:</strong><br>
• <strong>Público:</strong> Login, Cadastro, Listagem de produtos<br>
• <strong>Cliente:</strong> Carrinho, Pedidos, Perfil<br>
• <strong>Administrador:</strong> Dashboard, Gestão completa<br><br>

<strong>📨 Headers de Autenticação:</strong>
<pre>
Authorization: Bearer SEU_TOKEN_JWT_AQUI
Content-Type: application/json
</pre>
</div>

## 💾 Como Rodar o Projeto
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #28a745; margin: 1rem 0;">
<strong>1️⃣ Clonar o repositório</strong>
<pre>git clone https://github.com/seu-usuario/glowered-store.git
cd glowered-store</pre>

<strong>2️⃣ Instalar dependências</strong>
<pre># Backend
cd backend
npm install

# Frontend (em outro terminal)
cd frontend
# Servir com live server ou similar</pre>

<strong>3️⃣ Configurar variáveis de ambiente</strong><br>
Crie um arquivo <code>.env</code> na pasta backend:
<pre># Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASS=sua_senha
DB_NAME=glowered_store

# Autenticação JWT
JWT_SECRET=SUA_CHAVE_SECRETA_JWT_MUITO_SEGURA

# Servidor
PORTC=3000
HOSTNAME=localhost</pre>

<strong>4️⃣ Configurar o banco de dados</strong>
<pre>CREATE DATABASE glowered_store;</pre>

<strong>5️⃣ Executar a aplicação</strong>
<pre># Backend
cd backend
npm start

# Frontend
# Abrir frontend/index.html em um servidor web
# ou usar extensão Live Server no VS Code</pre>

<strong>6️⃣ Acessar a aplicação</strong><br>
• <strong>Loja:</strong> http://localhost:3000 (frontend)<br>
• <strong>API:</strong> http://localhost:3000 (backend)<br>
• <strong>Admin:</strong> Fazer login com usuário do tipo 'admin'
</div>

## 🧪 Testando a API
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #ffc107; margin: 1rem 0;">
<strong>👤 Cadastro de Usuário</strong>
<pre>POST /clientes
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "cpf": "123.456.789-00",
  "telefone": "(11) 99999-9999",
  "tipo": "cliente"
}</pre>

<strong>🔐 Login</strong>
<pre>POST /login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "123456"
}</pre>

<strong>🛍️ Listar Produtos</strong>
<pre>GET /produtos
Authorization: Bearer SEU_TOKEN_JWT</pre>

<strong>📦 Adicionar ao Carrinho</strong>
<pre>POST /carrinho/adicionar
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json

{
  "idUsuario": 1,
  "idProduto": 1,
  "quantidade": 2
}</pre>
</div>

## 📊 Endpoints Principais
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #17a2b8; margin: 1rem 0;">
<strong>🔐 Autenticação</strong><br>
• POST /login - Login de usuário<br>
• POST /clientes - Cadastro de cliente<br><br>

<strong>👥 Usuários</strong><br>
• GET /clientes - Listar usuários (admin)<br>
• GET /clientes/:id - Buscar usuário<br>
• PUT /clientes/:id - Atualizar usuário<br>
• DELETE /clientes/:id - Excluir usuário<br><br>

<strong>🛍️ Produtos</strong><br>
• GET /produtos - Listar produtos ativos<br>
• GET /produtos/todos - Listar todos produtos (admin)<br>
• POST /produtos - Criar produto (admin)<br>
• PUT /produtos/:id - Atualizar produto (admin)<br><br>

<strong>🛒 Carrinho</strong><br>
• POST /carrinho/adicionar - Adicionar item<br>
• GET /carrinho/:idUsuario - Listar itens<br>
• PUT /carrinho/:id - Atualizar quantidade<br>
• DELETE /carrinho/:id - Remover item<br><br>

<strong>📋 Pedidos</strong><br>
• POST /pedidos - Criar pedido<br>
• GET /pedidos - Listar pedidos (admin)<br>
• GET /pedidos/usuario/:idUsuario - Pedidos do usuário
</div>

## 🔮 Próximas Funcionalidades
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #6f42c1; margin: 1rem 0;">
• Sistema de pagamentos integrado<br>
• Notificações por email<br>
• Relatórios avançados<br>
• API para mobile<br>
• Sistema de avaliações<br>
• Blog integrado<br>
• Multi-tenant para lojas múltiplas
</div>

## 🐛 Troubleshooting
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #dc3545; margin: 1rem 0;">
<strong>Problemas Comuns:</strong><br><br>

<strong>Erro de conexão com banco:</strong><br>
• Verificar credenciais no .env<br>
• Confirmar se o banco está rodando<br>
• Checar se a database existe<br><br>

<strong>Erro de CORS:</strong><br>
• Verificar configurações do frontend<br>
• Confirmar URL da API<br><br>

<strong>Token JWT expirado:</strong><br>
• Fazer login novamente<br>
• Verificar tempo de expiração
</div>

## 🤝 Contribuindo
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #20c997; margin: 1rem 0;">
1. Fork o projeto<br>
2. Crie uma branch para sua feature (<code>git checkout -b feature/AmazingFeature</code>)<br>
3. Commit suas mudanças (<code>git commit -m 'Add some AmazingFeature'</code>)<br>
4. Push para a branch (<code>git push origin feature/AmazingFeature</code>)<br>
5. Abra um Pull Request
</div>

## 📚 Referências
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #fd7e14; margin: 1rem 0;">
<strong>Arquitetura e Padrões:</strong><br>
• Clean Architecture - Uncle Bob<br>
• Node.js Best Practices<br>
• Sequelize Documentation<br><br>

<strong>Segurança:</strong><br>
• JWT Best Practices<br>
• OWASP Security Guidelines
</div>

## 👨‍💻 Autor
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #e83e8c; margin: 1rem 0;">
<strong>João Vitor Galiotto de Souza</strong><br>
• GitHub: @1Galiotto<br>
</div>

## 📄 Licença
<div style="background: #f8f9fa; padding: 2rem; border-radius: 10px; border-left: 5px solid #6c757d; margin: 1rem 0;">
Distribuído sob a Licença MIT. Veja <code>LICENSE</code> para mais informações.
</div>

---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela no repositório!**

**🐛 Encontrou um bug? [Abra uma issue](https://github.com/seu-usuario/glowered-store/issues)**

**💡 Tem uma sugestão? Contribua com o projeto!**

</div>
