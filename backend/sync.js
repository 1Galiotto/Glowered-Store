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
    Cupom,
    Endereco,
    Favorito
} = require('./model/rel')

// Importar o seed de produtos
const seedProdutos = require('./scripts/seedProdutos')
const seedUsuarios = require('./scripts/seedUsuarios')

async function dataBaseSync(){
    try {
        console.log('🔄 Iniciando sincronização do banco de dados...')

        // Em produção, primeiro dropar todas as tabelas (desabilitando constraints)
        const isProduction = process.env.NODE_ENV === 'production'
        if (isProduction) {
            console.log('🏭 Ambiente de produção detectado - dropando todas as tabelas...')
            await dropAllTables()
        }

        // Sincronizar todas as tabelas
        await conn.sync({ force: false }) // Mudei para false para evitar conflitos
        console.log('✅ Tabelas sincronizadas com sucesso!')

        // Criar produtos automaticamente
        await seedProdutos()
        await seedUsuarios()
        console.log('🎉 Banco de dados inicializado com sucesso!')

    } catch (err) {
        console.error('❌ Erro de sincronização:', err)
    } finally {
        // ⚠️ NÃO feche a conexão aqui - ela precisa ficar aberta para o servidor
        // REMOVA esta linha ou comente:
        // conn.close();
        console.log('✅ Sincronização concluída - conexão mantida aberta')
    }
}

// Função CORRIGIDA para dropar todas as tabelas
async function dropAllTables() {
    try {
        console.log('🔧 Desabilitando verificação de chaves estrangeiras...')

        // Desabilitar verificação de foreign keys
        await conn.query('SET FOREIGN_KEY_CHECKS = 0')

        // Pegar todas as tabelas do banco
        const [tables] = await conn.query('SHOW TABLES')

        if (tables.length > 0) {
            const tableNames = tables.map(row => Object.values(row)[0])

            console.log(`📋 Encontradas ${tableNames.length} tabelas para dropar`)

            // CORREÇÃO: Dropar tabelas UMA POR UMA
            for (const tableName of tableNames) {
                console.log(`🗑️  Dropping table: ${tableName}`)
                await conn.query(`DROP TABLE IF EXISTS \`${tableName}\``)
            }
            console.log(`✅ ${tableNames.length} tabelas dropadas com sucesso`)
        }

        // Reabilitar verificação de foreign keys
        await conn.query('SET FOREIGN_KEY_CHECKS = 1')
        console.log('🔧 Verificação de chaves estrangeiras reabilitada')

    } catch (error) {
        // Garantir que foreign keys sejam reabilitadas mesmo em caso de erro
        try {
            await conn.query('SET FOREIGN_KEY_CHECKS = 1')
        } catch (fkError) {
            console.error('❌ Erro ao reabilitar foreign keys:', fkError.message)
        }
        console.error('❌ Erro ao dropar tabelas:', error)
        throw error
    }
}



// Se este arquivo for executado diretamente
if (require.main === module) {
    dataBaseSync()
}