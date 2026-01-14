// Gerenciamento de abas
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const targetTab = this.dataset.tab;
        
        // Remove active de todos os botões e conteúdos
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Adiciona active no botão e conteúdo selecionado
        this.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
        
        console.log('Aba selecionada:', targetTab);
    });
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('Deseja realmente sair?')) {
        // Aqui você limparia o localStorage/sessionStorage se estivesse usando
        window.location.href = 'index.html';
    }
});

// Simular dados do usuário (em produção viria do backend/localStorage)
const usuarioLogado = {
    nome: 'João Silva',
    tipo: 'aluno'
};

// Atualizar nome do usuário
document.querySelector('.user-name').textContent = `Olá, ${usuarioLogado.nome}`;

// Simular professores cadastrados (em produção viria do backend)
const professores = [
    { id: 1, nome: 'Prof. Carlos Silva', cref: '123456-G/SP', especialidade: 'Musculação' },
    { id: 2, nome: 'Prof. Maria Santos', cref: '234567-G/RJ', especialidade: 'Funcional' },
    { id: 3, nome: 'Prof. João Oliveira', cref: '345678-G/MG', especialidade: 'Crossfit' },
    { id: 4, nome: 'Prof. Ana Costa', cref: '456789-G/SP', especialidade: 'Pilates' }
];

// Professor vinculado (null = sem vínculo)
let professorVinculado = null;

// Atualizar status do professor vinculado
function atualizarStatusProfessor() {
    const btnVincular = document.getElementById('vincularProfessorBtn');
    const textoProfessor = document.getElementById('professorVinculado');
    
    if (professorVinculado) {
        if (professorVinculado.status === 'pendente') {
            textoProfessor.textContent = '⏳ Aguardando aceite';
            btnVincular.classList.add('vinculado');
            btnVincular.style.display = 'block';
            btnVincular.disabled = true;
            btnVincular.style.cursor = 'not-allowed';
        } else if (professorVinculado.status === 'aceito') {
            // Quando aceito, esconde o botão e mostra apenas o nome do professor
            btnVincular.style.display = 'none';
            
            // Criar elemento para mostrar professor vinculado se não existir
            let professorDisplay = document.getElementById('professorVinculadoDisplay');
            if (!professorDisplay) {
                professorDisplay = document.createElement('span');
                professorDisplay.id = 'professorVinculadoDisplay';
                professorDisplay.className = 'professor-vinculado-display';
                btnVincular.parentNode.insertBefore(professorDisplay, btnVincular);
            }
            professorDisplay.textContent = `🎓 ${professorVinculado.nome}`;
        }
    } else {
        textoProfessor.textContent = '🎓 Vincular Professor';
        btnVincular.classList.remove('vinculado');
        btnVincular.style.display = 'block';
        btnVincular.disabled = false;
        btnVincular.style.cursor = 'pointer';
        
        // Remover display do professor se existir
        const professorDisplay = document.getElementById('professorVinculadoDisplay');
        if (professorDisplay) {
            professorDisplay.remove();
        }
    }
}

// Abrir modal de professores
document.getElementById('vincularProfessorBtn').addEventListener('click', function() {
    const modal = document.getElementById('modalProfessores');
    modal.classList.add('show');
    renderizarProfessores();
});

// Fechar modal
document.getElementById('closeModalProfessores').addEventListener('click', function() {
    document.getElementById('modalProfessores').classList.remove('show');
});

// Fechar modal clicando fora
document.getElementById('modalProfessores').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('show');
    }
});

// Renderizar lista de professores
function renderizarProfessores(filtro = '') {
    const lista = document.getElementById('professoresList');
    const professoresFiltrados = professores.filter(prof => 
        prof.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        prof.cref.toLowerCase().includes(filtro.toLowerCase()) ||
        prof.especialidade.toLowerCase().includes(filtro.toLowerCase())
    );
    
    if (professoresFiltrados.length === 0) {
        lista.innerHTML = '<div class="empty-state"><p>Nenhum professor encontrado</p></div>';
        return;
    }
    
    lista.innerHTML = professoresFiltrados.map(prof => `
        <div class="professor-item">
            <div class="professor-info">
                <span class="professor-nome">${prof.nome}</span>
                <span class="professor-cref">CREF: ${prof.cref} | ${prof.especialidade}</span>
            </div>
            <button class="btn btn-primary btn-small" onclick="solicitarVinculo(${prof.id})">
                Solicitar
            </button>
        </div>
    `).join('');
}

// Buscar professor
document.getElementById('searchProfessor').addEventListener('input', function() {
    renderizarProfessores(this.value);
});

// Solicitar vínculo com professor
function solicitarVinculo(professorId) {
    const professor = professores.find(p => p.id === professorId);
    
    if (confirm(`Deseja solicitar vínculo com ${professor.nome}?`)) {
        professorVinculado = {
            ...professor,
            status: 'pendente'
        };
        
        // Aqui você salvaria no backend
        console.log('Solicitação enviada:', professorVinculado);
        
        atualizarStatusProfessor();
        document.getElementById('modalProfessores').classList.remove('show');
        
        alert(`Solicitação enviada para ${professor.nome}!\nAguarde a aprovação.`);
    }
}

// Tornar função global
window.solicitarVinculo = solicitarVinculo;

// Simular aceite do professor (para teste)
function simularAceite() {
    if (professorVinculado && professorVinculado.status === 'pendente') {
        professorVinculado.status = 'aceito';
        atualizarStatusProfessor();
        alert(`${professorVinculado.nome} aceitou sua solicitação!`);
    }
}

// Tornar função global para teste
window.simularAceite = simularAceite;

// Inicializar
atualizarStatusProfessor();

console.log('Dashboard do aluno carregado');
