const Usuario = require('../model/Usuario.js')
const { hashPassword } = require('../service/bcrypt.service.js')

const cadastrar = async (req,res)=>{
    const valores = req.body

    if(!valores.nome || !valores.email || !valores.senha){
        return res.status(400).json({error: "Nome, email e senha são obrigatórios!"})
    }

    try{
        const senhaHash = await hashPassword(valores.senha)

        const usuario = await Usuario.create({
            nome: valores.nome,
            email: valores.email,
            senha: senhaHash,
            cpf: valores.cpf || null,
            telefone: valores.telefone || null,
            tipo: valores.tipo || 'cliente'
        })
        
        res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            user: {
                codUsuario: usuario.codUsuario,
                nome: usuario.nome,
                email: usuario.email
            }
        })
        
    }catch(err){
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({error: "Email já cadastrado!"})
        }
        res.status(500).json({error: "Erro ao cadastrar o usuário"})
        console.error("Erro ao cadastrar o usuário",err)
    }
}

const listar = async (req,res)=>{
    try{
        const usuarios = await Usuario.findAll()
        res.status(200).json(usuarios)
    }catch(err){
        res.status(500).json({error: "Erro ao listar os usuario"})
        console.error("Erro ao listar os usuario",err)
    }
}

// ✅ NOVA FUNÇÃO: Buscar usuário por ID
const buscarPorId = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado!" });
        }
        
        // Não retornar a senha por segurança
        const { senha, ...usuarioSemSenha } = usuario.toJSON();
        res.status(200).json(usuarioSemSenha);
        
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar usuário" });
        console.error("Erro ao buscar usuário", err);
    }
}

// ✅ NOVA FUNÇÃO: Atualizar usuário
const atualizar = async (req, res) => {
    const id = req.params.id;
    const valores = req.body;
    
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado!" });
        }

        // Campos que podem ser atualizados
        const camposPermitidos = ['nome', 'email', 'telefone'];
        const dadosAtualizacao = {};
        
        camposPermitidos.forEach(campo => {
            if (valores[campo] !== undefined) {
                dadosAtualizacao[campo] = valores[campo];
            }
        });

        await usuario.update(dadosAtualizacao);
        
        // Retornar usuário atualizado (sem senha)
        const { senha, ...usuarioAtualizado } = usuario.toJSON();
        res.status(200).json({ 
            message: "Usuário atualizado com sucesso!", 
            user: usuarioAtualizado 
        });
        
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: "Email já está em uso!" });
        }
        res.status(500).json({ error: "Erro ao atualizar usuário" });
        console.error("Erro ao atualizar usuário", err);
    }
}

const apagar = async (req,res)=>{
    const id = req.params.id
    try{
        const resultado = await Usuario.destroy({ where: { codUsuario: id } })
        if(resultado === 0){
            return res.status(404).json({ error: "Usuário não encontrado!" })
        }
        res.status(200).json({ message: "Usuário apagado com sucesso!" })
    }catch(err){
        res.status(500).json({ error: "Erro ao apagar o usuário!" })
        console.error("Erro ao apagar o usuário!", err)
    }   
}

// ✅ ATUALIZAR O EXPORT
module.exports = { 
    cadastrar, 
    listar, 
    buscarPorId,  
    atualizar,    
    apagar 
}