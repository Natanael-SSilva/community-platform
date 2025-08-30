import 'react-native-url-polyfill/auto'; // Necessário para o Supabase funcionar no React Native
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Endereço do seu projeto Supabase que você copiou
const supabaseUrl = 'https://exrlkftamxfelvnrnexj.supabase.co'; 

// Chave pública 'anon' do seu projeto Supabase que você copiou
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4cmxrZnRhbXhmZWx2bnJuZXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1ODQxNDgsImV4cCI6MjA3MjE2MDE0OH0.0QTxxJ8WETwSixO8w9zLp6vl3UHPam3yTiIi3D6YhmQ';

// Cria e exporta o cliente Supabase, configurando-o para usar o AsyncStorage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Usa o armazenamento seguro do dispositivo
    autoRefreshToken: true, // Renova o token do usuário automaticamente
    persistSession: true, // Garante que a sessão do usuário continue após fechar o app
    detectSessionInUrl: false, // Importante para mobile, desabilita detecção de sessão na URL
  },
});