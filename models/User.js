const { DataTypes } = require('sequelize')
const sequelize = require('../database')
const Wish = require('./Wish')

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

User.hasMany(Wish)

module.exports = User