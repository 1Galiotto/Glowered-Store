const { verifyToken } = require('../service/jwt.service')

function authMiddleware(req, res, next){
    const authHeader = req.headers['authorization']
    console.log('Auth Header: ', authHeader)

    if(!authHeader){
        return res.status(401).json({error: 'Token não fornecido!'})
    }

    const token = authHeader.split(' ')[1]
    console.log('Token extraído: ', token)

    const payload = verifyToken(token)
    console.log('Payload retornado pelo jwt: ', payload)

    if(!payload){
        return res.status(403).json({ error: 'Token inválido ou inexistente!'})
    }

    req.user = payload
    next()
}

module.exports = authMiddleware