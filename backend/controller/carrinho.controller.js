const Carrinho = require('../model/Carrinho');
const Produto = require('../model/Produto');

// Adicionar item ao carrinho
const adicionarItem = async (req, res) => {
    try {
        const { idUsuario, idProduto, quantidade } = req.body;

        // Parse IDs para inteiros
        const idUsuarioInt = parseInt(idUsuario);
        const idProdutoInt = parseInt(idProduto);
        const quantidadeInt = parseInt(quantidade) || 1;

        if (isNaN(idUsuarioInt) || isNaN(idProdutoInt)) {
            return res.status(400).json({ error: 'IDs inválidos' });
        }

        // Verificar se o produto existe - USANDO codProduto
        const produto = await Produto.findByPk(idProdutoInt);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        // Verificar se o produto está ativo
        if (!produto.ativo) {
            return res.status(400).json({ error: 'Produto não está disponível' });
        }

        // Verificar se o item já existe no carrinho do usuário
        const itemExistente = await Carrinho.findOne({
            where: {
                idUsuario: idUsuarioInt,
                idProduto: idProdutoInt
            }
        });

        if (itemExistente) {
            // Atualizar quantidade se o item já existir
            itemExistente.quantidade += quantidadeInt;
            await itemExistente.save();

            return res.status(200).json({
                message: 'Quantidade do item atualizada no carrinho',
                item: itemExistente
            });
        }

        // Criar novo item no carrinho
        const novoItem = await Carrinho.create({
            idUsuario: idUsuarioInt,
            idProduto: idProdutoInt,
            quantidade: quantidadeInt
        });

        res.status(201).json({
            message: 'Item adicionado ao carrinho com sucesso',
            item: novoItem
        });

    } catch (error) {
        console.error('Erro ao adicionar item ao carrinho:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Listar itens do carrinho do usuário
const listarItens = async (req, res) => {
    try {
        const { idUsuario } = req.params;

        const itensCarrinho = await Carrinho.findAll({
            where: { idUsuario },
            include: [{
                model: Produto,
                as: 'produto', // ← OBRIGATÓRIO (mesmo alias da associação)
                attributes: ['codProduto', 'nome', 'preco', 'promocao', 'imagem', 'ativo'] // ← Use codProduto (primary key real)
            }]
        });

        // Se o carrinho estiver vazio
        if (itensCarrinho.length === 0) {
            return res.status(200).json({
                itens: [],
                resumo: {
                    totalItens: 0,
                    totalQuantidade: 0,
                    total: 0,
                    totalComDesconto: 0,
                    totalDesconto: 0
                }
            });
        }

        // Calcular totais
        let total = 0;
        let totalComDesconto = 0;
        const itensComCalculos = itensCarrinho.map(item => {
            const precoProduto = item.produto.preco;
            const desconto = item.produto.promocao || 0;
            const subtotal = precoProduto * item.quantidade;
            const subtotalComDesconto = subtotal * (1 - desconto / 100);

            total += subtotal;
            totalComDesconto += subtotalComDesconto;

            return {
                codCarrinho: item.codCarrinho,
                idProduto: item.idProduto,
                quantidade: item.quantidade,
                produto: {
                    codProduto: item.produto.codProduto, // ← primary key correta
                    nome: item.produto.nome,
                    preco: parseFloat(item.produto.preco),
                    promocao: item.produto.promocao,
                    imagem: item.produto.imagem,
                    ativo: item.produto.ativo
                },
                subtotal,
                subtotalComDesconto,
                precoUnitario: precoProduto,
                descontoPercentual: desconto
            };
        });

        res.status(200).json({
            itens: itensComCalculos,
            resumo: {
                totalItens: itensCarrinho.length,
                totalQuantidade: itensCarrinho.reduce((sum, item) => sum + item.quantidade, 0),
                total,
                totalComDesconto,
                totalDesconto: total - totalComDesconto
            }
        });

    } catch (error) {
        console.error('❌ Erro ao listar itens do carrinho:', error);
        
        // Debug detalhado
        if (error.name === 'SequelizeEagerLoadingError') {
            console.log('🔍 Detalhes do erro de associação:');
            console.log('- Primary Key do Produto: codProduto');
            console.log('- Foreign Key no Carrinho: idProduto');
        }
        
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
}

// Atualizar quantidade do item no carrinho
const atualizarQuantidade = async (req, res) => {
    try {
        const { id } = req.params; // id do item no carrinho
        const { quantidade } = req.body;

        const item = await Carrinho.findByPk(id);
        if (!item) {
            return res.status(404).json({ error: 'Item não encontrado no carrinho' });
        }

        if (quantidade <= 0) {
            return res.status(400).json({ error: 'Quantidade deve ser maior que zero' });
        }

        item.quantidade = parseInt(quantidade);
        await item.save();

        res.status(200).json({
            message: 'Quantidade atualizada com sucesso',
            item
        });

    } catch (error) {
        console.error('Erro ao atualizar quantidade do item:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Remover item do carrinho
const removerItem = async (req, res) => {
    try {
        const { id } = req.params; // id do item no carrinho

        const item = await Carrinho.findByPk(id);
        if (!item) {
            return res.status(404).json({ error: 'Item não encontrado no carrinho' });
        }

        await item.destroy();

        res.status(200).json({ message: 'Item removido do carrinho com sucesso' });

    } catch (error) {
        console.error('Erro ao remover item do carrinho:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Limpar carrinho do usuário
const limparCarrinho = async (req, res) => {
    try {
        const { idUsuario } = req.params;

        const resultado = await Carrinho.destroy({
            where: { idUsuario }
        });

        res.status(200).json({
            message: 'Carrinho limpo com sucesso',
            itensRemovidos: resultado
        });

    } catch (error) {
        console.error('Erro ao limpar carrinho:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Obter quantidade total de itens no carrinho
const getQuantidadeTotal = async (req, res) => {
    try {
        const { idUsuario } = req.params;

        const itens = await Carrinho.findAll({
            where: { idUsuario },
            attributes: ['quantidade']
        });

        const quantidadeTotal = itens.reduce((total, item) => total + item.quantidade, 0);

        res.status(200).json({
            idUsuario,
            quantidadeTotal,
            itensDiferentes: itens.length
        });

    } catch (error) {
        console.error('Erro ao obter quantidade total:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Mover itens do carrinho para um pedido (esvaziar carrinho após pedido)
const moverParaPedido = async (req, res) => {
    try {
        const { idUsuario } = req.body;

        const itensCarrinho = await Carrinho.findAll({
            where: { idUsuario },
            include: [{
                model: Produto,
                as: 'produto' // ← ADICIONE
            }]
        });

        if (itensCarrinho.length === 0) {
            return res.status(400).json({ error: 'Carrinho está vazio' });
        }

        await Carrinho.destroy({
            where: { idUsuario }
        });

        res.status(200).json({
            message: 'Itens do carrinho movidos para pedido com sucesso',
            itensProcessados: itensCarrinho.length
        });

    } catch (error) {
        console.error('Erro ao mover itens para pedido:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Verificar disponibilidade dos itens no carrinho
const verificarDisponibilidade = async (req, res) => {
    try {
        const { idUsuario } = req.params;

        const itensCarrinho = await Carrinho.findAll({
            where: { idUsuario },
            include: [{
                model: Produto,
                as: 'produto', // ← ADICIONE
                attributes: ['codProduto', 'nome', 'preco', 'ativo'] // ← codProduto
            }]
        });

        const disponibilidade = itensCarrinho.map(item => ({
            idCarrinho: item.codCarrinho,
            produto: item.produto.nome,
            disponivel: item.produto.ativo,
            quantidadeSolicitada: item.quantidade
        }));

        const todosDisponiveis = disponibilidade.every(item => item.disponivel);

        res.status(200).json({
            todosDisponiveis,
            detalhes: disponibilidade
        });

    } catch (error) {
        console.error('Erro ao verificar disponibilidade:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

module.exports = {
    adicionarItem,
    listarItens,
    atualizarQuantidade,
    removerItem,
    limparCarrinho,
    getQuantidadeTotal,
    moverParaPedido,
    verificarDisponibilidade
}