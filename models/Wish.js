const { DataTypes } = require('sequelize')
const sequelize = require('../database')

const Wish = sequelize.define('wish', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Wish