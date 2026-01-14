// Configuração do Supabase
const SUPABASE_URL = 'https://cjzdegocrrjoknrulhnp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqemRlZ29jcnJqb2tucnVsaG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NTY1NTMsImV4cCI6MjA1MjQzMjU1M30.ydeYdhKoXOR25p62RRmkMQ_rXeY2c9z4xVEi_RdQT3E';

// Inicializar o cliente Supabase assim que o SDK estiver carregado
let supabaseClient = null;

// Esperar o Supabase SDK carregar
function initSupabase() {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabase = supabaseClient;
        console.log('✅ Supabase conectado:', SUPABASE_URL);
        console.log('✅ Cliente Supabase pronto');
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
