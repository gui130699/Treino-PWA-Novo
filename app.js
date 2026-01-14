// Registrar Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch(error => {
                console.log('Falha ao registrar Service Worker:', error);
            });
    });
}

// Variável para armazenar o tipo de usuário selecionado
let tipoUsuario = 'aluno';

// Seleção de tipo de usuário (Aluno/Professor)
document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        tipoUsuario = this.dataset.type;
        console.log('Tipo de usuário selecionado:', tipoUsuario);
    });
});

// Form de Login
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    console.log('Tentativa de login:', {
        tipo: tipoUsuario,
        email: email
    });
    
    try {
        // Buscar usuário no Supabase
        const { data: usuario, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .eq('tipo', tipoUsuario)
            .single();
        
        if (error || !usuario) {
            alert('Usuário não encontrado ou tipo incorreto!');
            return;
        }
        
        // Validar senha (em produção use bcrypt)
        if (usuario.senha !== senha) {
            alert('Senha incorreta!');
            return;
        }
        
        // Salvar usuário no localStorage
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        
        // Redirecionar para o dashboard apropriado
        if (tipoUsuario === 'aluno') {
            window.location.href = 'dashboard-aluno.html';
        } else {
            window.location.href = 'dashboard-professor.html';
        }
        
    } catch (error) {
        console.error('Erro no login:', error);
        alert('Erro ao fazer login. Tente novamente.');
    }
});

// Botão de Cadastro
document.getElementById('cadastroBtn').addEventListener('click', function() {
    window.location.href = 'cadastro.html';
});

// Botão Demo
document.getElementById('demoBtn').addEventListener('click', function() {
    console.log('Modo demo ativado para:', tipoUsuario);
    
    // Redirecionar para o dashboard apropriado em modo demo
    if (tipoUsuario === 'aluno') {
        window.location.href = 'dashboard-aluno.html?demo=true';
    } else {
        window.location.href = 'dashboard-professor.html?demo=true';
    }
});

// PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Mostrar o prompt de instalação personalizado
    const installPrompt = document.getElementById('installPrompt');
    installPrompt.style.display = 'flex';
});

document.getElementById('installBtn').addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Resultado da instalação: ${outcome}`);
        deferredPrompt = null;
        document.getElementById('installPrompt').style.display = 'none';
    }
});

document.getElementById('dismissBtn').addEventListener('click', () => {
    document.getElementById('installPrompt').style.display = 'none';
});

// Verificar se já está instalado
window.addEventListener('appinstalled', () => {
    console.log('PWA instalado com sucesso!');
    document.getElementById('installPrompt').style.display = 'none';
});
