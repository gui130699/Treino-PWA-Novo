// Configuração do Supabase - Novo formato de chaves
const SUPABASE_URL = 'https://bshcttzscofsnysiuaro.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzaGN0dHpzY29mc255c2l1YXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4Nzg4OTcsImV4cCI6MjA1MjQ1NDg5N30.m8YVg0uyLUYwlWo3c5zpwGr6rNaKUhNBSqPaTvmRRfc';

// Inicializar o cliente Supabase assim que o SDK estiver carregado
let supabaseClient = null;

// Esperar o Supabase SDK carregar
function initSupabase() {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        // Criar cliente com as novas chaves publicáveis
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: false,
                autoRefreshToken: false
            }
        });
        window.supabase = supabaseClient;
        console.log('✅ Supabase conectado:', SUPABASE_URL);
        console.log('✅ Cliente Supabase pronto');
        console.log('✅ Usando novas chaves publicáveis');
        return true;
    }
    return false;
}

// Tentar inicializar imediatamente
if (!initSupabase()) {
    // Se não funcionou, esperar o DOM carregar
    document.addEventListener('DOMContentLoaded', () => {
        if (!initSupabase()) {
            console.error('❌ Supabase SDK não carregado');
        }
    });
}
