const { Produto, Estoque } = require('../model/rel');

async function seedProdutos() {
    try {
        console.log('🌱 Iniciando seed de produtos...');

        const produtos = [
            {
                nome: 'Camisa Básica Preta',
                tipo: 'camisa',
                cor: 'Preta',
                descricao: 'Camisa de algodão básica ideal para o dia a dia',
                preco: 69.90,
                promocao: 15,
                material: 'Algodão',
                tamanho: 'M',
                imagem: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
                quantidadeInicial: 50
            },
            {
                nome: 'Moletom Confort Cinza',
                tipo: 'moletom',
                cor: 'Cinza',
                descricao: 'Moletom comfort com capuz e bolso frontal',
                preco: 129.90,
                promocao: 20,
                material: 'Algodão',
                tamanho: 'G',
                imagem: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80',
                quantidadeInicial: 30
            },
            {
                nome: 'Calça Jeans Slim',
                tipo: 'calca',
                cor: 'Azul',
                descricao: 'Calça jeans slim fit com lavagem moderna',
                preco: 119.90,
                promocao: 10,
                material: 'Jeans',
                tamanho: '42',
                imagem: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80',
                quantidadeInicial: 25
            },
            {
                nome: 'Boné Ajustável Preto',
                tipo: 'acessorio',
                cor: 'Preto',
                descricao: 'Boné ajustável com fechamento em plástico',
                preco: 49.90,
                promocao: null,
                material: 'Algodão',
                tamanho: 'Único',
                imagem: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500&q=80',
                quantidadeInicial: 100
            },
            {
                nome: 'Camisa Básica Branca',
                tipo: 'camisa',
                cor: 'Branca',
                descricao: 'Camisa básica branca versátil para qualquer ocasião',
                preco: 59.90,
                promocao: 5,
                material: 'Algodão',
                tamanho: 'P',
                imagem: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80',
                quantidadeInicial: 40
            },
            {
                nome: 'Moletom Premium Preto',
                tipo: 'moletom',
                cor: 'Preto',
                descricao: 'Moletom premium com acabamento de qualidade',
                preco: 159.90,
                promocao: 25,
                material: 'Algodão',
                tamanho: 'GG',
                imagem: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80',
                quantidadeInicial: 20
            },
            {
                nome: 'Calça Jogger Verde',
                tipo: 'calca',
                cor: 'Verde',
                descricao: 'Calça jogger estilo casual e confortável',
                preco: 99.90,
                promocao: 15,
                material: 'Sarja',
                tamanho: '40',
                imagem: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80',
                quantidadeInicial: 35
            },
            {
                nome: 'Mochila Executiva',
                tipo: 'acessorio',
                cor: 'Azul',
                descricao: 'Mochila resistente com compartimento para notebook',
                preco: 179.90,
                promocao: null,
                material: 'Poliéster',
                tamanho: 'M',
                imagem: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
                quantidadeInicial: 15
            },
            {
                nome: 'Camisa Vermelha Básica',
                tipo: 'camisa',
                cor: 'Vermelha',
                descricao: 'Camisa vermelha básica de algodão puro',
                preco: 79.90,
                promocao: 30,
                material: 'Algodão',
                tamanho: 'G',
                imagem: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80',
                quantidadeInicial: 10
            },
            {
                nome: 'Kit Meias Esportivas',
                tipo: 'acessorio',
                cor: 'Branco',
                descricao: 'Pack com 3 pares de meias esportivas',
                preco: 29.90,
                promocao: 10,
                material: 'Algodão',
                tamanho: 'Único',
                imagem: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80',
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