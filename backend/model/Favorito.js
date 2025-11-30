const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const Favorito = db.define('Favorito', {
    codFavorito: {
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
    idProduto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'produtos',
            key: 'codProduto'
        }
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'Favoritos',
    timestamps: true,
    createdAt: 'dataCriacao',
    updatedAt: 'dataAtualizacao',
    indexes: [
        {
            unique: true,
            fields: ['idUsuario', 'idProduto'],
            name: 'unique_usuario_produto_favorito'
        }
    ]
});

module.exports = Favorito;
