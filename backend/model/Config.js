const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Config = db.define('config', {
    codConfig: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'codUsuario'
        }
    },
    temaPagina: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'claro'
    },
},{
    tableName: 'configs',
    timestamps: false
})
module.exports = Config