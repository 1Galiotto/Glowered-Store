const Config = require('../model/Config.js')
const Usuario = require('../model/Usuario.js')

// Criar ou atualizar configuração do usuário
const salvarConfig = async (req, res) => {
    const { codUsuario, temaPagina } = req.body

    // Validações
    if (!codUsuario) {
        return res.status(400).json({ error: "ID do usuário é obrigatório!" })
    }

    if (temaPagina && !['claro', 'escuro', 'auto'].includes(temaPagina)) {
        return res.status(400).json({ error: "Tema deve ser 'claro', 'escuro' ou 'auto'!" })
    }

    try {
        // Verificar se o usuário existe
        const usuario = await Usuario.findByPk(codUsuario)
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado!" })
        }

        // Verificar se já existe configuração para este usuário
        const configExistente = await Config.findOne({
            where: { codUsuario: codUsuario }
        })

        let config

        if (configExistente) {
            // Atualizar configuração existente
            await configExistente.update({
                temaPagina: temaPagina || configExistente.temaPagina
            })
            config = configExistente
        } else {
            // Criar nova configuração
            config = await Config.create({
                codUsuario: codUsuario,
                temaPagina: temaPagina || 'claro'
            })
        }

        res.status(200).json({
            message: 'Configuração salva com sucesso!',
            config: config
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao salvar configuração" })
        console.error("Erro ao salvar configuração", err)
    }
}

// Buscar configuração por ID do usuário
const buscarPorUsuario = async (req, res) => {
    const codUsuario = req.params.codUsuario

    try {
        // Verificar se o usuário existe
        const usuario = await Usuario.findByPk(codUsuario)
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado!" })
        }

        const config = await Config.findOne({
            where: { codUsuario: codUsuario },
            include: [{
                model: Usuario,
                attributes: ['nome', 'email']
            }]
        })

        // Se não existir configuração, retornar configuração padrão
        if (!config) {
            const configPadrao = {
                codUsuario: parseInt(codUsuario),
                temaPagina: 'claro',
                usuario: {
                    nome: usuario.nome,
                    email: usuario.email
                }
            }
            return res.status(200).json(configPadrao)
        }

        res.status(200).json(config)
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar configuração do usuário" })
        console.error("Erro ao buscar configuração do usuário", err)
    }
}

// Buscar configuração por ID da configuração
const buscarPorId = async (req, res) => {
    const codConfig = req.params.codConfig

    try {
        const config = await Config.findByPk(codConfig, {
            include: [{
                model: Usuario,
                attributes: ['nome', 'email', 'tipo']
            }]
        })

        if (!config) {
            return res.status(404).json({ error: "Configuração não encontrada!" })
        }

        res.status(200).json(config)
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar configuração" })
        console.error("Erro ao buscar configuração", err)
    }
}

// Listar todas as configurações (para admin)
const listarTodas = async (req, res) => {
    try {
        const configs = await Config.findAll({
            include: [{
                model: Usuario,
                attributes: ['nome', 'email', 'tipo']
            }],
            order: [['codUsuario', 'ASC']]
        })

        res.status(200).json(configs)
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar configurações" })
        console.error("Erro ao listar configurações", err)
    }
}

// Atualizar tema
const atualizarTema = async (req, res) => {
    const codUsuario = req.params.codUsuario
    const { temaPagina } = req.body

    // Validações
    if (!temaPagina) {
        return res.status(400).json({ error: "Tema é obrigatório!" })
    }

    if (!['claro', 'escuro', 'auto'].includes(temaPagina)) {
        return res.status(400).json({ error: "Tema deve ser 'claro', 'escuro' ou 'auto'!" })
    }

    try {
        // Verificar se o usuário existe
        const usuario = await Usuario.findByPk(codUsuario)
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado!" })
        }

        // Buscar configuração existente
        const config = await Config.findOne({
            where: { codUsuario: codUsuario }
        })

        if (!config) {
            // Criar nova configuração se não existir
            const novaConfig = await Config.create({
                codUsuario: codUsuario,
                temaPagina: temaPagina
            })
            
            return res.status(201).json({
                message: 'Tema configurado com sucesso!',
                config: novaConfig
            })
        }

        // Atualizar tema
        await config.update({ temaPagina: temaPagina })

        res.status(200).json({
            message: 'Tema atualizado com sucesso!',
            config: config
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar tema" })
        console.error("Erro ao atualizar tema", err)
    }
}

// Resetar configuração para padrão
const resetarConfig = async (req, res) => {
    const codUsuario = req.params.codUsuario

    try {
        // Verificar se o usuário existe
        const usuario = await Usuario.findByPk(codUsuario)
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado!" })
        }

        // Buscar configuração existente
        const config = await Config.findOne({
            where: { codUsuario: codUsuario }
        })

        if (config) {
            // Atualizar para valores padrão
            await config.update({
                temaPagina: 'claro'
            })

            res.status(200).json({
                message: 'Configuração resetada para padrão!',
                config: config
            })
        } else {
            // Se não existir configuração, informar que já está no padrão
            res.status(200).json({
                message: 'Configuração já está com valores padrão!',
                config: {
                    codUsuario: parseInt(codUsuario),
                    temaPagina: 'claro'
                }
            })
        }
    } catch (err) {
        res.status(500).json({ error: "Erro ao resetar configuração" })
        console.error("Erro ao resetar configuração", err)
    }
}

