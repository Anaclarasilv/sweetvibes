// Classes de modelo
class Cliente {
    constructor(nome, cpf, telefone, endereco, dataNascimento, jaComprou = false) {
        this.id = Util.gerarId();
        this.nome = nome;
        this.cpf = cpf;
        this.telefone = telefone;
        this.endereco = endereco;
        this.dataNascimento = dataNascimento;
        this.jaComprou = jaComprou;
        this.dataCadastro = new Date().toISOString();
    }
}

class CoffeeBreak {
    constructor(tipoEvento, dataHora, local, quantidadePessoas, itensIncluidos, montagemLocal, valorFechado) {
        this.id = Util.gerarId();
        this.tipoEvento = tipoEvento;
        this.dataHora = dataHora;
        this.local = local;
        this.quantidadePessoas = quantidadePessoas;
        this.itensIncluidos = itensIncluidos;
        this.montagemLocal = montagemLocal;
        this.valorFechado = valorFechado;
        this.dataCadastro = new Date().toISOString();
    }
}

class Servico {
    constructor(tipo, descricao, preco) {
        this.id = Util.gerarId();
        this.tipo = tipo;
        this.descricao = descricao;
        this.preco = preco;
        this.dataCadastro = new Date().toISOString();
    }

    static getTipos() {
        return ['Festa', 'Encomenda de doce', 'Encomenda de salgado'];
    }
}

class Encomenda {
    constructor(nomeCliente, telefone, dataEntrega, tipoBolo, saborMassa, recheio, cobertura, 
                peso, tamanho, mensagem, valorTotal, formaPagamento) {
        this.id = Util.gerarId();
        this.nomeCliente = nomeCliente;
        this.telefone = telefone;
        this.dataEntrega = dataEntrega;
        this.tipoBolo = tipoBolo;
        this.saborMassa = saborMassa;
        this.recheio = recheio;
        this.cobertura = cobertura;
        this.peso = peso;
        this.tamanho = tamanho;
        this.mensagem = mensagem;
        this.valorTotal = valorTotal;
        this.formaPagamento = formaPagamento;
        this.status = 'Em andamento';
        this.dataCadastro = new Date().toISOString();
    }

    static getStatus() {
        return ['Em andamento', 'Pronto', 'Entregue'];
    }

    static getTiposBolo() {
        return ['Aniversário', 'Casamento', 'Confraternização', 'Outros'];
    }

    static getFormasPagamento() {
        return ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'PIX', 'Vale-refeição'];
    }
}

// Gerenciamento de dados no localStorage
const Storage = {
    KEYS: {
        CLIENTES: 'confeitaria_clientes',
        COFFEE_BREAKS: 'confeitaria_coffee_breaks',
        SERVICOS: 'confeitaria_servicos',
        ENCOMENDAS: 'confeitaria_encomendas'
    },

    get: function(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },
    
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Erro ao salvar dados:', e);
            return false;
        }
    },
    
    add: function(key, item) {
        try {
            const items = this.get(key);
            items.push(item);
            return this.set(key, items);
        } catch (e) {
            console.error('Erro ao adicionar item:', e);
            return false;
        }
    },
    
    update: function(key, id, newData) {
        try {
            let items = this.get(key);
            items = items.map(item => item.id === id ? {...item, ...newData} : item);
            return this.set(key, items);
        } catch (e) {
            console.error('Erro ao atualizar item:', e);
            return false;
        }
    },
    
    delete: function(key, id) {
        try {
            let items = this.get(key);
            items = items.filter(item => item.id !== id);
            return this.set(key, items);
        } catch (e) {
            console.error('Erro ao excluir item:', e);
            return false;
        }
    },
    
    clear: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Erro ao limpar dados:', e);
            return false;
        }
    },

    // Método para verificar se o localStorage está disponível
    isAvailable: function() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }
}; 