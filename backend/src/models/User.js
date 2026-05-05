const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const Usuario = db.define('Usuario', {
    id_usuario:{
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    nome:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    idade:{
        type: DataTypes.INTEGER,
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false,
        unique: true
    },
    senha:{
        type: DataTypes.STRING(255),
        allowNull: false
    }
},
 {
  tableName: 'Usuario',
  timestamps: false
})

module.exports = Usuario