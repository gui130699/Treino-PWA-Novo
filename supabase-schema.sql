-- ============================================
-- SCRIPT SQL PARA CRIAR TABELAS NO SUPABASE
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. TABELA DE USUÁRIOS (Alunos e Professores)
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('aluno', 'professor')),
    data_nascimento DATE,
    idade INTEGER,
    peso DECIMAL(5,2),
    altura DECIMAL(5,2),
    cref VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE VÍNCULOS (Aluno-Professor)
CREATE TABLE IF NOT EXISTS vinculos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aluno_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    professor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceito', 'recusado')),
    data_solicitacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_resposta TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(aluno_id, professor_id)
);

-- 3. TABELA DE EXERCÍCIOS
CREATE TABLE IF NOT EXISTS exercicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    grupo_muscular VARCHAR(50) NOT NULL,
    descricao TEXT,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DE TREINOS
CREATE TABLE IF NOT EXISTS treinos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aluno_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    professor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    dia_semana VARCHAR(50),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA DE EXERCÍCIOS DO TREINO (Relação)
CREATE TABLE IF NOT EXISTS treino_exercicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    treino_id UUID NOT NULL REFERENCES treinos(id) ON DELETE CASCADE,
    exercicio_id UUID NOT NULL REFERENCES exercicios(id) ON DELETE CASCADE,
    ordem INTEGER NOT NULL,
    series INTEGER,
    repeticoes VARCHAR(50),
    carga DECIMAL(6,2),
    tempo_descanso INTEGER,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA DE EXECUÇÕES DE TREINO (Histórico)
CREATE TABLE IF NOT EXISTS execucoes_treino (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    treino_id UUID NOT NULL REFERENCES treinos(id) ON DELETE CASCADE,
    aluno_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    data_execucao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duracao_minutos INTEGER,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA MELHOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo);
CREATE INDEX IF NOT EXISTS idx_vinculos_aluno ON vinculos(aluno_id);
CREATE INDEX IF NOT EXISTS idx_vinculos_professor ON vinculos(professor_id);
CREATE INDEX IF NOT EXISTS idx_vinculos_status ON vinculos(status);
CREATE INDEX IF NOT EXISTS idx_exercicios_professor ON exercicios(professor_id);
CREATE INDEX IF NOT EXISTS idx_exercicios_grupo ON exercicios(grupo_muscular);
CREATE INDEX IF NOT EXISTS idx_treinos_aluno ON treinos(aluno_id);
CREATE INDEX IF NOT EXISTS idx_treinos_professor ON treinos(professor_id);
CREATE INDEX IF NOT EXISTS idx_treino_exercicios_treino ON treino_exercicios(treino_id);
CREATE INDEX IF NOT EXISTS idx_execucoes_treino_aluno ON execucoes_treino(aluno_id);
CREATE INDEX IF NOT EXISTS idx_execucoes_treino_data ON execucoes_treino(data_execucao);

-- ============================================
-- POLICIES DE SEGURANÇA (RLS - Row Level Security)
-- ============================================

-- OPÇÃO 1: DESABILITAR RLS TEMPORARIAMENTE (MAIS FÁCIL PARA DESENVOLVIMENTO)
-- Descomente estas linhas para desabilitar RLS completamente:
/*
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE vinculos DISABLE ROW LEVEL SECURITY;
ALTER TABLE exercicios DISABLE ROW LEVEL SECURITY;
ALTER TABLE treinos DISABLE ROW LEVEL SECURITY;
ALTER TABLE treino_exercicios DISABLE ROW LEVEL SECURITY;
ALTER TABLE execucoes_treino DISABLE ROW LEVEL SECURITY;
*/

