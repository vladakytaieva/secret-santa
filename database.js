const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('santa-db', '', '', {
  dialect: 'sqlite',
  host: './santa.sqlite',
  define: {
    timestamps: false
  }
})

module.exports = sequelize