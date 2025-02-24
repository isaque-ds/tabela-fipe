const API_BASE = 'https://parallelum.com.br/fipe/api/v1';

const elementos = {
    tipo: document.getElementById('tipo'),
    marca: document.getElementById('marca'),
    modelo: document.getElementById('modelo'),
    ano: document.getElementById('ano'),
    consultar: document.getElementById('consultar'),
    resultado: document.getElementById('resultado')
};

async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        return null;
    }
}

async function carregarMarcas() {
    elementos.marca.innerHTML = '<option value="">Carregando...</option>';
    elementos.marca.disabled = true;

    const marcas = await fetchAPI(`/${elementos.tipo.value}/marcas`);

    if (marcas) {
        elementos.marca.innerHTML = '<option value="">Selecione uma marca</option>';
        marcas.forEach(marca => {
            elementos.marca.innerHTML += `<option value="${marca.codigo}">${marca.nome}</option>`;
        });
        elementos.marca.disabled = false;
    }
}

async function carregarModelos() {
    elementos.modelo.innerHTML = '<option value="">Carregando...</option>';
    elementos.modelo.disabled = true;

    const modelos = await fetchAPI(`/${elementos.tipo.value}/marcas/${elementos.marca.value}/modelos`);

    if (modelos) {
        elementos.modelo.innerHTML = '<option value="">Selecione um modelo</option>';
        modelos.modelos.forEach(modelo => {
            elementos.modelo.innerHTML += `<option value="${modelo.codigo}">${modelo.nome}</option>`;
        });
        elementos.modelo.disabled = false;
    }
}

async function carregarAnos() {
    elementos.ano.innerHTML = '<option value="">Carregando...</option>';
    elementos.ano.disabled = true;

    const anos = await fetchAPI(`/${elementos.tipo.value}/marcas/${elementos.marca.value}/modelos/${elementos.modelo.value}/anos`);

    if (anos) {
        elementos.ano.innerHTML = '<option value="">Selecione um ano</option>';
        anos.forEach(ano => {
            elementos.ano.innerHTML += `<option value="${ano.codigo}">${ano.nome}</option>`;
        });
        elementos.ano.disabled = false;
    }
}

async function consultarPreco() {
    elementos.consultar.disabled = true;
    elementos.resultado.innerHTML = 'Consultando...';
    elementos.resultado.classList.add('ativo');

    const preco = await fetchAPI(`/${elementos.tipo.value}/marcas/${elementos.marca.value}/modelos/${elementos.modelo.value}/anos/${elementos.ano.value}`);

    if (preco) {
        elementos.resultado.innerHTML = `
            <h3>${preco.Marca} ${preco.Modelo}</h3>
            <p>Ano: ${preco.AnoModelo}</p>
            <p>Valor: ${preco.Valor}</p>
            <p>Combustível: ${preco.Combustivel}</p>
        `;
    } else {
        elementos.resultado.innerHTML = 'Erro ao consultar preço';
    }

    elementos.consultar.disabled = false;
}

// Event Listeners
elementos.tipo.addEventListener('change', () => {
    carregarMarcas();
    elementos.modelo.innerHTML = '<option value="">Selecione um modelo</option>';
    elementos.modelo.disabled = true;
    elementos.ano.innerHTML = '<option value="">Selecione um ano</option>';
    elementos.ano.disabled = true;
    elementos.consultar.disabled = true;
});

elementos.marca.addEventListener('change', () => {
    if (elementos.marca.value) {
        carregarModelos();
        elementos.ano.innerHTML = '<option value="">Selecione um ano</option>';
        elementos.ano.disabled = true;
        elementos.consultar.disabled = true;
    }
});

elementos.modelo.addEventListener('change', () => {
    if (elementos.modelo.value) {
        carregarAnos();
        elementos.consultar.disabled = true;
    }
});

elementos.ano.addEventListener('change', () => {
    elementos.consultar.disabled = !elementos.ano.value;
});

elementos.consultar.addEventListener('click', consultarPreco);

// Carregar marcas inicialmente
carregarMarcas();
