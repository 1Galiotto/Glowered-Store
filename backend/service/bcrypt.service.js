const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10

// gera um hash seguro para a senha
async function hashPassword(password){
    return await bcrypt.hash(password,SALT_ROUNDS)
}
// compara uma senha com o hash armazenado
async function comparePassword(password, hash){
    return await bcrypt.compare(password, hash)
}

module.exports = { hashPassword, comparePassword }