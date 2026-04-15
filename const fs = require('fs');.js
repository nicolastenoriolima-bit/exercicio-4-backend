seu-projeto/
├── dados/
│   └── produtos.json
└── app.js
[
  { "id": 1, "nome": "Notebook", "preco": 2500, "estoque": 10 },
  { "id": 2, "nome": "Mouse", "preco": 50, "estoque": 50 },
  { "id": 3, "nome": "Teclado", "preco": 120, "estoque": 30 }
]
const fs = require('fs');
const path = require('path');

// Caminho do arquivo
const dadosPath = path.join(__dirname, 'dados', 'produtos.json');

// Função auxiliar para ler o arquivo
function lerArquivo() {
    try {
        const dados = fs.readFileSync(dadosPath, 'utf-8');
        return JSON.parse(dados);
    } catch (error) {
        return []; // Retorna array vazio se o arquivo não existir
    }
}

// Função auxiliar para salvar o arquivo
function salvarArquivo(dados) {
    fs.writeFileSync(dadosPath, JSON.stringify(dados, null, 2), 'utf-8');
}

// 1.listarProdutos()
function listarProdutos() {
    const produtos = lerArquivo();
    console.log('\n--- Lista de Produtos ---');
    console.table(produtos); // Exibe em formato de tabela

    const totalEstoque = produtos.reduce((soma, p) => soma + (p.preco * p.estoque), 0);
    console.log(`Valor total do estoque: R$ ${totalEstoque.toFixed(2)}`);
}

// 2.adicionarProduto(nome, preco, estoque)
function adicionarProduto(nome, preco, estoque) {
    const produtos = lerArquivo();
    
    // Gera novo ID
    const maxId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) : 0;
    const novoProduto = { id: maxId + 1, nome, preco, estoque };
    
    produtos.push(novoProduto);
    salvarArquivo(produtos);
    console.log(`\nProduto "${nome}" adicionado com sucesso! (ID: ${novoProduto.id})`);
}

// 3.buscarProduto(id)
function buscarProduto(id) {
    const produtos = lerArquivo();
    const produto = produtos.find(p => p.id === id);
    
    if (produto) {
        console.log('\nProduto encontrado:', produto);
    } else {
        console.log(`\nErro: Produto com ID ${id} não encontrado.`);
    }
}

// 4.atualizarEstoque(id, quantidade)
function atualizarEstoque(id, novaQuantidade) {
    const produtos = lerArquivo();
    const index = produtos.findIndex(p => p.id === id);
    
    if (index !== -1) {
        const antes = produtos[index].estoque;
        produtos[index].estoque = novaQuantidade;
        salvarArquivo(produtos);
        console.log(`\nEstoque atualizado (ID: ${id}): Antes=${antes}, Depois=${novaQuantidade}`);
    } else {
        console.log(`\nErro: Produto ID ${id} não encontrado.`);
    }
}

// 5.removerProduto(id)
function removerProduto(id) {
    let produtos = lerArquivo();
    const produtosFiltrados = produtos.filter(p => p.id !== id);
    
    if (produtos.length === produtosFiltrados.length) {
        console.log(`\nErro: Produto ID ${id} não encontrado para remoção.`);
    } else {
        salvarArquivo(produtosFiltrados);
        console.log(`\nProduto ID ${id} removido com sucesso.`);
    }
}

// 6.produtosEmFalta(limite)
function produtosEmFalta(limite) {
    const produtos = lerArquivo();
    const falta = produtos.filter(p => p.estoque < limite);
    
    console.log(`\n--- Produtos com menos de ${limite} unidades ---`);
    if (falta.length > 0) {
        console.table(falta);
        console.log('Sugestão: Fazer um novo pedido destes produtos.');
    } else {
        console.log('Nenhum produto em falta.');
    }
}

// --- Testando as funcionalidades ---
listarProdutos();
adicionarProduto('Monitor', 900, 5);
atualizarEstoque(2, 45); // Mouse
produtosEmFalta(15);
removerProduto(3); // Teclado
listarProdutos();


