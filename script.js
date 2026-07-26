// ================================================
// CATÁLOGO DE PEÇAS AUTOMOTIVAS - SCRIPT PRINCIPAL
// ================================================

/**
 * Estado global da aplicação
 */
let pecas = [];

// ================================================
// REFERÊNCIAS DO DOM
// ================================================
const catalogo = document.getElementById("catalogo");
const pesquisa = document.getElementById("pesquisa");
const marca = document.getElementById("marca");
const categoria = document.getElementById("categoria");
const totalProdutos = document.getElementById("total-produtos");
const btnLimparFiltros = document.getElementById("limpar-filtros");

// ================================================
// UTILITÁRIOS E FORMATAÇÃO
// ================================================

/**
 * Formata valores numéricos para a moeda Real (BRL)
 * @param {number} valor 
 * @returns {string} Valor formatado em R$
 */
function dinheiro(valor) {
    const numero = Number(valor) || 0;
    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

/**
 * Normaliza textos removendo espaços extras e convertendo para minúsculas
 * @param {string} texto 
 * @returns {string}
 */
function normalizarTexto(texto) {
    return (texto || "").toString().trim().toLowerCase();
}

/**
 * Garante um fallback visual caso a imagem falhe ao carregar
 * @param {HTMLImageElement} imgElement 
 */
function tratarErroImagem(imgElement) {
    imgElement.onerror = null;
    imgElement.src = "https://via.placeholder.com/400x250?text=Imagem+Indispon%C3%ADvel";
}

// ================================================
// CARREGAMENTO DE DADOS (JSON + ADMIN / LOCALSTORAGE)
// ================================================

/**
 * Sincroniza e carrega as peças a partir de fonte remota (JSON) ou local (LocalStorage)
 */
async function carregarPecas() {
    try {
        // 1. Verifica se existem peças cadastradas via Painel Admin (LocalStorage)
        const pecasSalvas = localStorage.getItem("banco_pecas");

        if (pecasSalvas) {
            pecas = JSON.parse(pecasSalvas);
        } else {
            // 2. Se não houver dados locais, busca do arquivo pecas.json
            const resposta = await fetch("dados/pecas.json");

            if (!resposta.ok) {
                throw new Error(`Falha na requisição: ${resposta.status}`);
            }

            pecas = await resposta.json();
            
            // Salva no LocalStorage para sincronia com o painel Admin
            localStorage.setItem("banco_pecas", JSON.stringify(pecas));
        }

        // Popula os seletores de filtros dinamicamente e renderiza a tela
        preencherOpcoesFiltros(pecas);
        mostrarPecas(pecas);

    } catch (erro) {
        console.error("Erro ao carregar o catálogo de peças:", erro);
        exibirMensagemErro("Não foi possível carregar as peças. Tente novamente mais tarde.");
    }
}

// ================================================
// RENDERIZAÇÃO DA INTERFACE
// ================================================

/**
 * Exibe o grid de cartões de produtos na tela
 * @param {Array} listaDePecas 
 */
function mostrarPecas(listaDePecas) {
    if (!catalogo) return;

    catalogo.innerHTML = "";

    // Atualiza contador se o elemento existir no HTML
    if (totalProdutos) {
        totalProdutos.textContent = `${listaDePecas.length} peça(s) encontrada(s)`;
    }

    if (listaDePecas.length === 0) {
        catalogo.innerHTML = `
            <div class="sem-resultados">
                <h2>Nenhuma peça encontrada.</h2>
                <p>Tente ajustar os termos da pesquisa ou limpar os filtros selecionados.</p>
            </div>
        `;
        return;
    }

    listaDePecas.forEach(peca => {
        const card = document.createElement("div");
        card.className = "card";

        const caminhoImagem = peca.imagem || "https://via.placeholder.com/400x250?text=Sem+Foto";

        card.innerHTML = `
            <div class="card-imagem">
                <img src="${caminhoImagem}" alt="${peca.nome}" onerror="tratarErroImagem(this)">
            </div>
            <div class="card-conteudo">
                <span class="card-categoria">${peca.categoria || 'Geral'}</span>
                <h2>${peca.nome}</h2>
                <p class="card-info"><strong>Código:</strong> ${peca.codigo}</p>
                <p class="card-info"><strong>Marca:</strong> ${peca.marca}</p>
                <div class="preco">${dinheiro(peca.preco)}</div>
                <button class="btn-detalhes" onclick="abrirProduto('${peca.codigo}')">
                    Ver Detalhes
                </button>
            </div>
        `;

        catalogo.appendChild(card);
    });
}

/**
 * Exibe mensagem de erro estilizada no catálogo
 * @param {string} mensagem 
 */
function exibirMensagemErro(mensagem) {
    if (!catalogo) return;
    catalogo.innerHTML = `
        <div class="card-erro">
            <h2>Ops! Algo deu errado.</h2>
            <p>${mensagem}</p>
        </div>
    `;
}

// ================================================
// FILTROS E PESQUISA AUTOMÁTICA
// ================================================

/**
 * Aplica os filtros combinados de busca por texto, marca e categoria
 */
function filtrar() {
    const termoBusca = normalizarTexto(pesquisa ? pesquisa.value : "");
    const marcaSelecionada = marca ? marca.value : "";
    const categoriaSelecionada = categoria ? categoria.value : "";

    const resultado = pecas.filter(peca => {
        const nomeMatch = normalizarTexto(peca.nome).includes(termoBusca);
        const codigoMatch = normalizarTexto(peca.codigo).includes(termoBusca);
        const encontrouTexto = nomeMatch || codigoMatch;

        const encontrouMarca = marcaSelecionada === "" || peca.marca === marcaSelecionada;
        const encontrouCategoria = categoriaSelecionada === "" || peca.categoria === categoriaSelecionada;

        return encontrouTexto && encontrouMarca && encontrouCategoria;
    });

    mostrarPecas(resultado);
}

/**
 * Preenche dinamicamente os selects de Filtro com base nos dados reais
 * @param {Array} listaDePecas 
 */
function preencherOpcoesFiltros(listaDePecas) {
    if (!marca || !categoria) return;

    const marcasUnicas = [...new Set(listaDePecas.map(p => p.marca))].sort();
    const categoriasUnicas = [...new Set(listaDePecas.map(p => p.categoria))].sort();

    // Mantém a opção padrão "Todas" e adiciona as encontradas
    marca.innerHTML = '<option value="">Todas as Marcas</option>';
    marcasUnicas.forEach(m => {
        if (m) marca.innerHTML += `<option value="${m}">${m}</option>`;
    });

    categoria.innerHTML = '<option value="">Todas as Categorias</option>';
    categoriasUnicas.forEach(c => {
        if (c) categoria.innerHTML += `<option value="${c}">${c}</option>`;
    });
}

/**
 * Reseta todos os campos de filtro para o estado inicial
 */
function limparFiltros() {
    if (pesquisa) pesquisa.value = "";
    if (marca) marca.value = "";
    if (categoria) categoria.value = "";
    mostrarPecas(pecas);
}

// ================================================
// NAVEGAÇÃO E DETALHES DO PRODUTO
// ================================================

/**
 * Redireciona para a página individual do produto passando o código via URL
 * @param {string} codigo 
 */
function abrirProduto(codigo) {
    if (!codigo) return;
    window.location.href = `produto.html?codigo=${encodeURIComponent(codigo)}`;
}

/**
 * Exibe um alerta rápido com detalhes da peça (função utilitária de suporte)
 * @param {string} codigo 
 */
function detalhes(codigo) {
    const peca = pecas.find(p => p.codigo === codigo);

    if (!peca) {
        alert("Peça não encontrada!");
        return;
    }

    alert(
        `Peça: ${peca.nome}\n` +
        `Código: ${peca.codigo}\n` +
        `Marca: ${peca.marca}\n` +
        `Categoria: ${peca.categoria}\n` +
        `Preço: ${dinheiro(peca.preco)}`
    );
}

// ================================================
// REGISTRO DE EVENTOS E INICIALIZAÇÃO
// ================================================

function inicializarEventos() {
    if (pesquisa) pesquisa.addEventListener("input", filtrar);
    if (marca) marca.addEventListener("change", filtrar);
    if (categoria) categoria.addEventListener("change", filtrar);
    if (btnLimparFiltros) btnLimparFiltros.addEventListener("click", limparFiltros);

    // Escuta atualizações feitas pelo admin.html em outras abas
    window.addEventListener("storage", (evento) => {
        if (evento.key === "banco_pecas") {
            carregarPecas();
        }
    });
}

// Dispara o carregamento assim que o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    inicializarEventos();
    carregarPecas();
});
