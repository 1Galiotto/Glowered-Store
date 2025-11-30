const { Favorito, Usuario, Produto } = require('../model/rel');

// Adicionar aos favoritos
const adicionar = async (req, res) => {
    try {
        const { idUsuario, idProduto } = req.body;

        // Validações
        if (!idUsuario || !idProduto) {
            return res.status(400).json({ error: "ID do usuário e do produto são obrigatórios" });
        }

        // Verificar se usuário existe
        const usuario = await Usuario.findByPk(idUsuario);
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Verificar se produto existe
        const produto = await Produto.findByPk(idProduto);
        if (!produto) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        // Verificar se já está nos favoritos
        const favoritoExistente = await Favorito.findOne({
            where: { idUsuario, idProduto, ativo: true }
        });

        if (favoritoExistente) {
            return res.status(400).json({ error: "Produto já está nos favoritos" });
        }

        const favorito = await Favorito.create({
            idUsuario,
            idProduto
        });

        res.status(201).json({
            message: "Produto adicionado aos favoritos",
            favorito
        });

    } catch (error) {
        console.error('Erro ao adicionar favorito:', error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Listar favoritos do usuário
const listarPorUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params;

        if (!idUsuario) {
            return res.status(400).json({ error: "ID do usuário é obrigatório" });
        }

        const favoritos = await Favorito.findAll({
            where: { idUsuario, ativo: true },
            include: [{
                model: Produto,
                as: 'produto',
                where: { ativo: true },
                required: true
            }],
            order: [['dataCriacao', 'DESC']]
        });

        res.json(favoritos);

    } catch (error) {
        console.error('Erro ao listar favoritos:', error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Remover dos favoritos
const remover = async (req, res) => {
    try {
        const { idUsuario, idProduto } = req.params;

        if (!idUsuario || !idProduto) {
            return res.status(400).json({ error: "ID do usuário e do produto são obrigatórios" });
        }

        const favorito = await Favorito.findOne({
            where: { idUsuario, idProduto, ativo: true }
        });

        if (!favorito) {
            return res.status(404).json({ error: "Favorito não encontrado" });
        }

        await favorito.update({ ativo: false });

        res.json({ message: "Produto removido dos favoritos" });

    } catch (error) {
        console.error('Erro ao remover favorito:', error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Verificar se produto está nos favoritos
const verificarFavorito = async (req, res) => {
    try {
        const { idUsuario, idProduto } = req.params;

        if (!idUsuario || !idProduto) {
            return res.status(400).json({ error: "ID do usuário e do produto são obrigatórios" });
        }

        const favorito = await Favorito.findOne({
            where: { idUsuario, idProduto, ativo: true }
        });

        res.json({ isFavorito: !!favorito });

    } catch (error) {
        console.error('Erro ao verificar favorito:', error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Contar favoritos do usuário
const contarPorUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params;

        if (!idUsuario) {
            return res.status(400).json({ error: "ID do usuário é obrigatório" });
        }

        const quantidade = await Favorito.count({
            where: { idUsuario, ativo: true }
        });

        res.json({ quantidade });

    } catch (error) {
        console.error('Erro ao contar favoritos:', error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

module.exports = {
    adicionar,
    listarPorUsuario,
    remover,
    verificarFavorito,
    contarPorUsuario
};
