require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./db/conn.js')

require('./model/rel.js')

// Importa a conexão com o banco de dados
const authMiddleware = require('./middleware/auth.middleware.js')
const authLogin = require('./controller/auth.controller.js')
const usuarioController = require('./controller/usuario.controller.js')
const produtoController = require('./controller/produto.controller.js')
const estoqueController = require('./controller/estoque.controller.js')
const configController = require('./controller/config.controller.js')
const pedidoController = require('./controller/pedidos.controller.js')
const carrinhoController = require('./controller/carrinho.controller.js')
const cupomController = require('./controller/cupom.controller.js')
const entregaController = require('./controller/entrega.controller.js')

const app = express()
const PORT = process.env.PORTC || 3000
const hostname = 'localhost'

// Middlewares
app.use(cors())
app.use(express.json())

// Rotas publicas
app.get('/', (req, res) => {
    res.send('API Rodando!')
})

// Rotas de autenticação
app.post('/login', authLogin.login)
app.post('/clientes', usuarioController.cadastrar) // CORRIGIDO: estava 'usuario.cadastrar'

//
app.use(authMiddleware) // ROTAS PROTEGIDAS A PARTIR DAQUI
//

// Rotas de Usuários
app.get('/clientes/:id', usuarioController.buscarPorId) // Buscar cliente por ID
app.put('/clientes/:id', usuarioController.atualizar) // Atualizar cliente

app.get('/clientes', usuarioController.listar) // listar clientes
app.delete('/clientes/:id', usuarioController.apagar) // apagar cliente

// Produtos Rotas
app.post('/produtos', produtoController.criar) // criar produto
app.get('/produtos', produtoController.listar) // listar produtos
app.get('/produtos/todos', produtoController.listarTodos) // listar todos os produtos (admin)
app.get('/produtos/:id', produtoController.buscarPorId) // buscar produto por ID
app.put('/produtos/:id', produtoController.atualizar) // atualizar produto
app.patch('/produtos/:id/desativar', produtoController.desativar) // desativar produto
app.patch('/produtos/:id/ativar', produtoController.ativar) // ativar produto
app.delete('/produtos/:id', produtoController.apagar) // apagar produto
app.get('/produtos/tipo/:tipo', produtoController.buscarPorTipo) // buscar produtos por tipo
app.get('/produtos/cor/:cor', produtoController.buscarPorCor) // buscar produtos por cor
app.get('/produtos/promocoes', produtoController.buscarPromocoes) // buscar produtos em promoção

// Estoque Rotas
app.post('/estoque', estoqueController.adicionarEstoque) // adicionar estoque
app.post('/estoque/ajustar', estoqueController.ajustarEstoque) // ajustar estoque
app.get('/estoque', estoqueController.listarTodosEstoques) // listar estoque
app.get('/estoque/baixo', estoqueController.listarEstoqueBaixo) // listar estoque baixo
app.get('/estoque/perido', estoqueController.buscarPorPeriodo) // buscar por período
app.get('/estoque/produto/:id', estoqueController.listarPorProduto) // listar por produto
app.get('/estoque/consultar/:id', estoqueController.consultarEstoque) // consultar estoque atual
app.post('/estoque/saida', estoqueController.registrarSaida) // registrar saída de estoque
app.get('/estoque/historico', estoqueController.listarHistorico) // listar histórico de estoque
app.get('/estoque/quantidade/:id', estoqueController.getQuantidadeAtual) // obter quantidade atual de um produto no estoque

// Config
app.post('/config', configController.salvarConfig) // Salvar Configuração
app.get('/config/usuario/:codUsuario', configController.buscarPorUsuario) // Buscar Config por Usuario
app.get('/config/:codConfig', configController.buscarPorId) // Buscar Config por ID
app.get('/configs', configController.listarTodas) // Listar todas as configs de usuarios
app.get('/configs/estatisticas', configController.obterEstatisticas) // Obter Estaticas de preferencia
app.get('/configs/tema/:tema', configController.buscarPorTema) // Buscar por tema
app.put('/config/tema/:codUsuario', configController.atualizarTema) // atualizar o tema
app.patch('/config/reset/:codUsuario', configController.resetarConfig) // reiniciar o tema
app.delete('/config/:codConfig', configController.deletarConfig) // deletar config por ID
app.delete('/config/usuario/:codUsuario', configController.deletarConfigPorUsuario) // deletar config por usuario

