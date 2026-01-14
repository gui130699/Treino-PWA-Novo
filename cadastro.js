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
document.getElementById('cadastroForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }
    
    // Verificar se o Supabase está carregado
    if (!window.supabase || !window.supabase.from) {
        alert('Sistema ainda carregando... Aguarde e tente novamente.');
        console.error('Supabase não inicializado:', window.supabase);
        return;
    }
    
    // Coletar dados do formulário
    const pesoValue = document.getElementById('peso').value;
    const alturaValue = document.getElementById('altura').value;
    const idadeText = document.getElementById('idade').value;
    
    const dados = {
        tipo: tipoUsuario,
        nome_completo: document.getElementById('nomeCompleto').value.trim(),
        data_nascimento: document.getElementById('dataNascimento').value || null,
        idade: idadeText ? parseInt(idadeText) : null,
        peso: pesoValue ? parseFloat(pesoValue) : null,
        altura: alturaValue ? parseFloat(alturaValue) : null,
        email: document.getElementById('email').value.trim().toLowerCase(),
        senha: senha
    };
    
    // Se for professor, adicionar CREF
    if (tipoUsuario === 'professor') {
        const crefValue = document.getElementById('cref').value.trim();
        if (crefValue) {
            dados.cref = crefValue;
        }
    }
    
    console.log('📝 Dados do cadastro:', dados);
    console.log('🔌 Supabase cliente:', window.supabase);
    
    try {
        // Verificar se email já existe
        console.log('🔍 Verificando email existente...');
        const { data: usuarioExistente, error: erroCheck } = await window.supabase
            .from('usuarios')
            .select('email')
            .eq('email', dados.email)
            .maybeSingle();
        
        if (erroCheck) {
            console.error('❌ Erro ao verificar email:', erroCheck);
        }
        
        if (usuarioExistente) {
            alert('Este email já está cadastrado!');
            return;
        }
        
        // Inserir no Supabase
        console.log('💾 Inserindo usuário no Supabase...');
        console.log('📦 Dados a serem enviados:', dados);
        
        const { data: novoUsuario, error } = await window.supabase
            .from('usuarios')
            .insert([dados])
            .select()
            .single();
        
        if (error) {
            console.error('❌ Erro ao cadastrar:', error);
            console.error('Código do erro:', error.code);
            console.error('Mensagem:', error.message);
            console.error('Detalhes:', error.details);
            console.error('Hint:', error.hint);
            
            let mensagemErro = 'Erro ao cadastrar usuário.';
            
            if (error.code === '23505') {
                mensagemErro = 'Este email já está cadastrado!';
            } else if (error.code === '42501') {
                mensagemErro = 'Erro de permissão. Verifique as políticas RLS no Supabase.';
            } else if (error.message) {
                mensagemErro = error.message;
            }
            
            alert(`${mensagemErro}\n\nAbra o console (F12) para mais detalhes.`);
            return;
        }
        
        console.log('✅ Usuário cadastrado com sucesso:', novoUsuario);
        
        alert(`Cadastro de ${tipoUsuario} realizado com sucesso!\n\nNome: ${dados.nome_completo}\nEmail: ${dados.email}`);
        
        // Salvar usuário no localStorage
        localStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario));
        
        // Redirecionar para o dashboard apropriado após cadastro
        if (tipoUsuario === 'aluno') {
            window.location.href = 'dashboard-aluno.html';
        } else {
            window.location.href = 'dashboard-professor.html';
        }
        
    } catch (error) {
        console.error('❌ Erro no cadastro:', error);
        alert(`Erro ao cadastrar: ${error.message}\n\nAbra o console (F12) para mais detalhes.`);
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
