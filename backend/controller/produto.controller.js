const Produto = require('../model/Produto.js')
const Estoque = require('../model/Estoque.js')
const Carrinho = require('../model/Carrinho.js')

// Criar um novo produto
const criar = async (req, res) => {
    const valores = req.body

    // Validação dos campos obrigatórios
    if (!valores.nome || !valores.tipo || !valores.cor || !valores.descricao || 
        !valores.preco || !valores.material || !valores.tamanho || !valores.imagem) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios!" })
    }

    // Validação do preço
    if (valores.preco <= 0) {
        return res.status(400).json({ error: "O preço deve ser maior que zero!" })
    }

    try {
        const produto = await Produto.create({
            nome: valores.nome,
            tipo: valores.tipo,
            cor: valores.cor,
            descricao: valores.descricao,
            preco: valores.preco,
            promocao: valores.promocao || null,
            material: valores.material,
            tamanho: valores.tamanho,
            imagem: valores.imagem,
            ativo: valores.ativo !== undefined ? valores.ativo : true
        })

        // Criar registro inicial no estoque se quantidade for fornecida
        if (valores.quantidadeInicial && valores.quantidadeInicial > 0) {
            await Estoque.create({
                idProduto: produto.codProduto,
                quantidade: valores.quantidadeInicial,
                movimentacao: 'Entrada inicial'
            })
        }

        res.status(201).json({ 
            message: 'Produto criado com sucesso!',
            produto: produto 
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar o produto" })
        console.error("Erro ao criar o produto", err)
    }
}

// Listar todos os produtos
const listar = async (req, res) => {
    try {
        const produtos = await Produto.findAll({
            where: { ativo: true },
            include: [{
                model: Estoque,
                attributes: ['quantidade']
            }]
        })
        res.status(200).json(produtos)
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar os produtos" })
        console.error("Erro ao listar os produtos", err)
    }
}

// Listar todos os produtos (incluindo inativos - para admin)
const listarTodos = async (req, res) => {
    try {
        const produtos = await Produto.findAll({
            include: [{
                model: Estoque,
                attributes: ['quantidade']
            }]
        })
        res.status(200).json(produtos)
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar todos os produtos" })
        console.error("Erro ao listar todos os produtos", err)
    }
}

// Buscar produto por ID
const buscarPorId = async (req, res) => {
    const id = req.params.id
    
    try {
        const produto = await Produto.findByPk(id, {
            include: [{
                model: Estoque,
                attributes: ['quantidade']
            }]
        })
        
        if (!produto) {
            return res.status(404).json({ error: "Produto não encontrado!" })
        }
        
        res.status(200).json(produto)
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar o produto" })
        console.error("Erro ao buscar o produto", err)
    }
}

// Atualizar produto
const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const produto = await Produto.findByPk(id)
        
        if (!produto) {
            return res.status(404).json({ error: "Produto não encontrado!" })
        }

        // Validação do preço se fornecido
        if (valores.preco && valores.preco <= 0) {
            return res.status(400).json({ error: "O preço deve ser maior que zero!" })
        }

        await produto.update(valores)
        
        res.status(200).json({ 
            message: "Produto atualizado com sucesso!",
            produto: produto 
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar o produto" })
        console.error("Erro ao atualizar o produto", err)
    }
}

// Desativar produto (soft delete)
const desativar = async (req, res) => {
    const id = req.params.id
    
    try {
        const produto = await Produto.findByPk(id)
        
        if (!produto) {
            return res.status(404).json({ error: "Produto não encontrado!" })
        }

        await produto.update({ ativo: false })
        
        res.status(200).json({ message: "Produto desativado com sucesso!" })
    } catch (err) {
        res.status(500).json({ error: "Erro ao desativar o produto" })
        console.error("Erro ao desativar o produto", err)
    }
}

// Ativar produto
const ativar = async (req, res) => {
    const id = req.params.id
    
    try {
        const produto = await Produto.findByPk(id)
        
        if (!produto) {
            return res.status(404).json({ error: "Produto não encontrado!" })
        }

        await produto.update({ ativo: true })
        
        res.status(200).json({ message: "Produto ativado com sucesso!" })
    } catch (err) {
        res.status(500).json({ error: "Erro ao ativar o produto" })
        console.error("Erro ao ativar o produto", err)
    }
}

// Apagar produto permanentemente
const apagar = async (req, res) => {
    const id = req.params.id
    
    try {
        // Verificar se o produto está em algum carrinho ativo
        const carrinhosComProduto = await Carrinho.count({
            where: { idProduto: id }
        })

        if (carrinhosComProduto > 0) {
            return res.status(400).json({ 
                error: "Não é possível excluir o produto pois ele está em carrinhos de compra!" 
            })
        }

        const resultado = await Produto.destroy({ 
            where: { codProduto: id } 
        })
        
        if (resultado === 0) {
            return res.status(404).json({ error: "Produto não encontrado!" })
        }

        // Também apagar registros relacionados no estoque
        await Estoque.destroy({ where: { idProduto: id } })

        res.status(200).json({ message: "Produto apagado com sucesso!" })
    } catch (err) {
        res.status(500).json({ error: "Erro ao apagar o produto" })
        console.error("Erro ao apagar o produto", err)
    }
}

// Buscar produtos por tipo
const buscarPorTipo = async (req, res) => {
    const tipo = req.params.tipo
    
    try {
        const produtos = await Produto.findAll({
            where: { 
                tipo: tipo,
                ativo: true 
            },
            include: [{
                model: Estoque,
                attributes: ['quantidade']
            }]
        })
        
        res.status(200).json(produtos)
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar produtos por tipo" })
        console.error("Erro ao buscar produtos por tipo", err)
    }
}

// Buscar produtos por cor
const buscarPorCor = async (req, res) => {
    const cor = req.params.cor
    
    try {
        const produtos = await Produto.findAll({
            where: { 
                cor: cor,
                ativo: true 
            },
            include: [{
                model: Estoque,
                attributes: ['quantidade']
            }]
        })
        
        res.status(200).json(produtos)
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar produtos por cor" })
        console.error("Erro ao buscar produtos por cor", err)
    }
}

// Buscar produtos em promoção
const buscarPromocoes = async (req, res) => {
    try {
        const produtos = await Produto.findAll({
            where: { 
                promocao: {
                    [Op.ne]: null
                },
                ativo: true 
            },
            include: [{
                model: Estoque,
                attributes: ['quantidade']
            }]
        })
        
        res.status(200).json(produtos)
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar produtos em promoção" })
        console.error("Erro ao buscar produtos em promoção", err)
    }
}

module.exports = {
    criar,
    listar,
    listarTodos,
    buscarPorId,
    atualizar,
    desativar,
    ativar,
    apagar,
    buscarPorTipo,
    buscarPorCor,
    buscarPromocoes
}