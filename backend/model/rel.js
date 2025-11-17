const Carrinho = require('./Carrinho')
const Usuario = require('./Usuario')
const Produto = require('./Produto')
const Pedido = require('./Pedido')
const Entrega = require('./Entrega')
const Pagamento = require('./Pagamento')
const Estoque = require('./Estoque')
const Config = require('./Config')
const Cupom = require('./Cupom')

// Relações entre Usuario e Carrinho
Usuario.hasOne(Carrinho, { foreignKey: 'usuarioId', onDelete: 'CASCADE' })
Carrinho.belongsTo(Usuario, { foreignKey: 'usuarioId' })

// Relações entre Usuario e Pedido
Usuario.hasMany(Pedido, { foreignKey: 'usuarioId', onDelete: 'CASCADE' })
Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId' })

// Relações entre Pedido e Entrega
Pedido.hasOne(Entrega, { foreignKey: 'pedidoId', onDelete: 'CASCADE' })
Entrega.belongsTo(Pedido, { foreignKey: 'pedidoId' })

// Relações entre Pedido e Pagamento
Pedido.hasOne(Pagamento, { foreignKey: 'pedidoId', onDelete: 'CASCADE' })
Pagamento.belongsTo(Pedido, { foreignKey: 'pedidoId' })

// Relações entre Produto e Estoque
Produto.hasOne(Estoque, { foreignKey: 'produtoId', onDelete: 'CASCADE' })
Estoque.belongsTo(Produto, { foreignKey: 'produtoId' })

// Relações entre Usuario e Cupom
Usuario.hasMany(Cupom, { foreignKey: 'usuarioId', onDelete: 'CASCADE' })
Cupom.belongsTo(Usuario, { foreignKey: 'usuarioId' })

module.exports = {
    Carrinho,
    Usuario,
    Produto,
    Pedido,
    Entrega,
    Pagamento,
    Estoque,
    Config,
    Cupom
}
