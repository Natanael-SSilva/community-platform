import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { supabase } from '../../services/supabase';
import { styles } from './style';

/**
 * @description
 * Tela onde o usuário insere seu e-mail para iniciar o fluxo de recuperação de senha.
 * Envia uma solicitação ao Supabase para que um e-mail com um link de
 * redirecionamento (deep link) seja enviado para o aplicativo.
 */
const ForgotPasswordScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /**
     * Valida o e-mail e chama a função de reset de senha do Supabase.
     * A propriedade 'redirectTo' é crucial para sobrescrever a 'Site URL' padrão
     * e garantir que o usuário seja redirecionado para o aplicativo.
     */
    const handlePasswordReset = async () => {
        setError('');
        if (!email.trim()) {
            setError("Por favor, insira seu e-mail.");
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            // ESTA LINHA É A MAIS IMPORTANTE DE TODAS:
            // Ela sobrescreve a 'Site URL' do painel e força o redirecionamento
            // para o nosso deep link, que abrirá a tela ResetPassword.
            redirectTo: 'servicoscomunitarios://reset-password',
        });

        if (error) {
            setError(error.message);
        } else {
            // Uma mensagem genérica é mais segura, pois não confirma se um e-mail existe na base.
            Alert.alert(
                "Verifique seu E-mail", 
                "Se uma conta com este e-mail existir, enviamos um link para redefinir sua senha."
            );
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
                <Text style={styles.title}>Recuperar Senha</Text>
                <Text style={styles.subtitle}>Digite seu e-mail e enviaremos um link para você voltar a acessar sua conta.</Text>
                
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Seu e-mail" 
                        value={email} 
                        onChangeText={text => { setEmail(text); setError(''); }}
                        keyboardType="email-address" 
                        autoCapitalize="none" 
                    />
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handlePasswordReset} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Enviar Link de Recuperação</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;