// Funções utilitárias
const Util = {
    // Validação de CPF
    validarCPF: function(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        
        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let dv1 = resto > 9 ? 0 : resto;
        
        if (dv1 !== parseInt(cpf.charAt(9))) return false;
        
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let dv2 = resto > 9 ? 0 : resto;
        
        return dv2 === parseInt(cpf.charAt(10));
    },

    // Formatação de moeda
    formatarMoeda: function(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    },

    // Formatação de data
    formatarData: function(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    },

    // Formatação de telefone
    formatarTelefone: function(telefone) {
        const cleaned = telefone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return telefone;
    },

    // Validação de idade mínima
    validarIdadeMinima: function(dataNascimento, idadeMinima = 12) {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        
        return idade >= idadeMinima;
    },

    // Gerar ID único
    gerarId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Mostrar mensagem de alerta
    mostrarAlerta: function(mensagem, tipo) {
        const alertArea = document.getElementById('alertArea');
        const alert = document.createElement('div');
        alert.className = `alert alert-${tipo} alert-dismissible fade show`;
        alert.innerHTML = `
            ${mensagem}
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
        `;
        alertArea.appendChild(alert);
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}; 