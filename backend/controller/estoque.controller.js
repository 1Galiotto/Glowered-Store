const Estoque = require('../model/Estoque.js')
const Produto = require('../model/Produto.js')
const { Op } = require('sequelize')

// Adicionar entrada no estoque
const adicionarEstoque = async (req, res) => {
    const { idProduto, quantidade, movimentacao } = req.body

    // Validações
    if (!idProduto || !quantidade || !movimentacao) {
        return res.status(400).json({ error: "ID do produto, quantidade e movimentação são obrigatórios!" })
    }

    if (quantidade <= 0) {
        return res.status(400).json({ error: "A quantidade deve ser maior que zero!" })
    }

    try {
        // Verificar se o produto existe
        const produto = await Produto.findByPk(idProduto)
        if (!produto) {
            return res.status(404).json({ error: "Produto não encontrado!" })
        }

        // Criar registro de entrada no estoque
        const entradaEstoque = await Estoque.create({
            idProduto: idProduto,
            quantidade: quantidade,
            movimentacao: movimentacao
        })

        res.status(201).json({
            message: 'Entrada no estoque registrada com sucesso!',
            movimentacao: entradaEstoque
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao adicionar entrada no estoque" })
        console.error("Erro ao adicionar entrada no estoque", err)
    }
}

// Registrar saída do estoque
const registrarSaida = async (req, res) => {
    const { idProduto, quantidade, movimentacao } = req.body

    // Validações
    if (!idProduto || !quantidade || !movimentacao) {
        return res.status(400).json({ error: "ID do produto, quantidade e movimentação são obrigatórios!" })
    }

    if (quantidade <= 0) {
        return res.status(400).json({ error: "A quantidade deve ser maior que zero!" })
    }

    try {
        // Verificar se o produto existe
        const produto = await Produto.findByPk(idProduto)
        if (!produto) {
            return res.status(404).json({ error: "Produto não encontrado!" })
        }

        // Verificar estoque atual
        const estoqueAtual = await getQuantidadeAtual(idProduto)
        
        if (estoqueAtual < quantidade) {
            return res.status(400).json({ 
                error: "Quantidade insuficiente em estoque!",
                estoqueAtual: estoqueAtual,
                quantidadeSolicitada: quantidade
            })
        }

        // Registrar saída (quantidade negativa)
        const saidaEstoque = await Estoque.create({
            idProduto: idProduto,
            quantidade: -quantidade,
            movimentacao: movimentacao
        })

        res.status(201).json({
            message: 'Saída do estoque registrada com sucesso!',
            movimentacao: saidaEstoque,
            estoqueAtual: estoqueAtual - quantidade
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao registrar saída do estoque" })
        console.error("Erro ao registrar saída do estoque", err)
    }
}

// Listar todo o histórico de movimentações
const listarHistorico = async (req, res) => {
    try {
        const movimentacoes = await Estoque.findAll({
            include: [{
                model: Produto,
                attributes: ['nome', 'codProduto']
            }],
            order: [['dataMovimentacao', 'DESC']]
        })
        
        res.status(200).json(movimentacoes)
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar histórico do estoque" })
        console.error("Erro ao listar histórico do estoque", err)
    }
}

// Listar movimentações por produto
const listarPorProduto = async (req, res) => {
    const idProduto = req.params.idProduto

    try {
        // Verificar se o produto existe
        const produto = await Produto.findByPk(idProduto)
        if (!produto) {
            return res.status(404).json({ error: "Produto não encontrado!" })
        }

        const movimentacoes = await Estoque.findAll({
            where: { idProduto: idProduto },
            include: [{
                model: Produto,
                attributes: ['nome', 'codProduto']
            }],
            order: [['dataMovimentacao', 'DESC']]
        })

        // Calcular quantidade atual
        const quantidadeAtual = await getQuantidadeAtual(idProduto)

        res.status(200).json({
            produto: {
                codProduto: produto.codProduto,
                nome: produto.nome
            },
            quantidadeAtual: quantidadeAtual,
            movimentacoes: movimentacoes
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar movimentações do produto" })
        console.error("Erro ao listar movimentações do produto", err)
    }
}

// Consultar quantidade atual em estoque
const consultarEstoque = async (req, res) => {
    const idProduto = req.params.idProduto

    try {
        // Verificar se o produto existe
        const produto = await Produto.findByPk(idProduto)
        if (!produto) {
            return res.status(404).json({ error: "Produto não encontrado!" })
        }

        const quantidadeAtual = await getQuantidadeAtual(idProduto)

        res.status(200).json({
            produto: {
                codProduto: produto.codProduto,
                nome: produto.nome
            },
            quantidadeEstoque: quantidadeAtual
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao consultar estoque" })
        console.error("Erro ao consultar estoque", err)
    }
}

// Listar todos os produtos com estoque atual
const listarTodosEstoques = async (req, res) => {
    try {
        const produtos = await Produto.findAll({
            where: { ativo: true },
            include: [{
                model: Estoque,
                attributes: [] // Não retorna os registros individuais, só usamos para o aggregate
            }]
        })

        // Para cada produto, calcular o estoque atual
        const produtosComEstoque = await Promise.all(
            produtos.map(async (produto) => {
                const quantidadeAtual = await getQuantidadeAtual(produto.codProduto)
                return {
                    ...produto.toJSON(),
                    quantidadeEstoque: quantidadeAtual
                }
            })
        )

        res.status(200).json(produtosComEstoque)
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar estoques" })
        console.error("Erro ao listar estoques", err)
    }
}

// Listar produtos com estoque baixo
const listarEstoqueBaixo = async (req, res) => {
    try {
        const LIMITE_ESTOQUE_BAIXO = 10; // Defina seu limite aqui
        
        // Buscar todos os produtos com estoque
        const produtosComEstoque = await Produto.findAll({
            include: [{
                model: Estoque,
                required: false
            }]
        });

        // Calcular estoque total por produto
        const estoquePorProduto = await Promise.all(
            produtosComEstoque.map(async (produto) => {
                const estoqueTotal = await Estoque.sum('quantidade', {
                    where: { idProduto: produto.codProduto }
                }) || 0;

                return {
                    produto: produto,
                    quantidade: estoqueTotal
                };
            })
        );

        // Filtrar estoque baixo
        const estoqueBaixo = estoquePorProduto.filter(item => 
            item.quantidade <= LIMITE_ESTOQUE_BAIXO && item.quantidade > 0
        );

        res.json(estoqueBaixo);
    } catch (error) {
        console.error('Erro ao listar estoque baixo:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Ajustar estoque (correção)
const ajustarEstoque = async (req, res) => {
    const { idProduto, novaQuantidade, motivo } = req.body

    // Validações
    if (!idProduto || novaQuantidade === undefined || !motivo) {
        return res.status(400).json({ error: "ID do produto, nova quantidade e motivo são obrigatórios!" })
    }

    if (novaQuantidade < 0) {
        return res.status(400).json({ error: "A quantidade não pode ser negativa!" })
    }

    try {
        // Verificar se o produto existe
        const produto = await Produto.findByPk(idProduto)
        if (!produto) {
            return res.status(404).json({ error: "Produto não encontrado!" })
        }

        // Calcular quantidade atual
        const quantidadeAtual = await getQuantidadeAtual(idProduto)
        
        // Calcular diferença
        const diferenca = novaQuantidade - quantidadeAtual

        if (diferenca === 0) {
            return res.status(400).json({ error: "A quantidade informada é igual à quantidade atual!" })
        }

        // Registrar ajuste
        const ajusteEstoque = await Estoque.create({
            idProduto: idProduto,
            quantidade: diferenca,
            movimentacao: `Ajuste: ${motivo} (${diferenca > 0 ? '+' : ''}${diferenca})`
        })

        res.status(201).json({
            message: 'Estoque ajustado com sucesso!',
            ajuste: ajusteEstoque,
            quantidadeAnterior: quantidadeAtual,
            novaQuantidade: novaQuantidade,
            diferenca: diferenca
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao ajustar estoque" })
        console.error("Erro ao ajustar estoque", err)
    }
}

// Função auxiliar para calcular quantidade atual
const getQuantidadeAtual = async (req, res) => {
    try {
        const { id } = req.params;
        
        const quantidade = await Estoque.sum('quantidade', {
            where: { idProduto: id }
        }) || 0;

        res.json({ 
            idProduto: parseInt(id),
            quantidade: quantidade 
        });
    } catch (error) {
        console.error('Erro ao obter quantidade:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Buscar movimentações por período
const buscarPorPeriodo = async (req, res) => {
    const { dataInicio, dataFim } = req.query

    if (!dataInicio || !dataFim) {
        return res.status(400).json({ error: "Data início e data fim são obrigatórias!" })
    }

    try {
        const movimentacoes = await Estoque.findAll({
            where: {
                dataMovimentacao: {
                    [Op.between]: [new Date(dataInicio), new Date(dataFim)]
                }
            },
            include: [{
                model: Produto,
                attributes: ['nome', 'codProduto']
            }],
            order: [['dataMovimentacao', 'DESC']]
        })

        res.status(200).json({
            periodo: {
                dataInicio: dataInicio,
                dataFim: dataFim
            },
            movimentacoes: movimentacoes
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar movimentações por período" })
        console.error("Erro ao buscar movimentações por período", err)
    }
}


module.exports = {
    adicionarEstoque, //
    registrarSaida, //
    listarHistorico,
    listarPorProduto, //
    consultarEstoque, //
    listarTodosEstoques, //
    listarEstoqueBaixo, //
    ajustarEstoque, //
    buscarPorPeriodo, //
    getQuantidadeAtual
}