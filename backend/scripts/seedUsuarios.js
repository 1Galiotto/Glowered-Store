const { Usuario } = require('../model/rel');
const bcrypt = require('bcrypt');

async function seedUsuarios() {
    try {
        console.log('🌱 Iniciando seed de usuários...');

        const usuarios = [
            {
                nome: 'João Vitor Galiotto de Souza',
                email: 'jgaliottodesouza@gmail.com',
                senha: 'senha123', // Será hashada
                telefone: '(11) 99999-9999',
                cpf: '123.456.789-00',
                tipo: 'cliente'
            },
            {
                nome: 'Admin User',
                email: 'admin@glowered.com',
                senha: 'admin123',
                telefone: '(11) 88888-8888',
                cpf: '987.654.321-00',
                tipo: 'admin'
            }
        ];

        let usuariosCriados = 0;

        for (const usuarioData of usuarios) {
            // Verificar se usuário já existe
            const usuarioExistente = await Usuario.findOne({
                where: { email: usuarioData.email }
            });

            if (!usuarioExistente) {
                // Hash da senha
                const saltRounds = 10;
                const hashedSenha = await bcrypt.hash(usuarioData.senha, saltRounds);

                // Criar usuário
                const usuario = await Usuario.create({
                    nome: usuarioData.nome,
                    email: usuarioData.email,
                    senha: hashedSenha,
                    telefone: usuarioData.telefone,
                    cpf: usuarioData.cpf,
                    tipo: usuarioData.tipo,
                    ativo: true
                });

                usuariosCriados++;
                console.log(`✅ ${usuario.nome} criado com sucesso (ID: ${usuario.codUsuario})`);
            } else {
                console.log(`⚠️ ${usuarioData.email} já existe, pulando...`);
            }
        }

        console.log(`🎉 Seed concluído! ${usuariosCriados} usuários criados.`);

    } catch (error) {
        console.error('❌ Erro no seed de usuários:', error);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    seedUsuarios();
}

module.exports = seedUsuarios;
