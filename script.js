// --- BASE DE DADOS (Simulação) ---
const veiculosDB = {
  volkswagen: {
    gol: [2010, 2011, 2012, 2013, 2014, 2015],
    saveiro: [2011, 2012, 2013, 2014, 2015, 2016]
  },
  fiat: {
    uno: [2010, 2011, 2012, 2013],
    palio: [2012, 2013, 2014, 2015]
  },
  chevrolet: {
    onix: [2013, 2014, 2015, 2016, 2017, 2018]
  }
};

const produtosDB = [
  {
    id: 1,
    nome: "Jogo de Velas de Ignição",
    oem: "BKR6E-11",
    preco: 120.00,
    imagem: "https://via.placeholder.com/200?text=Velas+de+Ignicao",
    compatibilidade: [
      { marca: "volkswagen", modelo: "gol", anos: [2010, 2011, 2012, 2013] },
      { marca: "volkswagen", modelo: "saveiro", anos: [2011, 2012, 2013] }
    ]
  },
  {
    id: 2,
    nome: "Bobina de Ignição 4 Pinos",
    oem: "032905106B",
    preco: 280.50,
    imagem: "https://via.placeholder.com/200?text=Bobina+Ignicao",
    compatibilidade: [
      { marca: "volkswagen", modelo: "gol", anos: [2010, 2011, 2012, 2013, 2014, 2015] },
      { marca: "volkswagen", modelo: "saveiro", anos: [2011, 2012, 2013, 2014, 2015, 2016] }
    ]
  },
  {
    id: 3,
    nome: "Kit Pastilha de Freio Dianteira",
    oem: "PD1042",
    preco: 95.00,
    imagem: "https://via.placeholder.com/200?text=Pastilha+Freio",
    compatibilidade: [
      { marca: "fiat", modelo: "palio", anos: [2012, 2013, 2014] },
      { marca: "chevrolet", modelo: "onix", anos: [2013, 2014, 2015] }
    ]
  }
];

let carrinhoCount = 0;

// --- ELEMENTOS DO DOM ---
const selectMarca = document.getElementById('select-marca');
const selectModelo = document.getElementById('select-modelo');
const selectAno = document.getElementById('select-ano');
const btnFiltrar = document.getElementById('btn-filtrar');
const btnLimpar = document.getElementById('btn-limpar');
const filterStatus = document.getElementById('filter-status');
const productGrid = document.getElementById('product-grid');
const catalogTitle = document.getElementById('catalog-title');
const cartCount = document.getElementById('cart-count');

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
  carregarMarcas();
  renderizarProdutos(produtosDB);
});

// Popula o select de marcas
function carregarMarcas() {
  for (let marca in veiculosDB) {
    const option = document.createElement('option');
    option.value = marca;
    option.textContent = marca.toUpperCase();
    selectMarca.appendChild(option);
  }
}

// Evento ao mudar a marca
selectMarca.addEventListener('change', (e) => {
  const marca = e.target.value;
  selectModelo.innerHTML = '<option value="">2. Selecione o Modelo</option>';
  selectAno.innerHTML = '<option value="">3. Selecione o Ano</option>';
  selectModelo.disabled = !marca;
  selectAno.disabled = true;
  btnFiltrar.disabled = true;

  if (marca) {
    for (let modelo in veiculosDB[marca]) {
      const option = document.createElement('option');
      option.value = modelo;
      option.textContent = modelo.toUpperCase();
      selectModelo.appendChild(option);
    }
  }
});

// Evento ao mudar o modelo
selectModelo.addEventListener('change', (e) => {
  const marca = selectMarca.value;
  const modelo = e.target.value;
  selectAno.innerHTML = '<option value="">3. Selecione o Ano</option>';
  selectAno.disabled = !modelo;
  btnFiltrar.disabled = true;

  if (modelo) {
    const anos = veiculosDB[marca][modelo];
    anos.forEach(ano => {
      const option = document.createElement('option');
      option.value = ano;
      option.textContent = ano;
      selectAno.appendChild(option);
    });
  }
});

// Evento ao mudar o ano
selectAno.addEventListener('change', (e) => {
  btnFiltrar.disabled = !e.target.value;
});

// --- LÓGICA DE FILTRAGEM ---
btnFiltrar.addEventListener('click', () => {
  const marca = selectMarca.value;
  const modelo = selectModelo.value;
  const ano = parseInt(selectAno.value);

  const produtosFiltrADOS = produtosDB.filter(produto => {
    return produto.compatibilidade.some(c => 
      c.marca === marca && 
      c.modelo === modelo && 
      c.anos.includes(ano)
    );
  });

  const textoVeiculo = `${selectMarca.options[selectMarca.selectedIndex].text} ${selectModelo.options[selectModelo.selectedIndex].text} ${ano}`;
  
  filterStatus.textContent = `Mostrando peças compatíveis com: ${textoVeiculo}`;
  catalogTitle.textContent = `Peças Compatíveis`;
  btnLimpar.style.display = 'inline-block';

  renderizarProdutos(produtosFiltrADOS, textoVeiculo);
});

btnLimpar.addEventListener('click', () => {
  selectMarca.value = '';
  selectModelo.innerHTML = '<option value="">2. Selecione o Modelo</option>';
  selectAno.innerHTML = '<option value="">3. Selecione o Ano</option>';
  selectModelo.disabled = true;
  selectAno.disabled = true;
  btnFiltrar.disabled = true;
  btnLimpar.style.display = 'none';
  filterStatus.textContent = '';
  catalogTitle.textContent = 'Todas as Peças';

  renderizarProdutos(produtosDB);
});

// --- RENDERIZAÇÃO NA TELA ---
function renderizarProdutos(produtos, veiculoFiltrado = null) {
  productGrid.innerHTML = '';

  if (produtos.length === 0) {
    productGrid.innerHTML = '<p>Nenhuma peça encontrada para o veículo selecionado.</p>';
    return;
  }

  produtos.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'product-card';

    let badgeHTML = '';
    if (veiculoFiltrado) {
      badgeHTML = `<span class="badge-compatible">✓ Compatível com ${veiculoFiltrado}</span>`;
    }

    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      ${badgeHTML}
      <div class="oem-code">Cód. OEM: ${produto.oem}</div>
      <h3 class="product-title">${produto.nome}</h3>
      <div class="product-price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
      <button class="btn-add-cart" onclick="adicionarAoCarrinho()">Adicionar ao Carrinho</button>
    `;

    productGrid.appendChild(card);
  });
}

function adicionarAoCarrinho() {
  carrinhoCount++;
  cartCount.textContent = carrinhoCount;
}
