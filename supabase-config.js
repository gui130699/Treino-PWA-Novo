// Configuração do Supabase
const SUPABASE_URL = 'https://bshcttzscofsnysiuaro.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzaGN0dHpzY29mc255c2l1YXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4Nzg4OTcsImV4cCI6MjA1MjQ1NDg5N30.m8YVg0uyLUYwlWo3c5zpwGr6rNaKUhNBSqPaTvmRRfc';

// Aguardar o SDK do Supabase carregar
window.addEventListener('load', () => {
    if (typeof supabase !== 'undefined') {
        // Criar cliente Supabase
        const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabase = supabaseClient;
        console.log('✅ Supabase conectado com sucesso!');
    } else {
        console.error('❌ SDK do Supabase não foi carregado');
    }
});
