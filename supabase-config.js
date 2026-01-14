// Configuração do Supabase
const SUPABASE_URL = 'https://cjzdegocrrjoknrulhnp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqemRlZ29jcnJqb2tucnVsaG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NTY1NTMsImV4cCI6MjA1MjQzMjU1M30.ydeYdhKoXOR25p62RRmkMQ_rXeY2c9z4xVEi_RdQT3E';

// Esperar o DOM e o Supabase SDK carregarem
window.addEventListener('DOMContentLoaded', () => {
    if (window.supabase && window.supabase.createClient) {
        window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase conectado:', SUPABASE_URL);
        console.log('Cliente Supabase:', window.supabase);
    } else {
        console.error('❌ Supabase SDK não carregado');
    }
});
