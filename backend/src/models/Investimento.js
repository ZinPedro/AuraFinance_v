const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Investimento = db.define('Investimento', {

    id_investimento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    id_tipoinvestimento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    nome_ativo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    quantidade: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: false
    },

    preco_medio: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },

    valor_atual: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },

    data_compra: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    simulacao: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    tableName: 'investimento',
    timestamps: false
})

module.exports = Investimento