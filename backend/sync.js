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

// Importar o seed de produtos
const seedProdutos = require('./scripts/seedProdutos')

async function dataBaseSync(){
    try {
        console.log('🔄 Iniciando sincronização do banco de dados...')
        
        // Sincronizar todas as tabelas
        await conn.sync({ force: true })
        console.log('✅ Tabelas sincronizadas com sucesso!')
        
        // Criar usuário admin padrão
        await criarUsuarioAdmin()
        
        // Criar produtos automaticamente
        await seedProdutos()
        
        console.log('🎉 Banco de dados inicializado com sucesso!')
        
    } catch (err) {
        console.error('❌ Erro de sincronização:', err) 
    } finally {
        // ⚠️ NÃO feche a conexão aqui - ela precisa ficar aberta para o servidor
        conn.close(); 
        console.log('🔒 Conexão com o banco de dados fechada.')
    }
}

// Criar usuário admin padrão
async function criarUsuarioAdmin() {
    try {
        const adminExists = await Usuario.findOne({ where: { email: 'admin@glowered.com' } })
        
        if (!adminExists) {
            await Usuario.create({
                nome: 'Administrador Glowered',
                email: 'admin@glowered.com',
                senha: 'admin123', // Em produção, usar hash!
                telefone: '(11) 99999-9999',
                cpf: '123.456.789-00',
                tipo: 'admin',
                ativo: true
            })
            console.log('👤 Usuário admin criado: admin@glowered.com / admin123')
        } else {
            console.log('👤 Usuário admin já existe')
        }
    } catch (error) {
        console.error('❌ Erro ao criar usuário admin:', error)
    }
}

dataBaseSync()