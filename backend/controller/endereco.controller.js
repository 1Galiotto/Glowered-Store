const Endereco = require('../model/Endereco');

// Criar novo endereço
const criar = async (req, res) => {
    try {
        const { idUsuario, nome, cep, rua, numero, complemento, bairro, cidade, estado, principal } = req.body;

        // Validações básicas
        if (!idUsuario || !cep || !rua || !numero || !bairro || !cidade || !estado) {
            return res.status(400).json({
                error: 'Campos obrigatórios: idUsuario, cep, rua, numero, bairro, cidade, estado'
            });
        }

        // Se for o primeiro endereço ou marcado como principal, definir como principal
        let enderecoPrincipal = principal;
        if (principal !== false) {
            // Verificar se já existe endereço principal para este usuário
            const enderecoExistente = await Endereco.findOne({
                where: { idUsuario, principal: true, ativo: true }
            });

            if (!enderecoExistente) {
                enderecoPrincipal = true;
            }
        }

        const novoEndereco = await Endereco.create({
            idUsuario,
            nome: nome || 'Endereço Principal',
            cep,
            rua,
            numero,
            complemento: complemento || null,
            bairro,
            cidade,
            estado: estado.toUpperCase(),
            principal: enderecoPrincipal,
            ativo: true
        });

        console.log('✅ Endereço criado:', novoEndereco.codEndereco);
        res.status(201).json(novoEndereco);

    } catch (error) {
        console.error('❌ Erro ao criar endereço:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Listar endereços por usuário
const listarPorUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params;

        if (!idUsuario) {
            return res.status(400).json({ error: 'ID do usuário é obrigatório' });
        }

        const enderecos = await Endereco.findAll({
            where: {
                idUsuario: parseInt(idUsuario),
                ativo: true
            },
            order: [
                ['principal', 'DESC'], // Endereços principais primeiro
                ['dataCriacao', 'DESC']
            ]
        });

        res.status(200).json(enderecos);

    } catch (error) {
        console.error('❌ Erro ao listar endereços:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Buscar endereço por ID
const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const endereco = await Endereco.findByPk(id);

        if (!endereco || !endereco.ativo) {
            return res.status(404).json({ error: 'Endereço não encontrado' });
        }

        res.status(200).json(endereco);

    } catch (error) {
        console.error('❌ Erro ao buscar endereço:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Atualizar endereço
const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, cep, rua, numero, complemento, bairro, cidade, estado, principal } = req.body;

        const endereco = await Endereco.findByPk(id);

        if (!endereco || !endereco.ativo) {
            return res.status(404).json({ error: 'Endereço não encontrado' });
        }

        // Se estiver marcando como principal, desmarcar outros
        if (principal === true) {
            await Endereco.update(
                { principal: false },
                {
                    where: {
                        idUsuario: endereco.idUsuario,
                        codEndereco: { [require('sequelize').Op.ne]: id }
                    }
                }
            );
        }

        await endereco.update({
            nome: nome || endereco.nome,
            cep: cep || endereco.cep,
            rua: rua || endereco.rua,
            numero: numero || endereco.numero,
            complemento: complemento !== undefined ? complemento : endereco.complemento,
            bairro: bairro || endereco.bairro,
            cidade: cidade || endereco.cidade,
            estado: estado ? estado.toUpperCase() : endereco.estado,
            principal: principal !== undefined ? principal : endereco.principal
        });

        console.log('✅ Endereço atualizado:', id);
        res.status(200).json(endereco);

    } catch (error) {
        console.error('❌ Erro ao atualizar endereço:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Deletar endereço (soft delete)
const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        const endereco = await Endereco.findByPk(id);

        if (!endereco || !endereco.ativo) {
            return res.status(404).json({ error: 'Endereço não encontrado' });
        }

        // Se for o endereço principal, não permitir deletar
        if (endereco.principal) {
            return res.status(400).json({
                error: 'Não é possível deletar o endereço principal. Defina outro endereço como principal primeiro.'
            });
        }

        await endereco.update({ ativo: false });

        console.log('✅ Endereço deletado:', id);
        res.status(200).json({ message: 'Endereço removido com sucesso' });

    } catch (error) {
        console.error('❌ Erro ao deletar endereço:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

module.exports = {
    criar,
    listarPorUsuario,
    buscarPorId,
    atualizar,
    deletar
};
