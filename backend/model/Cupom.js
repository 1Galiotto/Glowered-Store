const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Cupom = db.define('cupom', {
    codCupom: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    descontoPercentual: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    dataValidade: {
        type: DataTypes.DATE,
        allowNull: false
    },
    usoUnico: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
},{
    tableName: 'cupons',
    timestamps: false
})
module.exports = Cupom