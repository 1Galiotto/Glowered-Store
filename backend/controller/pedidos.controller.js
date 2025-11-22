const Pedido = require('../model/Pedido.js')
const Usuario = require('../model/Usuario.js')
const Cupom = require('../model/Cupom.js')
const Carrinho = require('../model/Carrinho.js')
const Produto = require('../model/Produto.js')
const Estoque = require('../model/Estoque.js')
const Entrega = require('../model/Entrega.js')
const Pagamento = require('../model/Pagamento.js')
const { Op } = require('sequelize')

// Criar novo pedido
const criarPedido = async (req, res) => {
    const { idUsuario, idCupom, valorTotal, enderecoEntrega, itens } = req.body

    // Validações básicas
    if (!idUsuario || !valorTotal || !enderecoEntrega || !itens || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: "Usuário, valor total, endereço e itens são obrigatórios!" })
    }

    if (valorTotal <= 0) {
        return res.status(400).json({ error: "Valor total deve ser maior que zero!" })
    }

    try {
        // Verificar se usuário existe
        const usuario = await Usuario.findByPk(idUsuario)
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado!" })
        }

        // Verificar cupom se fornecido
        let cupom = null
        if (idCupom) {
            cupom = await Cupom.findByPk(idCupom)
            if (!cupom) {
                return res.status(404).json({ error: "Cupom não encontrado!" })
            }
            if (!cupom.ativo) {
                return res.status(400).json({ error: "Cupom não está ativo!" })
            }
            if (new Date() > new Date(cupom.dataValidade)) {
                return res.status(400).json({ error: "Cupom expirado!" })
            }
        }

        // Verificar estoque dos produtos
        for (const item of itens) {
            const produto = await Produto.findByPk(item.idProduto)
            if (!produto) {
                return res.status(404).json({ error: `Produto ${item.idProduto} não encontrado!` })
            }
            if (!produto.ativo) {
                return res.status(400).json({ error: `Produto ${produto.nome} não está ativo!` })
            }

            const estoqueAtual = await Estoque.sum('quantidade', {
                where: { idProduto: item.idProduto }
            }) || 0

            if (estoqueAtual < item.quantidade) {
                return res.status(400).json({ 
                    error: `Estoque insuficiente para o produto ${produto.nome}!`,
                    produto: produto.nome,
                    estoqueDisponivel: estoqueAtual,
                    quantidadeSolicitada: item.quantidade
                })
            }
        }

        // Criar pedido
        const pedido = await Pedido.create({
            idUsuario: idUsuario,
            idCupom: idCupom || null,
            valorTotal: valorTotal,
            enderecoEntrega: enderecoEntrega,
            status: 'Pendente'
        })

        // Atualizar estoque e registrar saídas
        for (const item of itens) {
            await Estoque.create({
                idProduto: item.idProduto,
                quantidade: -item.quantidade,
                movimentacao: `Venda - Pedido #${pedido.codPedido}`
            })

            // Limpar carrinho do usuário para esses produtos
            await Carrinho.destroy({
                where: { 
                    idUsuario: idUsuario,
                    idProduto: item.idProduto 
                }
            })
        }

        // Marcar cupom como usado se for de uso único
        if (cupom && cupom.usoUnico) {
            await cupom.update({ ativo: false })
        }

        res.status(201).json({
            message: 'Pedido criado com sucesso!',
            pedido: pedido,
            numeroPedido: pedido.codPedido
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar pedido" })
        console.error("Erro ao criar pedido", err)
    }
}

// Listar todos os pedidos
const listarPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [
                {
                    model: Usuario,
                    attributes: ['nome', 'email']
                },
                {
                    model: Cupom,
                    attributes: ['codigo', 'descontoPercentual']
                }
            ],
            order: [['dataPedido', 'DESC']]
        })
        
        res.status(200).json(pedidos)
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar pedidos" })
        console.error("Erro ao listar pedidos", err)
    }
}

// Buscar pedido por ID
const buscarPorId = async (req, res) => {
    const id = req.params.id
    
    try {
        const pedido = await Pedido.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    attributes: ['nome', 'email', 'telefone']
                },
                {
                    model: Cupom,
                    attributes: ['codigo', 'descontoPercentual']
                },
                {
                    model: Entrega,
                    attributes: ['transportadora', 'codigoRastreamento', 'statusEntrega', 'dataEnvio', 'dataEntrega']
                },
                {
                    model: Pagamento,
                    attributes: ['metodo', 'status', 'valor', 'dataPagamento']
                }
            ]
        })
        
        if (!pedido) {
            return res.status(404).json({ error: "Pedido não encontrado!" })
        }
        
        res.status(200).json(pedido)
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar pedido" })
        console.error("Erro ao buscar pedido", err)
    }
}

