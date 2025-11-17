const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Pedido = db.define('pedido', {
    codPedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'codUsuario'
        }
    },
    idCupom: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'cupons',
            key: 'codCupom'
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pendente'
    },
    valorTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    dataPedido: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    enderecoEntrega: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    tableName: 'pedidos',
    timestamps: false
})
module.exports = Pedido