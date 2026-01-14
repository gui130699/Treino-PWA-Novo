// Variável para armazenar o tipo de usuário selecionado
let tipoUsuario = 'aluno';

// Seleção de tipo de usuário (Aluno/Professor)
document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        tipoUsuario = this.dataset.type;
        
        // Mostrar/ocultar campo CREF
        const crefGroup = document.getElementById('crefGroup');
        const crefInput = document.getElementById('cref');
        
        if (tipoUsuario === 'professor') {
            crefGroup.classList.add('show');
            crefInput.setAttribute('required', 'required');
        } else {
            crefGroup.style.display = 'none';
            crefInput.removeAttribute('required');
            crefInput.value = '';
        }
        
        console.log('Tipo de cadastro:', tipoUsuario);
    });
});

// Calcular idade a partir da data de nascimento
document.getElementById('dataNascimento').addEventListener('change', function() {
    const dataNasc = new Date(this.value);
    const hoje = new Date();
    
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNasc = dataNasc.getMonth();
    
    if (mesAtual < mesNasc || (mesAtual === mesNasc && hoje.getDate() < dataNasc.getDate())) {
        idade--;
    }
    
    document.getElementById('idade').value = idade >= 0 ? idade + ' anos' : '';
});

// Validar senhas
document.getElementById('confirmarSenha').addEventListener('input', function() {
    const senha = document.getElementById('senha').value;
    const confirmar = this.value;
    const errorMsg = document.getElementById('senhaError');
    
    if (confirmar && senha !== confirmar) {
        errorMsg.textContent = 'As senhas não coincidem';
        this.setCustomValidity('As senhas não coincidem');
    } else {
        errorMsg.textContent = '';
        this.setCustomValidity('');
    }
});

document.getElementById('senha').addEventListener('input', function() {
    const confirmar = document.getElementById('confirmarSenha');
    if (confirmar.value) {
        confirmar.dispatchEvent(new Event('input'));
    }
});

// Submit do formulário
document.getElementById('cadastroForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }
    
    // Coletar dados do formulário
    const dados = {
        tipo: tipoUsuario,
        nomeCompleto: document.getElementById('nomeCompleto').value,
        dataNascimento: document.getElementById('dataNascimento').value,
        idade: document.getElementById('idade').value,
        peso: document.getElementById('peso').value,
        altura: document.getElementById('altura').value,
        email: document.getElementById('email').value,
        senha: senha
    };
    
    // Se for professor, adicionar CREF
    if (tipoUsuario === 'professor') {
        dados.cref = document.getElementById('cref').value;
    }
    
    console.log('Dados do cadastro:', dados);
    
    // Aqui você implementaria a lógica de salvar no banco de dados
    // Por enquanto, apenas mostra os dados e simula sucesso
    
    alert(`Cadastro de ${tipoUsuario} realizado com sucesso!\n\nNome: ${dados.nomeCompleto}\nEmail: ${dados.email}`);
    
    // Redirecionar para o dashboard apropriado após cadastro
    if (tipoUsuario === 'aluno') {
        window.location.href = 'dashboard-aluno.html';
    } else {
        window.location.href = 'dashboard-professor.html';
    }
});

// Validação do formato do email em tempo real
document.getElementById('email').addEventListener('blur', function() {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        this.setCustomValidity('Digite um email válido');
        this.reportValidity();
    } else {
        this.setCustomValidity('');
    }
});

// Formatar CREF enquanto digita
document.getElementById('cref').addEventListener('input', function() {
    let valor = this.value.replace(/[^\d]/g, '');
    
    if (valor.length > 6) {
        valor = valor.substring(0, 6);
    }
    
    this.value = valor;
});
