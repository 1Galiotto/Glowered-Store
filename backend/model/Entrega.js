const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Entrega = db.define('entrega', {
    codEntrega: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idPedido: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'pedidos',
            key: 'codPedido'
        }
    },
    transportadora: {
        type: DataTypes.STRING,
        allowNull: false
    },
    codigoRastreamento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    statusEntrega: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Em trânsito'
    },
    dataEnvio: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    dataEntrega: {
        type: DataTypes.DATE,
        allowNull: true
    }
},{
    tableName: 'entregas',
    timestamps: false
})
module.exports = Entrega
