const db = require('./db')

const saveUser = db.sequelize.define('user', {
    avatar:{
        type: db.Sequelize.STRING
    },
    nick:{
        type: db.Sequelize.STRING
    },
    email:{
        type: db.Sequelize.STRING
    },
    password:{
        type: db.Sequelize.STRING
    }
})
module.exports = saveUser