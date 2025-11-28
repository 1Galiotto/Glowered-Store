const Cupom = require('../model/Cupom');
const db = require('../db/conn');

// Criar novo cupom
const criar = async (req, res) => {
    try {
        const { codigo, descontoPercentual, dataValidade, usoUnico = true } = req.body;

        // Validar dados obrigatórios
        if (!codigo || !descontoPercentual || !dataValidade) {
            return res.status(400).json({
                error: 'Código, desconto percentual e data de validade são obrigatórios'
            });
        }

        // Validar desconto
        if (descontoPercentual <= 0 || descontoPercentual > 100) {
            return res.status(400).json({
                error: 'Desconto percentual deve estar entre 0 e 100'
            });
        }

        // Validar data de validade
        const dataValidadeObj = new Date(dataValidade);
        if (dataValidadeObj <= new Date()) {
            return res.status(400).json({
                error: 'Data de validade deve ser futura'
            });
        }

        // Verificar se código já existe
        const cupomExistente = await Cupom.findOne({ where: { codigo } });
        if (cupomExistente) {
            return res.status(400).json({
                error: 'Código do cupom já existe'
            });
        }

        const cupom = await Cupom.create({
            codigo: codigo.toUpperCase(),
            descontoPercentual,
            dataValidade: dataValidadeObj,
            usoUnico
        });

        res.status(201).json({
            message: 'Cupom criado com sucesso',
            cupom
        });

    } catch (error) {
        console.error('Erro ao criar cupom:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Listar todos os cupons (com paginação)
const listarTodos = async (req, res) => {
    try {
        const { page = 1, limit = 10, ativo } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (ativo !== undefined) {
            whereClause.ativo = ativo === 'true';
        }

        const { count, rows: cupons } = await Cupom.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['dataValidade', 'ASC']]
        });

        res.status(200).json({
            cupons,
            paginacao: {
                paginaAtual: parseInt(page),
                totalPaginas: Math.ceil(count / limit),
                totalCupons: count,
                cuponsPorPagina: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Erro ao listar cupons:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Buscar cupom por ID
const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const cupom = await Cupom.findByPk(id);
        if (!cupom) {
            return res.status(404).json({ error: 'Cupom não encontrado' });
        }

        res.status(200).json({ cupom });

    } catch (error) {
        console.error('Erro ao buscar cupom:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Buscar cupom por código
const buscarPorCodigo = async (req, res) => {
    try {
        const { codigo } = req.params;

        const cupom = await Cupom.findOne({
            where: {
                codigo: codigo.toUpperCase()
            }
        });

        if (!cupom) {
            return res.status(404).json({ error: 'Cupom não encontrado' });
        }

        // Verificar se cupom está ativo
        if (!cupom.ativo) {
            return res.status(400).json({ error: 'Cupom inativo' });
        }

        // Verificar validade
        if (new Date() > new Date(cupom.dataValidade)) {
            return res.status(400).json({ error: 'Cupom expirado' });
        }

        res.status(200).json({
            cupom,
            valido: true,
            mensagem: 'Cupom válido'
        });

    } catch (error) {
        console.error('Erro ao buscar cupom por código:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Validar cupom
const validar = async (req, res) => {
    try {
        const { codigo } = req.body;

        if (!codigo) {
            return res.status(400).json({ error: 'Código do cupom é obrigatório' });
        }

        const cupom = await Cupom.findOne({
            where: {
                codigo: codigo.toUpperCase()
            }
        });

        if (!cupom) {
            return res.status(404).json({
                valido: false,
                error: 'Cupom não encontrado'
            });
        }

        // Verificar se cupom está ativo
        if (!cupom.ativo) {
            return res.status(200).json({
                valido: false,
                error: 'Cupom inativo'
            });
        }

        // Verificar validade
        if (new Date() > new Date(cupom.dataValidade)) {
            return res.status(200).json({
                valido: false,
                error: 'Cupom expirado'
            });
        }

        res.status(200).json({
            valido: true,
            cupom: {
                codCupom: cupom.codCupom,
                codigo: cupom.codigo,
                descontoPercentual: cupom.descontoPercentual,
                usoUnico: cupom.usoUnico,
                dataValidade: cupom.dataValidade
            },
            mensagem: 'Cupom válido'
        });

    } catch (error) {
        console.error('Erro ao validar cupom:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Atualizar cupom
const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { codigo, descontoPercentual, dataValidade, usoUnico, ativo } = req.body;

        const cupom = await Cupom.findByPk(id);
        if (!cupom) {
            return res.status(404).json({ error: 'Cupom não encontrado' });
        }

        // Validar desconto se fornecido
        if (descontoPercentual && (descontoPercentual <= 0 || descontoPercentual > 100)) {
            return res.status(400).json({
                error: 'Desconto percentual deve estar entre 0 e 100'
            });
        }

        // Validar data de validade se fornecida
        if (dataValidade && new Date(dataValidade) <= new Date()) {
            return res.status(400).json({
                error: 'Data de validade deve ser futura'
            });
        }

        // Verificar se código já existe (se for alterado)
        if (codigo && codigo !== cupom.codigo) {
            const cupomExistente = await Cupom.findOne({ where: { codigo } });
            if (cupomExistente) {
                return res.status(400).json({
                    error: 'Código do cupom já existe'
                });
            }
            cupom.codigo = codigo.toUpperCase();
        }

        // Atualizar campos
        if (descontoPercentual !== undefined) cupom.descontoPercentual = descontoPercentual;
        if (dataValidade !== undefined) cupom.dataValidade = dataValidade;
        if (usoUnico !== undefined) cupom.usoUnico = usoUnico;
        if (ativo !== undefined) cupom.ativo = ativo;

        await cupom.save();

        res.status(200).json({
            message: 'Cupom atualizado com sucesso',
            cupom
        });

    } catch (error) {
        console.error('Erro ao atualizar cupom:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Desativar cupom
const desativar = async (req, res) => {
    try {
        const { id } = req.params;

        const cupom = await Cupom.findByPk(id);
        if (!cupom) {
            return res.status(404).json({ error: 'Cupom não encontrado' });
        }

        cupom.ativo = false;
        await cupom.save();

        res.status(200).json({
            message: 'Cupom desativado com sucesso',
            cupom
        });

    } catch (error) {
        console.error('Erro ao desativar cupom:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Ativar cupom
const ativar = async (req, res) => {
    try {
        const { id } = req.params;

        const cupom = await Cupom.findByPk(id);
        if (!cupom) {
            return res.status(404).json({ error: 'Cupom não encontrado' });
        }

        cupom.ativo = true;
        await cupom.save();

        res.status(200).json({
            message: 'Cupom ativado com sucesso',
            cupom
        });

    } catch (error) {
        console.error('Erro ao ativar cupom:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Deletar cupom
const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        const cupom = await Cupom.findByPk(id);
        if (!cupom) {
            return res.status(404).json({ error: 'Cupom não encontrado' });
        }

        await cupom.destroy();

        res.status(200).json({
            message: 'Cupom deletado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao deletar cupom:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Listar cupons expirados
const listarExpirados = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows: cupons } = await Cupom.findAndCountAll({
            where: {
                dataValidade: {
                    [db.Sequelize.Op.lt]: new Date()
                }
            },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['dataValidade', 'DESC']]
        });

        res.status(200).json({
            cupons,
            paginacao: {
                paginaAtual: parseInt(page),
                totalPaginas: Math.ceil(count / limit),
                totalCupons: count,
                cuponsPorPagina: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Erro ao listar cupons expirados:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Listar cupons ativos
const listarAtivos = async (req, res) => {
    try {
        const cupons = await Cupom.findAll({
            where: {
                ativo: true,
                dataValidade: {
                    [Op.gt]: new Date() // Apenas cupons não expirados
                }
            },
            order: [['dataValidade', 'ASC']]
        });

        res.json(cupons);
    } catch (error) {
        console.error('Erro ao listar cupons ativos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Estatísticas de cupons
const obterEstatisticas = async (req, res) => {
    try {
        const totalCupons = await Cupom.count();
        const cuponsAtivos = await Cupom.count({ where: { ativo: true } });
        const cuponsExpirados = await Cupom.count({
            where: {
                dataValidade: {
                    [Op.lt]: new Date()
                }
            }
        });

        res.json({
            totalCupons,
            cuponsAtivos,
            cuponsExpirados,
            cuponsInativos: totalCupons - cuponsAtivos - cuponsExpirados
        });
    } catch (error) {
        console.error('Erro ao obter estatísticas de cupons:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};



module.exports = {
    criar,
    listarTodos,
    buscarPorId,
    buscarPorCodigo,
    validar,
    atualizar,
    desativar,
    ativar,
    deletar,
    listarExpirados,
    listarAtivos,
    obterEstatisticas
}