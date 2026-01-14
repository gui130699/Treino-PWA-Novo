// Configuração do Supabase
const SUPABASE_URL = 'https://cjzdegocrrjoknrulhnp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqemRlZ29jcnJqb2tucnVsaG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NTY1NTMsImV4cCI6MjA1MjQzMjU1M30.ydeYdhKoXOR25p62RRmkMQ_rXeY2c9z4xVEi_RdQT3E';

// Inicializar cliente Supabase
let supabase;

// Carregar o SDK do Supabase
function carregarSupabase() {
    return new Promise((resolve, reject) => {
        if (window.supabase) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = () => {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase conectado com sucesso!');
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Inicializar automaticamente
carregarSupabase().catch(error => {
    console.error('Erro ao carregar Supabase:', error);
});
