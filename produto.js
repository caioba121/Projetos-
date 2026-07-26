// ===============================
// produto.js
// ===============================

// Obtém o código da peça da URL
const parametros = new URLSearchParams(window.location.search);
const codigo = parametros.get("codigo");

// Formata preço em Real
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Carrega a peça
async function carregarProduto() {

    try {

        const resposta = await fetch("dados/pecas.json");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar o catálogo.");
        }

        const pecas = await resposta.json();

        const peca = pecas.find(item => item.codigo === codigo);

        if (!peca) {

            document.body.innerHTML = `
                <div style="text-align:center;padding:60px;font-family:Arial;">
                    <h1>Peça não encontrada</h1>
                    <p>O código informado não existe.</p>
                    <br>
                    <a href="index.html">Voltar ao catálogo</a>
                </div>
            `;

            return;
        }

        // Preenche a página

        document.getElementById("nome").textContent = peca.nome;

        document.getElementById("codigo").textContent = peca.codigo;

        document.getElementById("marca").textContent = peca.marca;

        document.getElementById("modelo").textContent = peca.modelo;

        document.getElementById("ano").textContent = peca.ano;

        document.getElementById("categoria").textContent = peca.categoria;

        document.getElementById("preco").textContent =
            formatarPreco(peca.preco);

        document.getElementById("imagem").src = peca.imagem;

        document.getElementById("imagem").alt = peca.nome;

        // Se existir descrição no JSON
        if (peca.descricao) {

            document.getElementById("descricao").textContent =
                peca.descricao;

        } else {

            document.getElementById("descricao").textContent =
                "Peça automotiva de alta qualidade, pronta para instalação e compatível com os veículos informados.";

        }

        // Botão de orçamento
        const botao = document.querySelector(".comprar");

        botao.addEventListener("click", () => {

            const mensagem =
`Olá!
Tenho interesse nesta peça.

Código: ${peca.codigo}
Peça: ${peca.nome}
Veículo: ${peca.marca} ${peca.modelo} ${peca.ano}`;

            // Troque pelo seu número
            const telefone = "5511999999999";

            const url =
                `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

            window.open(url, "_blank");

        });

    } catch (erro) {

        console.error(erro);

        document.body.innerHTML = `
            <div style="text-align:center;padding:60px;">
                <h2>Erro ao carregar os dados.</h2>
            </div>
        `;
    }

}

// Inicia
carregarProduto();
