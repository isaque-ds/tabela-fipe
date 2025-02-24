// URL base da API FIPE
const API_BASE = 'https://parallelum.com.br/fipe/api/v1';

// Objeto com referências para todos os elementos DOM que serão utilizados
const elementos = {
    tipo: document.getElementById('tipo'),
    marca: document.getElementById('marca'),
    modelo: document.getElementById('modelo'),
    ano: document.getElementById('ano'),
    consultar: document.getElementById('consultar'),
    resultado: document.getElementById('resultado')
};

// Função auxiliar para fazer requisições à API
// Recebe o endpoint e retorna os dados em JSON
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        return null;
    }
}

// Carrega a lista de marcas disponíveis para o tipo de veículo selecionado
async function carregarMarcas() {
    // Mostra feedback de carregamento e desabilita o select
    elementos.marca.innerHTML = '<option value="">Carregando...</option>';
    elementos.marca.disabled = true;

    // Busca as marcas na API
    const marcas = await fetchAPI(`/${elementos.tipo.value}/marcas`);

    // Se obteve resposta, preenche o select com as marcas
    if (marcas) {
        elementos.marca.innerHTML = '<option value="">Selecione uma marca</option>';
        marcas.forEach(marca => {
            elementos.marca.innerHTML += `<option value="${marca.codigo}">${marca.nome}</option>`;
        });
        elementos.marca.disabled = false;
    }
}

// Carrega os modelos disponíveis para a marca selecionada
async function carregarModelos() {
    // Mostra feedback de carregamento e desabilita o select
    elementos.modelo.innerHTML = '<option value="">Carregando...</option>';
    elementos.modelo.disabled = true;

    // Busca os modelos na API
    const modelos = await fetchAPI(`/${elementos.tipo.value}/marcas/${elementos.marca.value}/modelos`);

    // Se obteve resposta, preenche o select com os modelos
    if (modelos) {
        elementos.modelo.innerHTML = '<option value="">Selecione um modelo</option>';
        modelos.modelos.forEach(modelo => {
            elementos.modelo.innerHTML += `<option value="${modelo.codigo}">${modelo.nome}</option>`;
        });
        elementos.modelo.disabled = false;
    }
}

// Carrega os anos disponíveis para o modelo selecionado
async function carregarAnos() {
    // Mostra feedback de carregamento e desabilita o select
    elementos.ano.innerHTML = '<option value="">Carregando...</option>';
    elementos.ano.disabled = true;

    // Busca os anos na API
    const anos = await fetchAPI(`/${elementos.tipo.value}/marcas/${elementos.marca.value}/modelos/${elementos.modelo.value}/anos`);

    // Se obteve resposta, preenche o select com os anos
    if (anos) {
        elementos.ano.innerHTML = '<option value="">Selecione um ano</option>';
        anos.forEach(ano => {
            elementos.ano.innerHTML += `<option value="${ano.codigo}">${ano.nome}</option>`;
        });
        elementos.ano.disabled = false;
    }
}

// Consulta o preço do veículo com base nas seleções feitas
async function consultarPreco() {
    // Desabilita o botão e mostra feedback de carregamento
    elementos.consultar.disabled = true;
    elementos.resultado.innerHTML = 'Consultando...';
    elementos.resultado.classList.add('ativo');

    // Busca os dados do veículo na API
    const preco = await fetchAPI(`/${elementos.tipo.value}/marcas/${elementos.marca.value}/modelos/${elementos.modelo.value}/anos/${elementos.ano.value}`);

    // Se obteve resposta, exibe os dados do veículo
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

// === Event Listeners ===

// Quando mudar o tipo de veículo, recarrega as marcas e reseta os outros campos
elementos.tipo.addEventListener('change', () => {
    carregarMarcas();
    elementos.modelo.innerHTML = '<option value="">Selecione um modelo</option>';
    elementos.modelo.disabled = true;
    elementos.ano.innerHTML = '<option value="">Selecione um ano</option>';
    elementos.ano.disabled = true;
    elementos.consultar.disabled = true;
});

// Quando selecionar uma marca, carrega os modelos e reseta os campos seguintes
elementos.marca.addEventListener('change', () => {
    if (elementos.marca.value) {
        carregarModelos();
        elementos.ano.innerHTML = '<option value="">Selecione um ano</option>';
        elementos.ano.disabled = true;
        elementos.consultar.disabled = true;
    }
});

// Quando selecionar um modelo, carrega os anos disponíveis
elementos.modelo.addEventListener('change', () => {
    if (elementos.modelo.value) {
        carregarAnos();
        elementos.consultar.disabled = true;
    }
});

// Habilita o botão de consulta apenas quando um ano for selecionado
elementos.ano.addEventListener('change', () => {
    elementos.consultar.disabled = !elementos.ano.value;
});

// Adiciona o evento de click no botão de consulta
elementos.consultar.addEventListener('click', consultarPreco);

// Carrega a lista inicial de marcas quando a página é carregada
carregarMarcas();
