const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Usuario = db.define('usuario', {
    codUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    tipo: {
        type: DataTypes.ENUM('admin', 'cliente'),
        allowNull: false,
        defaultValue: 'cliente'
    },
    dataCadastro: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
},{
    tableName: 'usuarios',
    timestamps: false
})

module.exports = Usuario