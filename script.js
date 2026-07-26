// ================================
// BANCO DE DADOS DAS PEÇAS
// ================================

const pecas = [
    {
        codigo: "GM001",
        nome: "Alternador Bosch 120A",
        marca: "Chevrolet",
        categoria: "Elétrica",
        preco: 1250,
        imagem: "https://picsum.photos/400/250?random=1"
    },

    {
        codigo: "VW002",
        nome: "Pastilha de Freio Dianteira",
        marca: "Volkswagen",
        categoria: "Freios",
        preco: 180,
        imagem: "https://picsum.photos/400/250?random=2"
    },

    {
        codigo: "FI003",
        nome: "Amortecedor Dianteiro",
        marca: "Fiat",
        categoria: "Suspensão",
        preco: 420,
        imagem: "https://picsum.photos/400/250?random=3"
    },

    {
        codigo: "FD004",
        nome: "Filtro de Óleo",
        marca: "Ford",
        categoria: "Motor",
        preco: 45,
        imagem: "https://picsum.photos/400/250?random=4"
    },

    {
        codigo: "TY005",
        nome: "Bomba de Combustível",
        marca: "Toyota",
        categoria: "Motor",
        preco: 620,
        imagem: "https://picsum.photos/400/250?random=5"
    },

    {
        codigo: "GM006",
        nome: "Farol Direito",
        marca: "Chevrolet",
        categoria: "Elétrica",
        preco: 790,
        imagem: "https://picsum.photos/400/250?random=6"
    }
];

// ================================
// ELEMENTOS DA PÁGINA
// ================================

const catalogo = document.getElementById("catalogo");
const pesquisa = document.getElementById("pesquisa");
const marca = document.getElementById("marca");
const categoria = document.getElementById("categoria");

// ================================
// FORMATA PREÇO
// ================================

function dinheiro(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// ================================
// EXIBE AS PEÇAS
// ================================

function mostrarPecas(lista) {

    catalogo.innerHTML = "";

    if (lista.length === 0) {

        catalogo.innerHTML =
            "<h2>Nenhuma peça encontrada.</h2>";

        return;
    }

    lista.forEach(peca => {

        catalogo.innerHTML += `

        <div class="card">

            <img src="${peca.imagem}" alt="${peca.nome}">

            <h2>${peca.nome}</h2>

            <p><strong>Código:</strong> ${peca.codigo}</p>

            <p><strong>Marca:</strong> ${peca.marca}</p>

            <p><strong>Categoria:</strong> ${peca.categoria}</p>

            <div class="preco">${dinheiro(peca.preco)}</div>

            <button onclick="abrirProduto('${peca.codigo}')">
    Ver Detalhes
</button>
        </div>

        `;

    });

}

// ================================
// FILTROS
// ================================

function filtrar() {

    let texto = pesquisa.value.toLowerCase();

    let marcaSelecionada = marca.value;

    let categoriaSelecionada = categoria.value;

    let resultado = pecas.filter(peca => {

        let encontrouTexto =
            peca.nome.toLowerCase().includes(texto) ||
            peca.codigo.toLowerCase().includes(texto);

        let encontrouMarca =
            marcaSelecionada === "" ||
            peca.marca === marcaSelecionada;

        let encontrouCategoria =
            categoriaSelecionada === "" ||
            peca.categoria === categoriaSelecionada;

        return encontrouTexto &&
               encontrouMarca &&
               encontrouCategoria;

    });

    mostrarPecas(resultado);

}

// ================================
// EVENTOS
// ================================

pesquisa.addEventListener("input", filtrar);

marca.addEventListener("change", filtrar);

categoria.addEventListener("change", filtrar);

// ================================
// DETALHES
// ================================

function detalhes(codigo){

    const peca = pecas.find(p => p.codigo === codigo);

    alert(

`Peça: ${peca.nome}

Código: ${peca.codigo}

Marca: ${peca.marca}

Categoria: ${peca.categoria}

Preço: ${dinheiro(peca.preco)}`

    );

}

// ================================
// INICIAR
// ================================

mostrarPecas(pecas);

function abrirProduto(codigo){

    window.location.href =
        `produto.html?codigo=${codigo}`;

}
