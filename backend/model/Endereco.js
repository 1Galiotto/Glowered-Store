const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const Endereco = db.define('endereco', {
    codEndereco: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'codUsuario'
        }
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nome do endereço (ex: Casa, Trabalho)'
    },
    cep: {
        type: DataTypes.STRING(9),
        allowNull: false,
        comment: 'CEP no formato 00000-000'
    },
    rua: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    numero: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    complemento: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    bairro: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cidade: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING(2),
        allowNull: false,
        comment: 'UF do estado (2 letras)'
    },
    principal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Se é o endereço principal do usuário'
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'enderecos',
    timestamps: true,
    createdAt: 'dataCriacao',
    updatedAt: 'dataAtualizacao'
});

module.exports = Endereco;
