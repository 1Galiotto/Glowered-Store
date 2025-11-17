require('dotenv').config()
console.log('DB_USER:', process.env.DB_USER);
console.log('DATABASE:', process.env.DATABASE);
console.log('HOST:', process.env.HOST);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'undefined');
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.HOST,
    dialect: 'mysql',
    port: 3306
}
)

sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o DATABASE realizada (conn.js).')
    })
    .catch(err => {
        console.error('Erro ao conectar com o banco (conn.js):', err)
    })
module.exports = sequelize