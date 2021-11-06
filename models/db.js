const Sequelize = require('sequelize')
const sequelize = new Sequelize('talkchat', 'root', 'vsb.91312', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}