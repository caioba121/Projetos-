// ==============================
// CHAVE DO LOCALSTORAGE
// ==============================

const STORAGE = "catalogo_pecas";

// ==============================
// ELEMENTOS
// ==============================

const formulario = document.getElementById("formulario");
const lista = document.getElementById("listaPecas");

let editando = null;

// ==============================
// CARREGA DADOS
// ==============================

let pecas = JSON.parse(localStorage.getItem(STORAGE)) || [];

// ==============================
// SALVAR
// ==============================

function salvar(){

    localStorage.setItem(STORAGE, JSON.stringify(pecas));

}

// ==============================
// LISTAR
// ==============================

function listar(){

    lista.innerHTML = "";

    pecas.forEach((peca,index)=>{

        lista.innerHTML += `

        <tr>

            <td>

                <img src="${peca.imagem}" width="70">

            </td>

            <td>${peca.codigo}</td>

            <td>${peca.nome}</td>

            <td>${peca.marca}</td>

            <td>

                ${Number(peca.preco).toLocaleString("pt-BR",{

                    style:"currency",

                    currency:"BRL"

                })}

            </td>

            <td>

                <button class="editar"

                onclick="editar(${index})">

                Editar

                </button>

                <button class="excluir"

                onclick="excluir(${index})">

                Excluir

                </button>

            </td>

        </tr>

        `;

    });

}

// ==============================
// CADASTRAR
// ==============================

formulario.addEventListener("submit",(e)=>{

    e.preventDefault();

    const novaPeca={

        codigo:codigo.value,

        nome:nome.value,

        marca:marca.value,

        modelo:modelo.value,

        ano:ano.value,

        categoria:categoria.value,

        preco:preco.value,

        imagem:imagem.value,

        descricao:descricao.value

    };

    if(editando===null){

        pecas.push(novaPeca);

    }else{

        pecas[editando]=novaPeca;

        editando=null;

    }

    salvar();

    listar();

    formulario.reset();

});

// ==============================
// EDITAR
// ==============================

function editar(i){

    editando=i;

    let p=pecas[i];

    codigo.value=p.codigo;

    nome.value=p.nome;

    marca.value=p.marca;

    modelo.value=p.modelo;

    ano.value=p.ano;

    categoria.value=p.categoria;

    preco.value=p.preco;

    imagem.value=p.imagem;

    descricao.value=p.descricao;

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

// ==============================
// EXCLUIR
// ==============================

function excluir(i){

    if(confirm("Deseja excluir esta peça?")){

        pecas.splice(i,1);

        salvar();

        listar();

    }

}

// ==============================
// DADOS DE EXEMPLO
// ==============================

if(pecas.length===0){

pecas=[

{

codigo:"GM001",

nome:"Alternador Bosch",

marca:"Chevrolet",

modelo:"Onix",

ano:"2022",

categoria:"Elétrica",

preco:1250,

imagem:"https://picsum.photos/300?1",

descricao:"Alternador original."

},

{

codigo:"VW001",

nome:"Pastilha de Freio",

marca:"Volkswagen",

modelo:"Gol",

ano:"2021",

categoria:"Freios",

preco:180,

imagem:"https://picsum.photos/300?2",

descricao:"Pastilha dianteira."

},

{

codigo:"FI001",

nome:"Amortecedor",

marca:"Fiat",

modelo:"Argo",

ano:"2023",

categoria:"Suspensão",

preco:420,

imagem:"https://picsum.photos/300?3",

descricao:"Amortecedor dianteiro."

}

];

salvar();

}

// ==============================
// INICIAR
// ==============================

listar();
