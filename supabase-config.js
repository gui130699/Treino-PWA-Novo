// Configuração do Supabase - Novo formato de chaves
const SUPABASE_URL = 'https://bshcttzscofsnysiuaro.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_c8kMhX2Y4gtPwjJ53SUdcw_tvDCCGYw';

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
