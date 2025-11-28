const Entrega = require('../model/Entrega');
const Pedido = require('../model/Pedido');
const db = require('../db/conn');
// Criar nova entrega
const criar = async (req, res) => {
    try {
        const { idPedido, transportadora, codigoRastreamento, dataEnvio } = req.body;

        // Validar dados obrigatórios
        if (!idPedido || !transportadora || !codigoRastreamento) {
            return res.status(400).json({
                error: 'ID do pedido, transportadora e código de rastreamento são obrigatórios'
            });
        }

        // Verificar se o pedido existe
        const pedido = await Pedido.findByPk(idPedido);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        // Verificar se já existe entrega para este pedido
        const entregaExistente = await Entrega.findOne({ where: { idPedido } });
        if (entregaExistente) {
            return res.status(400).json({
                error: 'Já existe uma entrega para este pedido'
            });
        }

        const entrega = await Entrega.create({
            idPedido,
            transportadora,
            codigoRastreamento,
            dataEnvio: dataEnvio || new Date()
        });

        res.status(201).json({
            message: 'Entrega criada com sucesso',
            entrega
        });

    } catch (error) {
        console.error('Erro ao criar entrega:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Listar todas as entregas
const listarTodas = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (status) {
            whereClause.statusEntrega = status;
        }

        const { count, rows: entregas } = await Entrega.findAndCountAll({
            where: whereClause,
            include: [{
                model: Pedido,
                attributes: ['codPedido', 'status', 'valorTotal', 'enderecoEntrega'],
                include: [{
                    model: Usuario,
                    attributes: ['nome', 'email']
                }]
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['dataEnvio', 'DESC']]
        });

        res.status(200).json({
            entregas,
            paginacao: {
                paginaAtual: parseInt(page),
                totalPaginas: Math.ceil(count / limit),
                totalEntregas: count,
                entregasPorPagina: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Erro ao listar entregas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Buscar entrega por ID
const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const entrega = await Entrega.findByPk(id, {
            include: [{
                model: Pedido,
                attributes: ['codPedido', 'status', 'valorTotal', 'enderecoEntrega'],
                include: [{
                    model: Usuario,
                    attributes: ['nome', 'email', 'telefone']
                }]
            }]
        });

        if (!entrega) {
            return res.status(404).json({ error: 'Entrega não encontrada' });
        }

        res.status(200).json({ entrega });

    } catch (error) {
        console.error('Erro ao buscar entrega:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Buscar entrega por pedido
const buscarPorPedido = async (req, res) => {
    try {
        const { idPedido } = req.params;

        const entrega = await Entrega.findOne({
            where: { idPedido },
            include: [{
                model: Pedido,
                attributes: ['codPedido', 'status', 'valorTotal', 'enderecoEntrega'],
                include: [{
                    model: Usuario,
                    attributes: ['nome', 'email', 'telefone']
                }]
            }]
        });

        if (!entrega) {
            return res.status(404).json({ error: 'Entrega não encontrada para este pedido' });
        }

        res.status(200).json({ entrega });

    } catch (error) {
        console.error('Erro ao buscar entrega por pedido:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Buscar entrega por código de rastreamento
const buscarPorRastreamento = async (req, res) => {
    try {
        const { codigo } = req.params;

        const entrega = await Entrega.findOne({
            where: { codigoRastreamento: codigo },
            include: [{
                model: Pedido,
                attributes: ['codPedido', 'status', 'valorTotal', 'enderecoEntrega'],
                include: [{
                    model: Usuario,
                    attributes: ['nome', 'email', 'telefone']
                }]
            }]
        });

        if (!entrega) {
            return res.status(404).json({ error: 'Entrega não encontrada' });
        }

        res.status(200).json({ entrega });

    } catch (error) {
        console.error('Erro ao buscar entrega por rastreamento:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}


// Atualizar status da entrega
const atualizarStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statusEntrega } = req.body;

        const statusPermitidos = ['Em trânsito', 'Saiu para entrega', 'Entregue', 'Atrasado', 'Devolvido'];

        if (!statusPermitidos.includes(statusEntrega)) {
            return res.status(400).json({
                error: 'Status inválido',
                statusPermitidos
            });
        }

        const entrega = await Entrega.findByPk(id);
        if (!entrega) {
            return res.status(404).json({ error: 'Entrega não encontrada' });
        }

        // Se status for "Entregue", atualizar data de entrega
        if (statusEntrega === 'Entregue' && entrega.statusEntrega !== 'Entregue') {
            entrega.dataEntrega = new Date();
        }

        entrega.statusEntrega = statusEntrega;
        await entrega.save();

        res.status(200).json({
            message: 'Status da entrega atualizado com sucesso',
            entrega
        });

    } catch (error) {
        console.error('Erro ao atualizar status da entrega:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Registrar entrega (marcar como entregue)
const registrarEntrega = async (req, res) => {
    try {
        const { id } = req.params;

        const entrega = await Entrega.findByPk(id);
        if (!entrega) {
            return res.status(404).json({ error: 'Entrega não encontrada' });
        }

        entrega.statusEntrega = 'Entregue';
        entrega.dataEntrega = new Date();
        await entrega.save();

        res.status(200).json({
            message: 'Entrega registrada com sucesso',
            entrega
        });

    } catch (error) {
        console.error('Erro ao registrar entrega:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Atualizar dados da entrega
const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { transportadora, codigoRastreamento, dataEnvio } = req.body;

        const entrega = await Entrega.findByPk(id);
        if (!entrega) {
            return res.status(404).json({ error: 'Entrega não encontrada' });
        }

        // Atualizar campos
        if (transportadora) entrega.transportadora = transportadora;
        if (codigoRastreamento) entrega.codigoRastreamento = codigoRastreamento;
        if (dataEnvio) entrega.dataEnvio = dataEnvio;

        await entrega.save();

        res.status(200).json({
            message: 'Entrega atualizada com sucesso',
            entrega
        });

    } catch (error) {
        console.error('Erro ao atualizar entrega:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Listar entregas por status
const listarPorStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const statusPermitidos = ['Em trânsito', 'Saiu para entrega', 'Entregue', 'Atrasado', 'Devolvido'];

        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({
                error: 'Status inválido',
                statusPermitidos
            });
        }

        const { count, rows: entregas } = await Entrega.findAndCountAll({
            where: { statusEntrega: status },
            include: [{
                model: Pedido,
                attributes: ['codPedido', 'status', 'valorTotal']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['dataEnvio', 'DESC']]
        });

        res.status(200).json({
            entregas,
            paginacao: {
                paginaAtual: parseInt(page),
                totalPaginas: Math.ceil(count / limit),
                totalEntregas: count,
                entregasPorPagina: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Erro ao listar entregas por status:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Listar entregas atrasadas
const listarAtrasadas = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        // Considera atrasadas as que estão em trânsito há mais de 7 dias
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - 7);

        const { count, rows: entregas } = await Entrega.findAndCountAll({
            where: {
                statusEntrega: 'Em trânsito',
                dataEnvio: {
                    [db.Sequelize.Op.lt]: dataLimite
                }
            },
            include: [{
                model: Pedido,
                attributes: ['codPedido', 'status', 'valorTotal']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['dataEnvio', 'ASC']]
        });

        res.status(200).json({
            entregas,
            paginacao: {
                paginaAtual: parseInt(page),
                totalPaginas: Math.ceil(count / limit),
                totalEntregas: count,
                entregasPorPagina: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Erro ao listar entregas atrasadas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Estatísticas de entregas
const obterEstatisticas = async (req, res) => {
    try {
        const totalEntregas = await Entrega.count();
        const entregues = await Entrega.count({ where: { statusEntrega: 'Entregue' } });
        const emTransito = await Entrega.count({ where: { statusEntrega: 'Em trânsito' } });
        const saiuParaEntrega = await Entrega.count({ where: { statusEntrega: 'Saiu para entrega' } });
        const atrasadas = await Entrega.count({ where: { statusEntrega: 'Atrasado' } });

        // Tempo médio de entrega (apenas para entregues)
        const entregasComData = await Entrega.findAll({
            where: {
                statusEntrega: 'Entregue',
                dataEntrega: { [db.Sequelize.Op.ne]: null }
            },
            attributes: ['dataEnvio', 'dataEntrega']
        });

        let tempoMedioDias = 0;
        if (entregasComData.length > 0) {
            const tempos = entregasComData.map(entrega => {
                const diffTime = Math.abs(new Date(entrega.dataEntrega) - new Date(entrega.dataEnvio));
                return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            });
            tempoMedioDias = tempos.reduce((a, b) => a + b, 0) / tempos.length;
        }

        res.status(200).json({
            estatisticas: {
                totalEntregas,
                status: {
                    entregues,
                    emTransito,
                    saiuParaEntrega,
                    atrasadas,
                    outros: totalEntregas - (entregues + emTransito + saiuParaEntrega + atrasadas)
                },
                tempoMedioEntregaDias: Math.round(tempoMedioDias * 100) / 100
            }
        });

    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Deletar entrega
const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        const entrega = await Entrega.findByPk(id);
        if (!entrega) {
            return res.status(404).json({ error: 'Entrega não encontrada' });
        }

        await entrega.destroy();

        res.status(200).json({
            message: 'Entrega deletada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao deletar entrega:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}


module.exports = {
    criar,
    listarTodas,
    buscarPorId,
    buscarPorPedido,
    buscarPorRastreamento,
    atualizarStatus,
    registrarEntrega,
    atualizar,
    listarPorStatus,
    listarAtrasadas,
    obterEstatisticas,
    deletar
}