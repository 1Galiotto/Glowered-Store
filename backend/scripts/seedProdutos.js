const { Produto, Estoque } = require('../model/rel');

async function seedProdutos() {
    try {
        console.log('🌱 Iniciando seed de produtos...');

        const produtos = [
            {
                nome: 'Camisa Glowered Black',
                tipo: 'camisa',
                cor: 'Preta',
                descricao: 'Camisa de algodão premium com estampa exclusiva Glowered',
                preco: 89.90,
                promocao: 15,
                material: 'Algodão',
                tamanho: 'M',
                imagem: 'https://i.ibb.co/Xf4BQHKg/image.png',
                quantidadeInicial: 50
            },
            {
                nome: 'Moletom Glowered Hoodie',
                tipo: 'moletom',
                cor: 'Cinza',
                descricao: 'Moletom comfort com capuz e bolso kangaroo',
                preco: 149.90,
                promocao: 20,
                material: 'Algodão',
                tamanho: 'G',
                imagem: 'https://i.ibb.co/PsczQfXx/image.png',
                quantidadeInicial: 30
            },
            {
                nome: 'Calça Jeans Glowered',
                tipo: 'calca',
                cor: 'Azul',
                descricao: 'Calça jeans slim fit com lavagem moderna',
                preco: 129.90,
                promocao: 10,
                material: 'Jeans',
                tamanho: '42',
                imagem: 'https://i.ibb.co/0yYNCH87/calca.png',
                quantidadeInicial: 25
            },
            {
                nome: 'Boné Glowered Snapback',
                tipo: 'acessorio',
                cor: 'Preto',
                descricao: 'Boné ajustável com logo bordado',
                preco: 59.90,
                promocao: null,
                material: 'Algodão',
                tamanho: 'Único',
                imagem: 'https://i.ibb.co/4R17Pbgm/acessorios.png',
                quantidadeInicial: 100
            },
            {
                nome: 'Camisa Glowered White',
                tipo: 'camisa',
                cor: 'Branca',
                descricao: 'Camisa básica branca com logo minimalista',
                preco: 79.90,
                promocao: 5,
                material: 'Algodão',
                tamanho: 'P',
                imagem: 'https://i.ibb.co/8nNKrMdZ/camisa.png',
                quantidadeInicial: 40
            },
            {
                nome: 'Moletom Glowered Premium',
                tipo: 'moletom',
                cor: 'Preto',
                descricao: 'Moletom premium com acabamento em veludo',
                preco: 179.90,
                promocao: 25,
                material: 'Algodão',
                tamanho: 'GG',
                imagem: 'https://i.ibb.co/99CJr1qX/moletom.png',
                quantidadeInicial: 20
            },
            {
                nome: 'Calça Jogger Glowered',
                tipo: 'calca',
                cor: 'Verde',
                descricao: 'Calça jogger estilo streetwear',
                preco: 139.90,
                promocao: 15,
                material: 'Sarja',
                tamanho: '40',
                imagem: 'https://i.ibb.co/0yYNCH87/calca.png',
                quantidadeInicial: 35
            },
            {
                nome: 'Mochila Glowered',
                tipo: 'acessorio',
                cor: 'Azul',
                descricao: 'Mochila resistente com compartimento para notebook',
                preco: 199.90,
                promocao: null,
                material: 'Poliéster',
                tamanho: 'M',
                imagem: 'https://i.ibb.co/4R17Pbgm/acessorios.png',
                quantidadeInicial: 15
            },
            {
                nome: 'Camisa Glowered Limited',
                tipo: 'camisa',
                cor: 'Vermelha',
                descricao: 'Edição limitada com estampa especial',
                preco: 99.90,
                promocao: 30,
                material: 'Algodão',
                tamanho: 'G',
                imagem: 'https://i.ibb.co/8nNKrMdZ/camisa.png',
                quantidadeInicial: 10
            },
            {
                nome: 'Meias Glowered Pack',
                tipo: 'acessorio',
                cor: 'Branco',
                descricao: 'Pack com 3 pares de meias personalizadas',
                preco: 39.90,
                promocao: 10,
                material: 'Algodão',
                tamanho: 'Único',
                imagem: 'https://i.ibb.co/4R17Pbgm/acessorios.png',
                quantidadeInicial: 80
            }
        ];

        let produtosCriados = 0;

        for (const produtoData of produtos) {
            // Verificar se produto já existe
            const produtoExistente = await Produto.findOne({
                where: { nome: produtoData.nome }
            });

            if (!produtoExistente) {
                // Criar produto
                const produto = await Produto.create({
                    nome: produtoData.nome,
                    tipo: produtoData.tipo,
                    cor: produtoData.cor,
                    descricao: produtoData.descricao,
                    preco: produtoData.preco,
                    promocao: produtoData.promocao,
                    material: produtoData.material,
                    tamanho: produtoData.tamanho,
                    imagem: produtoData.imagem,
                    ativo: true
                });

                // Criar estoque inicial
                if (produtoData.quantidadeInicial > 0) {
                    await Estoque.create({
                        idProduto: produto.codProduto,
                        quantidade: produtoData.quantidadeInicial,
                        movimentacao: 'Estoque inicial'
                    });
                }

                produtosCriados++;
                console.log(`✅ ${produto.nome} criado com ${produtoData.quantidadeInicial} unidades`);
            } else {
                console.log(`⚠️ ${produtoData.nome} já existe, pulando...`);
            }
        }

        console.log(`🎉 Seed concluído! ${produtosCriados} produtos criados.`);

    } catch (error) {
        console.error('❌ Erro no seed de produtos:', error);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    seedProdutos();
}

module.exports = seedProdutos;