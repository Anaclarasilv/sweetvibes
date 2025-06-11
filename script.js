// Banco de dados simulado
let db = {
    clientes: [],
    comidas: [],
    servicos: [],
    movimentos: []
};

// Inicialização do localStorage
function initDB() {
    const savedDB = localStorage.getItem('restauranteDB');
    if (savedDB) {
        db = JSON.parse(savedDB);
        atualizarTabelas();
    }
}

// Salvar no localStorage
function saveDB() {
    localStorage.setItem('restauranteDB', JSON.stringify(db));
}

// Validação de CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let dv1 = resto > 9 ? 0 : resto;
    
    if (dv1 !== parseInt(cpf.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let dv2 = resto > 9 ? 0 : resto;
    
    return dv2 === parseInt(cpf.charAt(10));
}

// Validação de data de nascimento
function validarIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    
    return idade >= 12;
}

// Funções auxiliares para exibir mensagens
function mostrarMensagem(mensagem, tipo) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${mensagem}
        <button type="button" class="close" data-dismiss="alert">
            <span>&times;</span>
        </button>
    `;
    
    const modalBody = document.querySelector('#mensagemConteudo');
    modalBody.innerHTML = '';
    modalBody.appendChild(alertDiv);
    $('#mensagemModal').modal('show');
}

// Geradores de ID
function gerarId(collection) {
    return collection.length > 0 ? Math.max(...collection.map(item => item.id)) + 1 : 1;
}

// CRUD Clientes
document.getElementById('formCliente').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nomeCliente').value;
    const telefone = document.getElementById('telefoneCliente').value;
    const cpf = document.getElementById('cpfCliente').value;
    const dataNascimento = document.getElementById('dataNascCliente').value;
    
    if (!validarCPF(cpf)) {
        mostrarMensagem('CPF inválido!', 'danger');
        return;
    }
    
    if (!validarIdade(dataNascimento)) {
        mostrarMensagem('Cliente deve ter pelo menos 12 anos!', 'danger');
        return;
    }
    
    const cliente = {
        id: gerarId(db.clientes),
        nome,
        telefone,
        cpf,
        dataNascimento
    };
    
    db.clientes.push(cliente);
    saveDB();
    atualizarTabelaClientes();
    this.reset();
    mostrarMensagem('Cliente cadastrado com sucesso!', 'success');
});

// CRUD Comidas
document.getElementById('formComida').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nomePrato = document.getElementById('nomePrato').value;
    const bebidas = document.getElementById('bebidas').value;
    const acompanhamento = document.getElementById('acompanhamento').value;
    
    const comida = {
        id: gerarId(db.comidas),
        nomePrato,
        bebidas,
        acompanhamento
    };
    
    db.comidas.push(comida);
    saveDB();
    atualizarTabelaComidas();
    this.reset();
    mostrarMensagem('Comida cadastrada com sucesso!', 'success');
});

// CRUD Serviços
document.getElementById('formServico').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const descricao = document.getElementById('descricaoServico').value;
    const preco = parseFloat(document.getElementById('precoServico').value);
    
    const servico = {
        id: gerarId(db.servicos),
        descricao,
        preco
    };
    
    db.servicos.push(servico);
    saveDB();
    atualizarTabelaServicos();
    this.reset();
    mostrarMensagem('Serviço cadastrado com sucesso!', 'success');
});

// Registro de Movimentos
document.getElementById('formMovimento').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const clienteId = parseInt(document.getElementById('clienteMovimento').value);
    const comidaId = parseInt(document.getElementById('comidaMovimento').value);
    
    const servicosSelecionados = [
        'Delivery',
        'Retirada',
        'Rodízio',
        'Eventos',
        'MenuKids'
    ].filter(servico => document.getElementById('servico' + servico).checked);
    
    const formaPagamento = document.getElementById('formaPagamento').value;
    
    const movimento = {
        id: gerarId(db.movimentos),
        clienteId,
        comidaId,
        servicos: servicosSelecionados,
        formaPagamento,
        total: calcularTotal(comidaId, servicosSelecionados)
    };
    
    db.movimentos.push(movimento);
    saveDB();
    atualizarTabelaMovimentos();
    this.reset();
    mostrarMensagem('Movimento registrado com sucesso!', 'success');
});

// Função para calcular total
function calcularTotal(comidaId, servicos) {
    let total = 0;
    
    // Valor base da comida (simulado como 50)
    total += 50;
    
    // Adiciona valor dos serviços selecionados
    servicos.forEach(servico => {
        switch(servico) {
            case 'Delivery':
                total += 10;
                break;
            case 'Rodízio':
                total += 30;
                break;
            case 'Eventos':
                total += 100;
                break;
            case 'MenuKids':
                total += 25;
                break;
        }
    });
    
    return total;
}

// Funções de atualização das tabelas
function atualizarTabelas() {
    atualizarTabelaClientes();
    atualizarTabelaComidas();
    atualizarTabelaServicos();
    atualizarTabelaMovimentos();
    atualizarSelects();
}

function atualizarTabelaClientes() {
    const tbody = document.querySelector('#tabelaClientes tbody');
    tbody.innerHTML = '';
    
    db.clientes.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.cpf}</td>
            <td>${new Date(cliente.dataNascimento).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarCliente(${cliente.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="excluirCliente(${cliente.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarTabelaComidas() {
    const tbody = document.querySelector('#tabelaComidas tbody');
    tbody.innerHTML = '';
    
    db.comidas.forEach(comida => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${comida.id}</td>
            <td>${comida.nomePrato}</td>
            <td>${comida.bebidas}</td>
            <td>${comida.acompanhamento}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarComida(${comida.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="excluirComida(${comida.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarTabelaServicos() {
    const tbody = document.querySelector('#tabelaServicos tbody');
    tbody.innerHTML = '';
    
    db.servicos.forEach(servico => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${servico.id}</td>
            <td>${servico.descricao}</td>
            <td>R$ ${servico.preco.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarServico(${servico.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="excluirServico(${servico.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarTabelaMovimentos() {
    const tbody = document.querySelector('#tabelaMovimentos tbody');
    tbody.innerHTML = '';
    
    db.movimentos.forEach(movimento => {
        const cliente = db.clientes.find(c => c.id === movimento.clienteId);
        const comida = db.comidas.find(c => c.id === movimento.comidaId);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${movimento.id}</td>
            <td>${cliente ? cliente.nome : 'N/A'}</td>
            <td>${comida ? comida.nomePrato : 'N/A'}</td>
            <td>${movimento.servicos.join(', ')}</td>
            <td>${movimento.formaPagamento}</td>
            <td>R$ ${movimento.total.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="excluirMovimento(${movimento.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarSelects() {
    const selectCliente = document.getElementById('clienteMovimento');
    const selectComida = document.getElementById('comidaMovimento');
    
    selectCliente.innerHTML = '<option value="">Selecione...</option>';
    selectComida.innerHTML = '<option value="">Selecione...</option>';
    
    db.clientes.forEach(cliente => {
        selectCliente.innerHTML += `<option value="${cliente.id}">${cliente.nome}</option>`;
    });
    
    db.comidas.forEach(comida => {
        selectComida.innerHTML += `<option value="${comida.id}">${comida.nomePrato}</option>`;
    });
}

// Funções de edição
function editarCliente(id) {
    const cliente = db.clientes.find(c => c.id === id);
    if (cliente) {
        document.getElementById('nomeCliente').value = cliente.nome;
        document.getElementById('telefoneCliente').value = cliente.telefone;
        document.getElementById('cpfCliente').value = cliente.cpf;
        document.getElementById('dataNascCliente').value = cliente.dataNascimento;
        
        db.clientes = db.clientes.filter(c => c.id !== id);
        saveDB();
        atualizarTabelas();
    }
}

function editarComida(id) {
    const comida = db.comidas.find(c => c.id === id);
    if (comida) {
        document.getElementById('nomePrato').value = comida.nomePrato;
        document.getElementById('bebidas').value = comida.bebidas;
        document.getElementById('acompanhamento').value = comida.acompanhamento;
        
        db.comidas = db.comidas.filter(c => c.id !== id);
        saveDB();
        atualizarTabelas();
    }
}

function editarServico(id) {
    const servico = db.servicos.find(s => s.id === id);
    if (servico) {
        document.getElementById('descricaoServico').value = servico.descricao;
        document.getElementById('precoServico').value = servico.preco;
        
        db.servicos = db.servicos.filter(s => s.id !== id);
        saveDB();
        atualizarTabelas();
    }
}

// Funções de exclusão
function excluirCliente(id) {
    if (confirm('Deseja realmente excluir este cliente?')) {
        db.clientes = db.clientes.filter(c => c.id !== id);
        saveDB();
        atualizarTabelas();
        mostrarMensagem('Cliente excluído com sucesso!', 'success');
    }
}

function excluirComida(id) {
    if (confirm('Deseja realmente excluir esta comida?')) {
        db.comidas = db.comidas.filter(c => c.id !== id);
        saveDB();
        atualizarTabelas();
        mostrarMensagem('Comida excluída com sucesso!', 'success');
    }
}

function excluirServico(id) {
    if (confirm('Deseja realmente excluir este serviço?')) {
        db.servicos = db.servicos.filter(s => s.id !== id);
        saveDB();
        atualizarTabelas();
        mostrarMensagem('Serviço excluído com sucesso!', 'success');
    }
}

function excluirMovimento(id) {
    if (confirm('Deseja realmente excluir este movimento?')) {
        db.movimentos = db.movimentos.filter(m => m.id !== id);
        saveDB();
        atualizarTabelas();
        mostrarMensagem('Movimento excluído com sucesso!', 'success');
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initDB();
}); 