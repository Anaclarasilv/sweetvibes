// Aplicação principal
const App = {
    init: function() {
        if (!Storage.isAvailable()) {
            Util.mostrarAlerta('Seu navegador não suporta armazenamento local. O sistema pode não funcionar corretamente.', 'warning');
            return;
        }
        this.bindEvents();
        this.loadInitialPage();
    },

    bindEvents: function() {
        // Navegação
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.loadPage(page);
            });
        });

        // Formulários
        document.addEventListener('submit', (e) => {
            if (e.target.matches('#clienteForm')) {
                e.preventDefault();
                this.handleClienteSubmit(e.target);
            } else if (e.target.matches('#coffeeBreakForm')) {
                e.preventDefault();
                this.handleCoffeeBreakSubmit(e.target);
            } else if (e.target.matches('#servicoForm')) {
                e.preventDefault();
                this.handleServicoSubmit(e.target);
            } else if (e.target.matches('#encomendaForm')) {
                e.preventDefault();
                this.handleEncomendaSubmit(e.target);
            }
        });

        // Event delegation for product cards and images
        document.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productImage = e.target.closest('.product-img');
            
            if (productImage || (productCard && e.target.classList.contains('view-details'))) {
                e.preventDefault();
                const card = productCard || productImage.closest('.product-card');
                const productId = card.dataset.productId;
                this.showProductDetails(productId);
            }
        });
    },

    loadInitialPage: function() {
        this.loadPage('clientes');
    },

    loadPage: function(page) {
        const template = document.getElementById(`${page}Template`);
        if (template) {
            const mainContent = document.getElementById('mainContent');
            mainContent.innerHTML = template.innerHTML;
            
            // Atualizar tabelas e campos específicos
            switch(page) {
                case 'clientes':
                    this.atualizarTabelaClientes();
                    break;
                case 'coffee-break':
                    this.atualizarTabelaCoffeeBreaks();
                    break;
                case 'servicos':
                    this.atualizarTabelaServicos();
                    this.preencherTiposServico();
                    break;
                case 'encomendas':
                    this.atualizarTabelaEncomendas();
                    this.preencherTiposBolo();
                    this.preencherFormasPagamento();
                    break;
            }
        }
    },

    handleClienteSubmit: function(form) {
        try {
            const nome = form.nome.value.trim();
            const cpf = form.cpf.value.trim();
            const telefone = form.telefone.value.trim();
            const endereco = form.endereco.value.trim();
            const dataNascimento = form.dataNascimento.value;
            const jaComprou = form.jaComprou.checked;

            // Validações
            if (!nome || !cpf || !telefone || !endereco || !dataNascimento) {
                Util.mostrarAlerta('Todos os campos são obrigatórios!', 'danger');
                return;
            }

            if (!Util.validarCPF(cpf)) {
                Util.mostrarAlerta('CPF inválido!', 'danger');
                return;
            }

            if (!Util.validarIdadeMinima(dataNascimento)) {
                Util.mostrarAlerta('Cliente deve ter pelo menos 12 anos!', 'danger');
                return;
            }

            const cliente = new Cliente(nome, cpf, telefone, endereco, dataNascimento, jaComprou);
            
            if (Storage.add(Storage.KEYS.CLIENTES, cliente)) {
                form.reset();
                this.atualizarTabelaClientes();
                Util.mostrarAlerta('Cliente cadastrado com sucesso!', 'success');
            } else {
                throw new Error('Erro ao salvar cliente');
            }
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
            Util.mostrarAlerta('Erro ao cadastrar cliente. Tente novamente.', 'danger');
        }
    },

    handleCoffeeBreakSubmit: function(form) {
        try {
            const coffeeBreak = new CoffeeBreak(
                form.tipoEvento.value.trim(),
                form.dataHora.value,
                form.local.value.trim(),
                parseInt(form.quantidadePessoas.value),
                form.itensIncluidos.value.split('\n').map(item => item.trim()).filter(item => item),
                form.montagemLocal.checked,
                parseFloat(form.valorFechado.value)
            );

            if (Storage.add(Storage.KEYS.COFFEE_BREAKS, coffeeBreak)) {
                form.reset();
                this.atualizarTabelaCoffeeBreaks();
                Util.mostrarAlerta('Coffee Break cadastrado com sucesso!', 'success');
            } else {
                throw new Error('Erro ao salvar coffee break');
            }
        } catch (error) {
            console.error('Erro ao cadastrar coffee break:', error);
            Util.mostrarAlerta('Erro ao cadastrar coffee break. Tente novamente.', 'danger');
        }
    },

    handleServicoSubmit: function(form) {
        try {
            const servico = new Servico(
                form.tipo.value,
                form.descricao.value.trim(),
                parseFloat(form.preco.value)
            );

            if (Storage.add(Storage.KEYS.SERVICOS, servico)) {
                form.reset();
                this.atualizarTabelaServicos();
                Util.mostrarAlerta('Serviço cadastrado com sucesso!', 'success');
            } else {
                throw new Error('Erro ao salvar serviço');
            }
        } catch (error) {
            console.error('Erro ao cadastrar serviço:', error);
            Util.mostrarAlerta('Erro ao cadastrar serviço. Tente novamente.', 'danger');
        }
    },

    handleEncomendaSubmit: function(form) {
        try {
            const encomenda = new Encomenda(
                form.nomeCliente.value.trim(),
                form.telefone.value.trim(),
                form.dataEntrega.value,
                form.tipoBolo.value,
                form.saborMassa.value.trim(),
                form.recheio.value.trim(),
                form.cobertura.value.trim(),
                parseFloat(form.peso.value),
                form.tamanho.value.trim(),
                form.mensagem.value.trim(),
                parseFloat(form.valorTotal.value),
                form.formaPagamento.value
            );

            if (Storage.add(Storage.KEYS.ENCOMENDAS, encomenda)) {
                form.reset();
                this.atualizarTabelaEncomendas();
                Util.mostrarAlerta('Encomenda cadastrada com sucesso!', 'success');
            } else {
                throw new Error('Erro ao salvar encomenda');
            }
        } catch (error) {
            console.error('Erro ao cadastrar encomenda:', error);
            Util.mostrarAlerta('Erro ao cadastrar encomenda. Tente novamente.', 'danger');
        }
    },

    atualizarTabelaClientes: function() {
        const tbody = document.querySelector('#clientesTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        const clientes = Storage.get(Storage.KEYS.CLIENTES);

        clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.nome}</td>
                <td>${cliente.cpf}</td>
                <td>${Util.formatarTelefone(cliente.telefone)}</td>
                <td>${cliente.endereco}</td>
                <td>${Util.formatarData(cliente.dataNascimento)}</td>
                <td>${cliente.jaComprou ? 'Sim' : 'Não'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="App.editarCliente('${cliente.id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="App.excluirCliente('${cliente.id}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    atualizarTabelaCoffeeBreaks: function() {
        const tbody = document.querySelector('#coffeeBreaksTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        const coffeeBreaks = Storage.get(Storage.KEYS.COFFEE_BREAKS);

        coffeeBreaks.forEach(cb => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cb.tipoEvento}</td>
                <td>${new Date(cb.dataHora).toLocaleString()}</td>
                <td>${cb.local}</td>
                <td>${cb.quantidadePessoas}</td>
                <td>${cb.montagemLocal ? 'Sim' : 'Não'}</td>
                <td>${Util.formatarMoeda(cb.valorFechado)}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="App.editarCoffeeBreak('${cb.id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="App.excluirCoffeeBreak('${cb.id}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    atualizarTabelaServicos: function() {
        const tbody = document.querySelector('#servicosTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        const servicos = Storage.get(Storage.KEYS.SERVICOS);

        servicos.forEach(servico => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${servico.tipo}</td>
                <td>${servico.descricao}</td>
                <td>${Util.formatarMoeda(servico.preco)}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="App.editarServico('${servico.id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="App.excluirServico('${servico.id}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    atualizarTabelaEncomendas: function() {
        const tbody = document.querySelector('#encomendasTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        const encomendas = Storage.get(Storage.KEYS.ENCOMENDAS);

        encomendas.forEach(encomenda => {
            const tr = document.createElement('tr');
            const statusClass = {
                'Em andamento': 'badge-pendente',
                'Pronto': 'badge-pronto',
                'Entregue': 'badge-entregue'
            }[encomenda.status];

            tr.innerHTML = `
                <td>${encomenda.nomeCliente}</td>
                <td>${Util.formatarTelefone(encomenda.telefone)}</td>
                <td>${new Date(encomenda.dataEntrega).toLocaleString()}</td>
                <td>${encomenda.tipoBolo}</td>
                <td><span class="badge ${statusClass}">${encomenda.status}</span></td>
                <td>${Util.formatarMoeda(encomenda.valorTotal)}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="App.editarEncomenda('${encomenda.id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="App.excluirEncomenda('${encomenda.id}')">Excluir</button>
                    <button class="btn btn-sm btn-info" onclick="App.atualizarStatusEncomenda('${encomenda.id}')">Status</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    preencherTiposServico: function() {
        const select = document.querySelector('#tipo');
        if (!select) return;

        select.innerHTML = '<option value="">Selecione...</option>' +
            Servico.getTipos().map(tipo => `<option value="${tipo}">${tipo}</option>`).join('');
    },

    preencherTiposBolo: function() {
        const select = document.querySelector('#tipoBolo');
        if (!select) return;

        select.innerHTML = '<option value="">Selecione...</option>' +
            Encomenda.getTiposBolo().map(tipo => `<option value="${tipo}">${tipo}</option>`).join('');
    },

    preencherFormasPagamento: function() {
        const select = document.querySelector('#formaPagamento');
        if (!select) return;

        select.innerHTML = '<option value="">Selecione...</option>' +
            Encomenda.getFormasPagamento().map(forma => `<option value="${forma}">${forma}</option>`).join('');
    },

    editarCliente: function(id) {
        const cliente = Storage.get(Storage.KEYS.CLIENTES).find(c => c.id === id);
        if (cliente) {
            const form = document.getElementById('clienteForm');
            form.nome.value = cliente.nome;
            form.cpf.value = cliente.cpf;
            form.telefone.value = cliente.telefone;
            form.endereco.value = cliente.endereco;
            form.dataNascimento.value = cliente.dataNascimento;
            form.jaComprou.checked = cliente.jaComprou;

            Storage.delete(Storage.KEYS.CLIENTES, id);
            this.atualizarTabelaClientes();
        }
    },

    excluirCliente: function(id) {
        if (confirm('Deseja realmente excluir este cliente?')) {
            if (Storage.delete(Storage.KEYS.CLIENTES, id)) {
                this.atualizarTabelaClientes();
                Util.mostrarAlerta('Cliente excluído com sucesso!', 'success');
            } else {
                Util.mostrarAlerta('Erro ao excluir cliente!', 'danger');
            }
        }
    },

    atualizarStatusEncomenda: function(id) {
        const encomenda = Storage.get(Storage.KEYS.ENCOMENDAS).find(e => e.id === id);
        if (!encomenda) return;

        const statusAtual = encomenda.status;
        const statusList = Encomenda.getStatus();
        const currentIndex = statusList.indexOf(statusAtual);
        const novoStatus = statusList[(currentIndex + 1) % statusList.length];

        if (Storage.update(Storage.KEYS.ENCOMENDAS, id, { status: novoStatus })) {
            this.atualizarTabelaEncomendas();
            Util.mostrarAlerta(`Status atualizado para: ${novoStatus}`, 'success');
        } else {
            Util.mostrarAlerta('Erro ao atualizar status!', 'danger');
        }
    },

    produtos: {
        1: {
            id: 1,
            nome: "Brigadeiro Branco",
            descricao: "O autêntico brigadeiro brasileiro, feito com chocolate ao leite de alta qualidade e coco.",
            preco: 2.50,
            imagem: "brigadeiro-branco-como-fazer-rapido-e-barato.jpg",
            ingredientes: "Leite condensado, chocolate em pó 50% cacau, manteiga sem sal, granulado de chocolate",
            disponibilidade: "Pronta entrega (mínimo 20 unidades)",
            variacoes: ["", "Meio Amargo", "Com Granulado Extra"]
        },
        2: {
            id: 2,
            nome: "Brigadeiro Tradicional",
            descricao: "Brigadeiro especial feito com chocolate belga e finalizado com cacau em pó.",
            preco: 2.50,
            imagem: "natureza-morta-de-uma-xicara-de-sobremesa-de-acai-brasileira.jpg",
            ingredientes: "Leite condensado, chocolate belga 70% cacau,cacau em pó belga",
            disponibilidade: "Sob encomenda mínimo 50 unidades",
            variacoes: ["70% Cacau", "85% Cacau", "Com Nibs de Cacau"]
        },
        3: {
            id: 3,
            nome: "Variedades de Brigadeiros",
            descricao: "Delicada versão com chocolate branco e coco ralado.",
            preco: 1.50,
            imagem: "arranjo-de-sobremesa-deliciosa-de-angulo-alto.jpg",
            ingredientes: "Leite condensado, chocolate branco belga, manteiga sem sal, coco ralado",
            disponibilidade: "Pronta entrega (mínimo 20 unidades)",
            variacoes: ["Tradicional", "Com Coco", "Com Amêndoas"]
        },
        4: {
            id: 4,
    nome: "Brigadeiro de crème brûlée",
            descricao: "Brigadeiro com paçoca genuína, coberto com paçoca triturada.",
            preco: 4.00,
            imagem: "filmes-dourados-de-muffin.jpg",
            ingredientes: "Leite condensado, paçoca, manteiga sem sal, paçoca triturada para decoração",
            disponibilidade: "Sob encomenda (mínimo 25 unidades)",
            variacoes: ["Tradicional", "Com Amendoim Extra", "Com Chocolate"]
        },
        5: {
            id: 5,
            nome: "Brigadeiro de Nutella",
            descricao: "Brigadeiro premium feito com Nutella original e avelãs.",
            preco: 4.00,
            imagem: "conceito-de-cupcakes-deliciosos.jpg",
            ingredientes: "Leite condensado, Nutella original, manteiga sem sal, avelãs trituradas",
            disponibilidade: "Sob encomenda (mínimo 30 unidades)",
            variacoes: ["Tradicional", "Com Avelãs Extra", "Com Chocolate Belga"]
        },
        6: {
            id: 6,
            nome: "Brigadeiro de Morango",
            descricao: "Brigadeiro gourmet com pistache natural e cobertura de pistache moído.",
            preco: 4.50,
            imagem: "bolinhos-saborosos-com-morangos-na-superficie-branca-de-cima-para-comemorar-o-aniversario-biscoito-doce.jpg",
            ingredientes: "Leite condensado, pasta de pistache, manteiga sem sal, pistache moído",
            disponibilidade: "Sob encomenda (mínimo 30 unidades)",
            variacoes: ["Tradicional", "Com Pistache Extra", "Com Chocolate Branco"]
        },
        7: {
            id: 7,
            nome: "Bolo de Creme com Cobertura de Chocolate",
            descricao: "Trufa artesanal com recheio cremoso de chocolate belga.",
            preco: 160.00,
            imagem: "vista-lateral-bolo-de-frutas-coberto-com-raspas-de-chocolate-e-chantilly-em-cima-da-mesa-servida-com-cha.jpg",
            ingredientes: "Chocolate belga 70% cacau, creme de leite fresco, manteiga sem sal, cacau em pó",
            disponibilidade: "Sob encomenda (mínimo 20 unidades)",
            variacoes: ["70% Cacau", "Ao Leite", "Branco", "Com Licor"]
        },
        8: {
            id: 8,
            nome: "Bolo de Red Velvet",
            descricao: "Morango fresco coberto com chocolate belga.",
            preco: 160.00,
            imagem: "bolo-de-morango-vermelho-em-po-doce-delicioso-redondo-na-mesa-cinza.jpg",
            ingredientes: "Morango fresco, chocolate belga ao leite, chocolate belga meio amargo",
            disponibilidade: "Sob encomenda (mínimo 20 unidades)",
            variacoes: ["Chocolate ao Leite", "Chocolate Meio Amargo", "Chocolate Branco"]
        },
        9: {
            id: 9,
            nome: "Variedades de bolos",
            descricao: "Brownie artesanal com recheio de brigadeiro.",
            preco: 20.00,
            imagem: "variedade-de-pedacos-de-bolo (1).jpg",
            ingredientes: "Chocolate meio amargo, ovos, açúcar, farinha, manteiga, brigadeiro tradicional",
            disponibilidade: "Sob encomenda (mínimo 15 unidades)",
            variacoes: ["Brigadeiro Tradicional", "Doce de Leite", "Nutella", "Red Velvet"]
        }
    },

    showProductDetails(productId) {
        const produto = this.produtos[productId];
        if (!produto) return;

        // Update modal content
        document.getElementById('modalProductImage').src = produto.imagem;
        document.getElementById('modalProductImage').alt = produto.nome;
        document.getElementById('modalProductName').textContent = produto.nome;
        document.getElementById('modalProductDescription').textContent = produto.descricao;
        document.getElementById('modalProductIngredients').textContent = produto.ingredientes;
        document.getElementById('modalProductPrice').textContent = `R$ ${produto.preco.toFixed(2)}`;
        document.getElementById('modalProductExpiry').textContent = produto.validade;
        document.getElementById('modalProductProductionTime').textContent = produto.tempoPreparo;
        document.getElementById('modalProductAvailability').textContent = produto.disponibilidade;

        // Update variations
        const variationsContainer = document.getElementById('modalProductVariations');
        variationsContainer.innerHTML = produto.variacoes
            .map(v => `<span class="variation-tag">${v}</span>`)
            .join('');

        // Show modal
        $('#productDetailsModal').modal('show');
    },

    adicionarAoCarrinho() {
        // Implementação futura do carrinho de compras
        alert('Funcionalidade de carrinho em desenvolvimento!');
    }
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    App.init();
}); 
