const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Pagamento = db.define('pagamento', {
    codPagamento: {
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
    metodo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pendente'
    },
    dataPagamento: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    valor: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
},{
    tableName: 'pagamentos',
    timestamps: false
})
module.exports = Pagamento