// Pedidos
app.post('/pedidos', pedidoController.criarPedido)
app.get('/pedidos', pedidoController.listarPedidos)
app.get('/pedidos/:id', pedidoController.buscarPorId)
app.get('/pedidos/usuario/:idUsuario', pedidoController.listarPorUsuario)
app.get('/pedidos/status/:status', pedidoController.buscarPorStatus)
app.get('/pedidos/periodo', pedidoController.buscarPorPeriodo)
app.get('/pedidos/estatisticas/geral', pedidoController.obterEstatisticas)
app.put('/pedidos/:id/status', pedidoController.atualizarStatus)
app.put('/pedidos/:id/endereco', pedidoController.atualizarEndereco)
app.put('/pedidos/:id/cupom', pedidoController.aplicarCupom)
app.patch('/pedidos/:id/cancelar', pedidoController.cancelarPedido)

// Carrinho Rotas - ATUALIZADAS para corresponder ao seu controller
app.post('/carrinho/adicionar', carrinhoController.adicionarItem) // Adicionar item ao carrinho
app.get('/carrinho/:idUsuario', carrinhoController.listarItens) // Listar itens do carrinho
app.put('/carrinho/:id', carrinhoController.atualizarQuantidade) // Atualizar quantidade do item no carrinho (CORRIGIDO)
app.delete('/carrinho/:id', carrinhoController.removerItem) // Remover item do carrinho (CORRIGIDO)
app.delete('/limpar/:idUsuario', carrinhoController.limparCarrinho); // Limpar carrinho do usuário
app.get('/carrinho/quantidade/:idUsuario', carrinhoController.getQuantidadeTotal) // Obter quantidade total de itens no carrinho
app.post('/carrinho/moverParaPedido', carrinhoController.moverParaPedido) // Mover itens do carrinho para um pedido
app.get('/carrinho/verificar/:idUsuario', carrinhoController.verificarDisponibilidade) // Verificar disponibilidade dos itens no carrinho

// Rotas de cupons
app.post('/cupons', cupomController.criar) // Criar novo cupom
app.get('/cupons', cupomController.listarTodos) // Listar todos os cupons
app.get('/cupons/:id', cupomController.buscarPorId) // Buscar cupom por ID
app.get('/cupons/codigo/:codigo', cupomController.buscarPorCodigo) // Buscar cupom por código
app.post('/cupons/validar', cupomController.validar) // Validar cupom
app.put('/cupons/:id', cupomController.atualizar) // Atualizar cupom
app.delete('/cupons/:id', cupomController.deletar) // Apagar cupom
app.patch('/cupons/:id/desativar', cupomController.desativar) // Desativar cupom
app.patch('/cupons/:id/ativar', cupomController.ativar) // Ativar cupom
app.get('/cupons/expirados', cupomController.listarExpirados) // Listar cupons expirados
app.get('/cupons/ativos', cupomController.listarAtivos) // Listar cupons ativos
app.get('/cupons/estatisticas', cupomController.obterEstatisticas) // Obter estatísticas de cupons

// Rotas de entrega
app.post('/entregas', entregaController.registrarEntrega) // Criar nova entrega
app.get('/entregas', entregaController.listarTodas) // Listar todas as entregas
app.get('/entregas/:id', entregaController.buscarPorId) // Buscar entrega por ID
app.put('/entregas/:id', entregaController.atualizar) // Atualizar entrega
app.get('/entregas/status/:status', entregaController.listarPorStatus) // Listar entregas por status
app.get('/entregas/atrasadas', entregaController.listarAtrasadas) // Listar entregas atrasadas
app.get('/entregas/estatisticas', entregaController.obterEstatisticas) // Estatísticas de entregas
app.delete('/entregas/:id', entregaController.deletar) // Deletar entrega
app.get('/entregas/pedido/:idPedido', entregaController.buscarPorPedido) // Buscar entrega por ID do pedido
app.get('/entregas/rastreamento/:codigo', entregaController.buscarPorRastreamento) // Buscar entrega por código de rastreamento
app.put('/entregas/:id/status', entregaController.atualizarStatus) // Atualizar status da entrega

// Iniciar o servidor após a conexão com o banco de dados
db.sync()
    .then(() => {
        app.listen(PORT, hostname, () => {
            console.log(`Servidor rodando em http://${hostname}:${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Erro de conexão com o banco de dados!', err)
    })