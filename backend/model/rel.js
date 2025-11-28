// models/rel.js - VERSÃO CORRIGIDA
const Carrinho = require('./Carrinho');
const Usuario = require('./Usuario');
const Produto = require('./Produto');
const Pedido = require('./Pedido');
const Entrega = require('./Entrega');
const Pagamento = require('./Pagamento');
const Estoque = require('./Estoque');
const Config = require('./Config');
const Cupom = require('./Cupom');

// 🔥 ASSOCIAÇÕES CORRIGIDAS - USANDO NOMES CONSISTENTES

// Produto <-> Estoque - CORRIGIDO
Produto.hasMany(Estoque, {
    foreignKey: 'idProduto',
    sourceKey: 'codProduto', // ← CORRETO
    onDelete: 'CASCADE',
    as: 'estoques'
});

Estoque.belongsTo(Produto, {
    foreignKey: 'idProduto',
    targetKey: 'codProduto', // ← CORRETO
    as: 'produto'
});

// Usuario <-> Carrinho - CORRIGIDO
Usuario.hasMany(Carrinho, {
    foreignKey: 'idUsuario',
    sourceKey: 'codUsuario', // ← ADICIONE sourceKey
    onDelete: 'CASCADE',
    as: 'carrinhos'
});

Carrinho.belongsTo(Usuario, {
    foreignKey: 'idUsuario',
    targetKey: 'codUsuario', // ← ADICIONE targetKey
    as: 'usuario'
});

// Produto <-> Carrinho - CORRIGIDO
Produto.hasMany(Carrinho, {
    foreignKey: 'idProduto',
    sourceKey: 'codProduto', // ← CORRETO
    onDelete: 'CASCADE',
    as: 'carrinhos'
});

Carrinho.belongsTo(Produto, {
    foreignKey: 'idProduto',
    targetKey: 'codProduto', // ← CORRETO
    as: 'produto'
});

// Usuario <-> Pedido - CORRIGIDO
Usuario.hasMany(Pedido, {
    foreignKey: 'idUsuario',
    sourceKey: 'codUsuario', // ← ADICIONE sourceKey
    onDelete: 'CASCADE',
    as: 'pedidos'
});

Pedido.belongsTo(Usuario, {
    foreignKey: 'idUsuario',
    targetKey: 'codUsuario', // ← ADICIONE targetKey
    as: 'usuario'
});

// Pedido <-> Entrega - CORRIGIDO (ATENÇÃO AQUI!)
Pedido.hasOne(Entrega, {
    foreignKey: 'idPedido',
    sourceKey: 'codPedido', // ← MUDEI PARA codPedido (primary key real)
    onDelete: 'CASCADE',
    as: 'entrega'
});

Entrega.belongsTo(Pedido, {
    foreignKey: 'idPedido',
    targetKey: 'codPedido', // ← MUDEI PARA codPedido (primary key real)
    as: 'pedido'
});

// Pedido <-> Pagamento - CORRIGIDO
Pedido.hasOne(Pagamento, {
    foreignKey: 'idPedido',
    sourceKey: 'codPedido', // ← MUDEI PARA codPedido
    onDelete: 'CASCADE',
    as: 'pagamento'
});

Pagamento.belongsTo(Pedido, {
    foreignKey: 'idPedido',
    targetKey: 'codPedido', // ← MUDEI PARA codPedido
    as: 'pedido'
});

// Usuario <-> Config - CORRIGIDO
Usuario.hasOne(Config, {
    foreignKey: 'codUsuario',
    sourceKey: 'codUsuario', // ← ADICIONE sourceKey
    onDelete: 'CASCADE',
    as: 'config'
});

Config.belongsTo(Usuario, {
    foreignKey: 'codUsuario',
    targetKey: 'codUsuario', // ← ADICIONE targetKey
    as: 'usuario'
});

// Cupom <-> Pedido - CORRIGIDO
Cupom.hasMany(Pedido, {
    foreignKey: 'idCupom',
    sourceKey: 'codCupom', // ← MUDEI PARA codCupom (assumindo que é a PK)
    onDelete: 'SET NULL',
    as: 'pedidos'
});

Pedido.belongsTo(Cupom, {
    foreignKey: 'idCupom',
    targetKey: 'codCupom', // ← MUDEI PARA codCupom (assumindo que é a PK)
    as: 'cupom'
});

// Usuario <-> Cupom - CORRIGIDO
Usuario.hasMany(Cupom, {
    foreignKey: 'idUsuario',
    sourceKey: 'codUsuario', // ← ADICIONE sourceKey
    onDelete: 'CASCADE',
    as: 'cupons'
});

Cupom.belongsTo(Usuario, {
    foreignKey: 'idUsuario',
    targetKey: 'codUsuario', // ← ADICIONE targetKey
    as: 'usuario'
});

console.log('✅ Associações configuradas e corrigidas!');

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
};