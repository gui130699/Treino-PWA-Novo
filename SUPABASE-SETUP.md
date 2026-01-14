# Configuração do Banco de Dados Supabase

## 🔑 Credenciais

- **URL**: https://cjzdegocrrjoknrulhnp.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqemRlZ29jcnJqb2tucnVsaG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NTY1NTMsImV4cCI6MjA1MjQzMjU1M30.ydeYdhKoXOR25p62RRmkMQ_rXeY2c9z4xVEi_RdQT3E

## 📋 Como Criar as Tabelas

### Opção 1: Via Interface Web do Supabase

1. Acesse: https://supabase.com/dashboard/project/cjzdegocrrjoknrulhnp
2. Vá em **SQL Editor** (menu lateral esquerdo)
3. Clique em **New Query**
4. Copie e cole todo o conteúdo do arquivo `supabase-schema.sql`
5. Clique em **Run** (Ctrl + Enter)

### Opção 2: Via Terminal (Supabase CLI)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref cjzdegocrrjoknrulhnp

# Executar migrations
supabase db push
```

## 🗄️ Estrutura das Tabelas

### 1. **usuarios**
- Armazena alunos e professores
- Campos: nome, email, senha, tipo, dados físicos, CREF

### 2. **vinculos**
- Relacionamento aluno-professor
- Status: pendente, aceito, recusado

### 3. **exercicios**
- Biblioteca de exercícios do professor
- Campos: nome, grupo muscular, descrição

### 4. **treinos**
- Treinos criados pelo professor para alunos
- Campos: nome, descrição, dia da semana

### 5. **treino_exercicios**
- Exercícios dentro de cada treino
- Campos: séries, repetições, carga, descanso

### 6. **execucoes_treino**
- Histórico de treinos realizados
- Para gráficos e estatísticas

## ✅ Verificação

Após executar o SQL, verifique se as tabelas foram criadas:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Você deve ver 6 tabelas:
- usuarios
- vinculos
- exercicios
- treinos
- treino_exercicios
- execucoes_treino

## 🔐 Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Policies configuradas para acesso controlado
- Para produção, recomenda-se refinar as policies baseado em auth.uid()
