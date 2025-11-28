require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')

const db = require('./db/conn.js')
require('./model/rel.js')

// Importação dos controllers
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

// ------------------------- CONFIG SERVIDOR -------------------------
const PORT = process.env.PORTC || 3000
const HOST = process.env.HOST || 'localhost'
const isProduction = process.env.NODE_ENV === 'production'
// ------------------------------------------------------------------


// -------------------------- MIDDLEWARE -----------------------------
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
// ------------------------------------------------------------------


// -------------------------- ROTAS PÚBLICAS -------------------------
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API Rodando!' })
})

// Rotas de autenticação
app.post('/login', authLogin.login)
app.post('/clientes', usuarioController.cadastrar)
// ------------------------------------------------------------------


// -------------------------- ROTAS PRIVADAS -------------------------
app.use(authMiddleware)

// Rotas de Usuários
app.get('/clientes', usuarioController.listar)
app.get('/clientes/:id', usuarioController.buscarPorId)
app.put('/clientes/:id', usuarioController.atualizar)
app.delete('/clientes/:id', usuarioController.apagar)

// Rotas de Produtos
app.post('/produtos', produtoController.criar)
app.get('/produtos', produtoController.listar)
app.get('/produtos/todos', produtoController.listarTodos)
app.get('/produtos/:id', produtoController.buscarPorId)
app.put('/produtos/:id', produtoController.atualizar)
app.patch('/produtos/:id/desativar', produtoController.desativar)
app.patch('/produtos/:id/ativar', produtoController.ativar)
app.delete('/produtos/:id', produtoController.apagar)
app.get('/produtos/tipo/:tipo', produtoController.buscarPorTipo)
app.get('/produtos/cor/:cor', produtoController.buscarPorCor)
app.get('/produtos/promocoes', produtoController.buscarPromocoes)

// Rotas de Estoque
app.post('/estoque', estoqueController.adicionarEstoque)
app.post('/estoque/ajustar', estoqueController.ajustarEstoque)
app.get('/estoque', estoqueController.listarTodosEstoques)
app.get('/estoque/baixo', estoqueController.listarEstoqueBaixo)
app.get('/estoque/perido', estoqueController.buscarPorPeriodo)
app.get('/estoque/produto/:id', estoqueController.listarPorProduto)
app.get('/estoque/consultar/:id', estoqueController.consultarEstoque)
app.post('/estoque/saida', estoqueController.registrarSaida)
app.get('/estoque/historico', estoqueController.listarHistorico)
app.get('/estoque/quantidade/:id', estoqueController.getQuantidadeAtual)

// Rotas de Configuração
app.post('/config', configController.salvarConfig)
app.get('/config/usuario/:codUsuario', configController.buscarPorUsuario)
app.get('/config/:codConfig', configController.buscarPorId)
app.get('/configs', configController.listarTodas)
app.get('/configs/estatisticas', configController.obterEstatisticas)
app.get('/configs/tema/:tema', configController.buscarPorTema)
app.put('/config/tema/:codUsuario', configController.atualizarTema)
app.patch('/config/reset/:codUsuario', configController.resetarConfig)
app.delete('/config/:codConfig', configController.deletarConfig)
app.delete('/config/usuario/:codUsuario', configController.deletarConfigPorUsuario)

// Rotas de Pedidos
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

// Rotas de Carrinho
app.post('/carrinho/adicionar', carrinhoController.adicionarItem)
app.get('/carrinho/:idUsuario', carrinhoController.listarItens)
app.put('/carrinho/:id', carrinhoController.atualizarQuantidade)
app.delete('/carrinho/:id', carrinhoController.removerItem)
app.delete('/limpar/:idUsuario', carrinhoController.limparCarrinho)
app.get('/carrinho/quantidade/:idUsuario', carrinhoController.getQuantidadeTotal)
app.post('/carrinho/moverParaPedido', carrinhoController.moverParaPedido)
app.get('/carrinho/verificar/:idUsuario', carrinhoController.verificarDisponibilidade)

// Rotas de Cupons
app.post('/cupons', cupomController.criar)
app.get('/cupons', cupomController.listarTodos)
app.get('/cupons/:id', cupomController.buscarPorId)
app.get('/cupons/codigo/:codigo', cupomController.buscarPorCodigo)
app.post('/cupons/validar', cupomController.validar)
app.put('/cupons/:id', cupomController.atualizar)
app.delete('/cupons/:id', cupomController.deletar)
app.patch('/cupons/:id/desativar', cupomController.desativar)
app.patch('/cupons/:id/ativar', cupomController.ativar)
app.get('/cupons/expirados', cupomController.listarExpirados)
app.get('/cupons/ativos', cupomController.listarAtivos)
app.get('/cupons/estatisticas', cupomController.obterEstatisticas)

// Rotas de Entrega
app.post('/entregas', entregaController.registrarEntrega)
app.get('/entregas', entregaController.listarTodas)
app.get('/entregas/:id', entregaController.buscarPorId)
app.put('/entregas/:id', entregaController.atualizar)
app.get('/entregas/status/:status', entregaController.listarPorStatus)
app.get('/entregas/atrasadas', entregaController.listarAtrasadas)
app.get('/entregas/estatisticas', entregaController.obterEstatisticas)
app.delete('/entregas/:id', entregaController.deletar)
app.get('/entregas/pedido/:idPedido', entregaController.buscarPorPedido)
app.get('/entregas/rastreamento/:codigo', entregaController.buscarPorRastreamento)
app.put('/entregas/:id/status', entregaController.atualizarStatus)
// ------------------------------------------------------------------


// ---------------------- INICIALIZAÇÃO DO SERVIDOR ------------------
async function startServer() {
    try {
        if (!isProduction) {
            // Em desenvolvimento: facilitar a vida
            await db.sync({ alter: true })
            console.log('Banco sincronizado (dev) com { alter: true }')
        } else {
            // Em produção: apenas autenticar, nada de alterar tabelas
            await db.authenticate()
            console.log('Banco autenticado (produção)')
        }

        app.listen(PORT, HOST, () => {
            console.log(`Servidor rodando em http://${HOST}:${PORT}`)
        })

    } catch (err) {
        console.error('Erro ao conectar ao banco ou iniciar servidor:', err)
        process.exit(1)
    }
}

startServer()
// ------------------------------------------------------------------