-- OPÇÃO 2: USAR POLÍTICAS PERMISSIVAS (RECOMENDADO)
-- REMOVER POLICIES ANTIGAS (se existirem)
DROP POLICY IF EXISTS "Permitir leitura de usuários" ON usuarios;
DROP POLICY IF EXISTS "Permitir inserção de usuários" ON usuarios;
DROP POLICY IF EXISTS "Permitir atualização próprio usuário" ON usuarios;
DROP POLICY IF EXISTS "Permitir exclusão de usuários" ON usuarios;
DROP POLICY IF EXISTS "Permitir leitura de vínculos" ON vinculos;
DROP POLICY IF EXISTS "Permitir criação de vínculos" ON vinculos;
DROP POLICY IF EXISTS "Permitir atualização de vínculos" ON vinculos;
DROP POLICY IF EXISTS "Permitir exclusão de vínculos" ON vinculos;
DROP POLICY IF EXISTS "Permitir leitura de exercícios" ON exercicios;
DROP POLICY IF EXISTS "Permitir criação de exercícios" ON exercicios;
DROP POLICY IF EXISTS "Permitir atualização de exercícios" ON exercicios;
DROP POLICY IF EXISTS "Permitir exclusão de exercícios" ON exercicios;
DROP POLICY IF EXISTS "Permitir leitura de treinos" ON treinos;
DROP POLICY IF EXISTS "Permitir criação de treinos" ON treinos;
DROP POLICY IF EXISTS "Permitir atualização de treinos" ON treinos;
DROP POLICY IF EXISTS "Permitir exclusão de treinos" ON treinos;
DROP POLICY IF EXISTS "Permitir leitura de treino_exercicios" ON treino_exercicios;
DROP POLICY IF EXISTS "Permitir criação de treino_exercicios" ON treino_exercicios;
DROP POLICY IF EXISTS "Permitir atualização de treino_exercicios" ON treino_exercicios;
DROP POLICY IF EXISTS "Permitir exclusão de treino_exercicios" ON treino_exercicios;
DROP POLICY IF EXISTS "Permitir leitura de execuções" ON execucoes_treino;
DROP POLICY IF EXISTS "Permitir criação de execuções" ON execucoes_treino;
DROP POLICY IF EXISTS "Permitir atualização de execuções" ON execucoes_treino;
DROP POLICY IF EXISTS "Permitir exclusão de execuções" ON execucoes_treino;

-- Habilitar RLS nas tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE vinculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE treinos ENABLE ROW LEVEL SECURITY;
ALTER TABLE treino_exercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE execucoes_treino ENABLE ROW LEVEL SECURITY;

-- Policies para USUARIOS (permitir tudo para usuários anônimos)
CREATE POLICY "Permitir tudo em usuários" ON usuarios FOR ALL USING (true) WITH CHECK (true);

-- Policies para VÍNCULOS
CREATE POLICY "Permitir tudo em vínculos" ON vinculos FOR ALL USING (true) WITH CHECK (true);

-- Policies para EXERCÍCIOS
CREATE POLICY "Permitir tudo em exercícios" ON exercicios FOR ALL USING (true) WITH CHECK (true);

-- Policies para TREINOS
CREATE POLICY "Permitir tudo em treinos" ON treinos FOR ALL USING (true) WITH CHECK (true);

-- Policies para TREINO_EXERCICIOS
CREATE POLICY "Permitir tudo em treino_exercicios" ON treino_exercicios FOR ALL USING (true) WITH CHECK (true);

-- Policies para EXECUÇÕES DE TREINO
CREATE POLICY "Permitir tudo em execucoes_treino" ON execucoes_treino FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- DADOS DE EXEMPLO (Opcional - para testes)
-- ============================================

-- Professor de exemplo
INSERT INTO usuarios (nome_completo, email, senha, tipo, cref) 
VALUES ('Prof. Carlos Silva', 'carlos@professor.com', '$2a$10$example', 'professor', '123456-G/SP')
ON CONFLICT (email) DO NOTHING;

-- Aluno de exemplo
INSERT INTO usuarios (nome_completo, email, senha, tipo, data_nascimento, idade, peso, altura) 
VALUES ('João Silva', 'joao@aluno.com', '$2a$10$example', 'aluno', '1998-05-15', 27, 75.5, 175)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- FIM DO SCRIPT
-- ============================================

-- Para verificar as tabelas criadas, execute:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
