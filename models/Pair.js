const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const Pair = sequelize.define('pair', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    santaId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    wisherId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

module.exports = Pair