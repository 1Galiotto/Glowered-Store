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
            senha: senhaHash
        })
        res.status(201).json({message: 'usuario cadastrado com sucesso!'})
        console.log(usuario)
    }catch(err){
        res.status(500).json({error: "Erro ao cadastrar o usuario"})
        console.error("Erro ao cadastrar o usuario",err)
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

module.exports = { cadastrar, listar, apagar }