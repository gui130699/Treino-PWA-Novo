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
    
    // Verificar se o Supabase está disponível
    if (!window.supabase) {
        alert('Sistema ainda carregando... Aguarde e tente novamente.');
        return;
    }
    
    try {
        // Buscar usuário no Supabase
        const { data: usuario, error } = await window.supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .eq('tipo', tipoUsuario)
            .single();
        
        // Verificar erros específicos
        if (error) {
            console.error('Erro Supabase:', error);
            
            // Se for erro 401, significa que as políticas RLS não estão configuradas
            if (error.code === 'PGRST301' || error.message.includes('policy')) {
                alert('⚠️ Banco de dados não configurado!\n\nAs políticas de segurança precisam ser aplicadas no Supabase.\n\nUse o "Modo Demo" para testar o aplicativo.');
                return;
            }
            
            alert('Usuário não encontrado ou tipo incorreto!');
            return;
        }
        
        if (!usuario) {
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
const installBtn = document.getElementById('installAppBtn');

// Função para verificar se o app está instalado
function isAppInstalled() {
    // Verifica se está em standalone mode (instalado)
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return true;
    }
    
    // Verifica se foi instalado anteriormente (iOS)
    if (window.navigator.standalone === true) {
        return true;
    }
    
    // Verifica localStorage
    if (localStorage.getItem('pwaInstalled') === 'true') {
        return true;
    }
    
    return false;
}

// Verificar ao carregar a página
window.addEventListener('load', () => {
    if (isAppInstalled()) {
        console.log('App já está instalado');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }
});

// Capturar evento de instalação disponível
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Só mostrar o botão se o app não estiver instalado
    if (!isAppInstalled() && installBtn) {
        installBtn.style.display = 'block';
        console.log('Botão de instalação exibido');
    }
});

// Evento de clique no botão de instalação
if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) {
            console.log('Prompt de instalação não disponível');
            return;
        }
        
        // Mostrar o prompt nativo de instalação
        deferredPrompt.prompt();
        
        // Aguardar escolha do usuário
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Resultado da instalação: ${outcome}`);
        
        if (outcome === 'accepted') {
            console.log('Usuário aceitou a instalação');
            // Marcar como instalado
            localStorage.setItem('pwaInstalled', 'true');
            // Ocultar botão
            installBtn.style.display = 'none';
        }
        
        // Limpar o prompt
        deferredPrompt = null;
    });
}

// Evento disparado quando o app é instalado
window.addEventListener('appinstalled', () => {
    console.log('PWA instalado com sucesso!');
    // Marcar como instalado
    localStorage.setItem('pwaInstalled', 'true');
    // Ocultar botão
    if (installBtn) {
        installBtn.style.display = 'none';
    }
});
