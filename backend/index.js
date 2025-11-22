require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./db/conn') 
// Importa a conexão com o banco de dados
const authLogin = require('./controller/auth.controller.js')
const usuarioController = require('./controller/usuario.controller.js')
const authMiddleware = require('./middleware/auth.middleware.js')
const produtoController = require('./controller/produto.controller.js')
const estoqueController = require('./controller/estoque.controller.js')
const configController = require('./controller/config.controller.js')
const pedidoController = require('./controller/pedidos.controller.js')

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
app.post('/clientes', usuario.cadastrar)

//
app.use(authMiddleware) // ROTAS PROTEGIDAS A PARTIR DAQUI
//

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

router.post('/config', configController.salvarConfig) // Salvar Configuração
router.get('/config/usuario/:codUsuario', configController.buscarPorUsuario) // Buscar Config por Usuario
router.get('/config/:codConfig', configController.buscarPorId) // Buscar Config por ID
router.get('/configs', configController.listarTodas) // Listar todas as configs de usuarios
router.get('/configs/estatisticas', configController.obterEstatisticas) // Obter Estaticas de preferencia
router.get('/configs/tema/:tema', configController.buscarPorTema) // Buscar por tema
router.put('/config/tema/:codUsuario', configController.atualizarTema) // atualizar o tema
router.patch('/config/reset/:codUsuario', configController.resetarConfig) // reiniciar o tema
router.delete('/config/:codConfig', configController.deletarConfig) // deletar config por ID
router.delete('/config/usuario/:codUsuario', configController.deletarConfigPorUsuario) // deletar config por usuario


// Pedidos

router.post('/pedidos', pedidoController.criarPedido)
router.get('/pedidos', pedidoController.listarPedidos)
router.get('/pedidos/:id', pedidoController.buscarPorId)
router.get('/pedidos/usuario/:idUsuario', pedidoController.listarPorUsuario)
router.get('/pedidos/status/:status', pedidoController.buscarPorStatus)
router.get('/pedidos/periodo', pedidoController.buscarPorPeriodo)
router.get('/pedidos/estatisticas/geral', pedidoController.obterEstatisticas)
router.put('/pedidos/:id/status', pedidoController.atualizarStatus)
router.put('/pedidos/:id/endereco', pedidoController.atualizarEndereco)
router.put('/pedidos/:id/cupom', pedidoController.aplicarCupom)
router.patch('/pedidos/:id/cancelar', pedidoController.cancelarPedido)


// Iniciar o servidor após a conexão com o banco de dados
db.sync()
.then(()=>{
    app.listen(PORT, hostname, ()=>{
        console.log(`Servidor rodando em http://${hostname}:${PORT}`)
    })
})
.catch((err)=>{
    console.error('Erro de conexão com o banco de dados!',err)
})

// to do:
// sistema de login: 1
// CRUD CARRINHO: 0
// CRUD CONFIG: 1
// CRUD CUPOM: 0
// CRUD ENTREGA: 0
// CRUD ESTOQUE: 0
// CRUD PAGAMENTO: 0
// CRUD PEDIDO: 1
// CRUD PRODUTO: 1