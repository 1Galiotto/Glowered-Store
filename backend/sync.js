const conn = require('./db/conn')
const {
    Carrinho,
    Usuario,
    Produto,
    Pedido,
    Entrega,
    Pagamento,
    Estoque,
    Config,
    Cupom
} = require('./model/rel')

async function dataBaseSync(){
    try {
        await conn.sync({force: true})
        console.log('sincronizadas as tabelas!')
    } catch (err) {
        console.error('Erro de sincronização!') 
    }finally{
        await conn.close()
        console.log('fechando o banco de dados')
    }
}

dataBaseSync()