// Listar pedidos por usuário
const listarPorUsuario = async (req, res) => {
    const idUsuario = req.params.idUsuario
    
    try {
        // Verificar se usuário existe
        const usuario = await Usuario.findByPk(idUsuario)
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado!" })
        }

        const pedidos = await Pedido.findAll({
            where: { idUsuario: idUsuario },
            include: [
                {
                    model: Cupom,
                    attributes: ['codigo', 'descontoPercentual']
                },
                {
                    model: Entrega,
                    attributes: ['transportadora', 'codigoRastreamento', 'statusEntrega']
                },
                {
                    model: Pagamento,
                    attributes: ['metodo', 'status']
                }
            ],
            order: [['dataPedido', 'DESC']]
        })
        
        res.status(200).json({
            usuario: {
                codUsuario: usuario.codUsuario,
                nome: usuario.nome
            },
            pedidos: pedidos,
            totalPedidos: pedidos.length
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar pedidos do usuário" })
        console.error("Erro ao listar pedidos do usuário", err)
    }
}

// Atualizar status do pedido
const atualizarStatus = async (req, res) => {
    const id = req.params.id
    const { status } = req.body

    const statusPermitidos = ['Pendente', 'Confirmado', 'Preparando', 'Enviado', 'Entregue', 'Cancelado']
    
    if (!status || !statusPermitidos.includes(status)) {
        return res.status(400).json({ 
            error: "Status é obrigatório e deve ser: " + statusPermitidos.join(', ')
        })
    }

    try {
        const pedido = await Pedido.findByPk(id)
        
        if (!pedido) {
            return res.status(404).json({ error: "Pedido não encontrado!" })
        }

        // Se cancelando pedido, reestocar produtos
        if (status === 'Cancelado' && pedido.status !== 'Cancelado') {
            await reestocarPedido(id)
        }

        await pedido.update({ status: status })
        
        res.status(200).json({ 
            message: "Status do pedido atualizado com sucesso!",
            pedido: pedido 
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar status do pedido" })
        console.error("Erro ao atualizar status do pedido", err)
    }
}

// Atualizar endereço de entrega
const atualizarEndereco = async (req, res) => {
    const id = req.params.id
    const { enderecoEntrega } = req.body

    if (!enderecoEntrega) {
        return res.status(400).json({ error: "Endereço de entrega é obrigatório!" })
    }

    try {
        const pedido = await Pedido.findByPk(id)
        
        if (!pedido) {
            return res.status(404).json({ error: "Pedido não encontrado!" })
        }

        // Só permite alterar endereço se pedido não foi enviado
        if (['Enviado', 'Entregue'].includes(pedido.status)) {
            return res.status(400).json({ error: "Não é possível alterar endereço após o pedido ser enviado!" })
        }

        await pedido.update({ enderecoEntrega: enderecoEntrega })
        
        res.status(200).json({ 
            message: "Endereço de entrega atualizado com sucesso!",
            pedido: pedido 
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar endereço de entrega" })
        console.error("Erro ao atualizar endereço de entrega", err)
    }
}

// Cancelar pedido
const cancelarPedido = async (req, res) => {
    const id = req.params.id
    const { motivo } = req.body

    try {
        const pedido = await Pedido.findByPk(id)
        
        if (!pedido) {
            return res.status(404).json({ error: "Pedido não encontrado!" })
        }

        // Verificar se pode cancelar
        if (['Entregue', 'Cancelado'].includes(pedido.status)) {
            return res.status(400).json({ error: `Não é possível cancelar um pedido com status "${pedido.status}"!` })
        }

        // Reestocar produtos
        await reestocarPedido(id)

        await pedido.update({ 
            status: 'Cancelado'
        })
        
        res.status(200).json({ 
            message: "Pedido cancelado com sucesso!",
            motivo: motivo || "Cancelado pelo usuário",
            pedido: pedido 
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao cancelar pedido" })
        console.error("Erro ao cancelar pedido", err)
    }
}

// Buscar pedidos por status
const buscarPorStatus = async (req, res) => {
    const status = req.params.status
    
    const statusPermitidos = ['Pendente', 'Confirmado', 'Preparando', 'Enviado', 'Entregue', 'Cancelado']
    
    if (!statusPermitidos.includes(status)) {
        return res.status(400).json({ 
            error: "Status deve ser: " + statusPermitidos.join(', ')
        })
    }

    try {
        const pedidos = await Pedido.findAll({
            where: { status: status },
            include: [
                {
                    model: Usuario,
                    attributes: ['nome', 'email']
                }
            ],
            order: [['dataPedido', 'ASC']]
        })
        
        res.status(200).json({
            status: status,
            quantidade: pedidos.length,
            pedidos: pedidos
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar pedidos por status" })
        console.error("Erro ao buscar pedidos por status", err)
    }
}

// Buscar pedidos por período
const buscarPorPeriodo = async (req, res) => {
    const { dataInicio, dataFim } = req.query

    if (!dataInicio || !dataFim) {
        return res.status(400).json({ error: "Data início e data fim são obrigatórias!" })
    }

    try {
        const pedidos = await Pedido.findAll({
            where: {
                dataPedido: {
                    [Op.between]: [new Date(dataInicio), new Date(dataFim)]
                }
            },
            include: [
                {
                    model: Usuario,
                    attributes: ['nome', 'email']
                },
                {
                    model: Cupom,
                    attributes: ['codigo']
                }
            ],
            order: [['dataPedido', 'DESC']]
        })

        // Calcular estatísticas
        const totalVendas = pedidos.reduce((sum, pedido) => sum + pedido.valorTotal, 0)
        const pedidosConcluidos = pedidos.filter(p => ['Entregue'].includes(p.status)).length

        res.status(200).json({
            periodo: {
                dataInicio: dataInicio,
                dataFim: dataFim
            },
            estatisticas: {
                totalPedidos: pedidos.length,
                pedidosConcluidos: pedidosConcluidos,
                totalVendas: totalVendas
            },
            pedidos: pedidos
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar pedidos por período" })
        console.error("Erro ao buscar pedidos por período", err)
    }
}

// Obter estatísticas de pedidos
const obterEstatisticas = async (req, res) => {
    try {
        // Contar pedidos por status
        const pedidosPorStatus = await Pedido.findAll({
            attributes: [
                'status',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('status')), 'quantidade']
            ],
            group: ['status'],
            raw: true
        })

        // Total de pedidos
        const totalPedidos = await Pedido.count()

        // Valor total de vendas
        const totalVendas = await Pedido.sum('valorTotal', {
            where: { status: 'Entregue' }
        }) || 0

        // Pedidos do mês atual
        const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        const fimMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        
        const pedidosMes = await Pedido.count({
            where: {
                dataPedido: {
                    [Op.between]: [inicioMes, fimMes]
                }
            }
        })

        const vendasMes = await Pedido.sum('valorTotal', {
            where: {
                dataPedido: {
                    [Op.between]: [inicioMes, fimMes]
                },
                status: 'Entregue'
            }
        }) || 0

        res.status(200).json({
            estatisticas: {
                totalPedidos: totalPedidos,
                totalVendas: totalVendas,
                pedidosMes: pedidosMes,
                vendasMes: vendasMes,
                pedidosPorStatus: pedidosPorStatus
            }
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao obter estatísticas" })
        console.error("Erro ao obter estatísticas", err)
    }
}

// Função auxiliar para reestocar produtos de um pedido cancelado
const reestocarPedido = async (pedidoId) => {
    try {
        // Buscar entregas relacionadas ao pedido para identificar produtos
        const entregas = await Entrega.findAll({
            where: { idPedido: pedidoId }
        })

        // Reestocar produtos (implementação depende da estrutura de itens do pedido)
        // Esta é uma implementação simplificada
        console.log(`Reestocando produtos do pedido ${pedidoId}`)
        
    } catch (err) {
        console.error("Erro ao reestocar pedido", err)
        throw err
    }
}

// Aplicar cupom a pedido existente
const aplicarCupom = async (req, res) => {
    const id = req.params.id
    const { idCupom } = req.body

    if (!idCupom) {
        return res.status(400).json({ error: "ID do cupom é obrigatório!" })
    }

    try {
        const pedido = await Pedido.findByPk(id)
        if (!pedido) {
            return res.status(404).json({ error: "Pedido não encontrado!" })
        }

        // Verificar se pedido já tem cupom
        if (pedido.idCupom) {
            return res.status(400).json({ error: "Pedido já possui um cupom aplicado!" })
        }

        const cupom = await Cupom.findByPk(idCupom)
        if (!cupom) {
            return res.status(404).json({ error: "Cupom não encontrado!" })
        }

        if (!cupom.ativo) {
            return res.status(400).json({ error: "Cupom não está ativo!" })
        }

        if (new Date() > new Date(cupom.dataValidade)) {
            return res.status(400).json({ error: "Cupom expirado!" })
        }

        // Calcular novo valor com desconto
        const desconto = (pedido.valorTotal * cupom.descontoPercentual) / 100
        const novoValor = pedido.valorTotal - desconto

        await pedido.update({
            idCupom: idCupom,
            valorTotal: novoValor
        })

        // Marcar cupom como usado se for de uso único
        if (cupom.usoUnico) {
            await cupom.update({ ativo: false })
        }

        res.status(200).json({
            message: "Cupom aplicado com sucesso!",
            desconto: desconto,
            valorOriginal: pedido.valorTotal + desconto,
            valorComDesconto: novoValor,
            pedido: pedido
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao aplicar cupom" })
        console.error("Erro ao aplicar cupom", err)
    }
}

module.exports = {
    criarPedido,
    listarPedidos,
    buscarPorId,
    listarPorUsuario,
    atualizarStatus,
    atualizarEndereco,
    cancelarPedido,
    buscarPorStatus,
    buscarPorPeriodo,
    obterEstatisticas,
    aplicarCupom
}