// Deletar configuração
const deletarConfig = async (req, res) => {
    const codConfig = req.params.codConfig

    try {
        const config = await Config.findByPk(codConfig)

        if (!config) {
            return res.status(404).json({ error: "Configuração não encontrada!" })
        }

        await config.destroy()

        res.status(200).json({ 
            message: "Configuração deletada com sucesso!",
            usuarioId: config.codUsuario
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar configuração" })
        console.error("Erro ao deletar configuração", err)
    }
}

// Deletar configuração por usuário
const deletarConfigPorUsuario = async (req, res) => {
    const codUsuario = req.params.codUsuario

    try {
        // Verificar se o usuário existe
        const usuario = await Usuario.findByPk(codUsuario)
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado!" })
        }

        const resultado = await Config.destroy({
            where: { codUsuario: codUsuario }
        })

        if (resultado === 0) {
            return res.status(404).json({ error: "Configuração não encontrada para este usuário!" })
        }

        res.status(200).json({ 
            message: "Configuração do usuário deletada com sucesso!",
            usuarioId: codUsuario
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar configuração do usuário" })
        console.error("Erro ao deletar configuração do usuário", err)
    }
}

// Estatísticas de configurações
const obterEstatisticas = async (req, res) => {
    try {
        // Contar total de configurações
        const totalConfigs = await Config.count()

        // Contar configurações por tema
        const configsPorTema = await Config.findAll({
            attributes: [
                'temaPagina',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('temaPagina')), 'quantidade']
            ],
            group: ['temaPagina'],
            raw: true
        })

        // Contar total de usuários
        const totalUsuarios = await Usuario.count()

        // Calcular porcentagem de usuários com configuração personalizada
        const porcentagemComConfig = totalUsuarios > 0 ? 
            ((totalConfigs / totalUsuarios) * 100).toFixed(2) : 0

        res.status(200).json({
            estatisticas: {
                totalConfiguracoes: totalConfigs,
                totalUsuarios: totalUsuarios,
                porcentagemComConfig: parseFloat(porcentagemComConfig),
                configsPorTema: configsPorTema
            }
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao obter estatísticas" })
        console.error("Erro ao obter estatísticas", err)
    }
}

// Buscar configurações por tema
const buscarPorTema = async (req, res) => {
    const tema = req.params.tema

    // Validação do tema
    if (!['claro', 'escuro', 'auto'].includes(tema)) {
        return res.status(400).json({ error: "Tema deve ser 'claro', 'escuro' ou 'auto'!" })
    }

    try {
        const configs = await Config.findAll({
            where: { temaPagina: tema },
            include: [{
                model: Usuario,
                attributes: ['nome', 'email', 'tipo']
            }],
            order: [['codUsuario', 'ASC']]
        })

        res.status(200).json({
            tema: tema,
            quantidade: configs.length,
            configs: configs
        })
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar configurações por tema" })
        console.error("Erro ao buscar configurações por tema", err)
    }
}

module.exports = {
    salvarConfig,
    buscarPorUsuario,
    buscarPorId,
    listarTodas,
    atualizarTema,
    resetarConfig,
    deletarConfig,
    deletarConfigPorUsuario,
    obterEstatisticas,
    buscarPorTema
}