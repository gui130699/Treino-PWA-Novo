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
    nome: 'Prof. Maria Santos',
    tipo: 'professor'
};

// Atualizar nome do usuário
document.querySelector('.user-name').textContent = `Olá, ${usuarioLogado.nome}`;

// Simular solicitações de vínculo (em produção viria do backend)
let solicitacoesPendentes = [
    { id: 1, nomeAluno: 'João Silva', email: 'joao@email.com', idade: '25 anos', dataSolicitacao: '2026-01-14' },
    { id: 2, nomeAluno: 'Maria Santos', email: 'maria@email.com', idade: '30 anos', dataSolicitacao: '2026-01-13' }
];

// Lista de alunos vinculados
let alunosVinculados = [];

// Renderizar lista de alunos
function renderizarAlunos() {
    const lista = document.querySelector('#alunos .alunos-list');
    
    if (alunosVinculados.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">👥</span>
                <h3>Nenhum aluno cadastrado</h3>
                <p>Adicione alunos para começar a gerenciar seus treinos.</p>
            </div>
        `;
        return;
    }
    
    lista.innerHTML = alunosVinculados.map(aluno => `
        <div class="aluno-card">
            <div class="aluno-info">
                <span class="aluno-nome">👤 ${aluno.nomeAluno}</span>
                <span class="aluno-email">${aluno.email}</span>
                <small style="color: #999;">${aluno.idade}</small>
            </div>
            <button class="btn btn-primary btn-small" onclick="verTreinosAluno(${aluno.id})">
                Ver Treinos
            </button>
        </div>
    `).join('');
}

// Renderizar solicitações
function renderizarSolicitacoes() {
    const lista = document.getElementById('solicitacoesList');
    const badge = document.getElementById('badgeSolicitacoes');
    
    badge.textContent = solicitacoesPendentes.length;
    
    if (solicitacoesPendentes.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📬</span>
                <h3>Nenhuma solicitação pendente</h3>
                <p>Quando alunos solicitarem vínculo, aparecerão aqui.</p>
            </div>
        `;
        return;
    }
    
    lista.innerHTML = solicitacoesPendentes.map(sol => `
        <div class="solicitacao-item" data-id="${sol.id}">
            <div class="solicitacao-info">
                <span class="solicitacao-nome">${sol.nomeAluno}</span>
                <span class="solicitacao-email">${sol.email} | ${sol.idade}</span>
                <small style="color: #999;">Solicitado em ${formatarData(sol.dataSolicitacao)}</small>
            </div>
            <div class="solicitacao-actions">
                <button class="btn btn-accept btn-small" onclick="aceitarSolicitacao(${sol.id})">
                    ✓ Aceitar
                </button>
                <button class="btn btn-reject btn-small" onclick="rejeitarSolicitacao(${sol.id})">
                    ✕ Recusar
                </button>
            </div>
        </div>
    `).join('');
}

// Formatar data
function formatarData(data) {
    const date = new Date(data + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

// Aceitar solicitação
function aceitarSolicitacao(solicitacaoId) {
    const solicitacao = solicitacoesPendentes.find(s => s.id === solicitacaoId);
    
    if (confirm(`Aceitar ${solicitacao.nomeAluno} como aluno?`)) {
        // Adicionar à lista de alunos vinculados
        alunosVinculados.push({
            id: solicitacao.id,
            nomeAluno: solicitacao.nomeAluno,
            email: solicitacao.email,
            idade: solicitacao.idade,
            dataVinculo: new Date().toISOString().split('T')[0]
        });
        
        // Remover da lista de pendentes
        solicitacoesPendentes = solicitacoesPendentes.filter(s => s.id !== solicitacaoId);
        
        // Aqui você salvaria no backend
        console.log('Aluno aceito e adicionado à lista:', solicitacao);
        
        renderizarSolicitacoes();
        renderizarAlunos();
        alert(`${solicitacao.nomeAluno} foi adicionado à sua lista de alunos!`);
    }
}

// Rejeitar solicitação
function rejeitarSolicitacao(solicitacaoId) {
    const solicitacao = solicitacoesPendentes.find(s => s.id === solicitacaoId);
    
    if (confirm(`Recusar solicitação de ${solicitacao.nomeAluno}?`)) {
        // Remover da lista de pendentes
        solicitacoesPendentes = solicitacoesPendentes.filter(s => s.id !== solicitacaoId);
        
        // Aqui você salvaria no backend
        console.log('Solicitação recusada:', solicitacao);
        
        renderizarSolicitacoes();
        alert('Solicitação recusada.');
    }
}

// Ver treinos do aluno
function verTreinosAluno(alunoId) {
    const aluno = alunosVinculados.find(a => a.id === alunoId);
    alert(`Visualizar treinos de ${aluno.nomeAluno}\n(Funcionalidade a ser implementada)`);
}

// Tornar funções globais
window.aceitarSolicitacao = aceitarSolicitacao;
window.rejeitarSolicitacao = rejeitarSolicitacao;
window.verTreinosAluno = verTreinosAluno;

// Inicializar
renderizarSolicitacoes();
renderizarAlunos();

console.log('Dashboard do professor carregado');
