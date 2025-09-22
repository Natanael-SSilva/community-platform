import React, { useState, useEffect } from 'react';
import { 
    View, Text, SafeAreaView, TextInput, TouchableOpacity, 
    ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar 
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { styles } from './style';
import type { AuthStackParamList } from '../../navigation/types';

// --- Tipos e Constantes ---
type ConfirmEmailRouteProp = RouteProp<AuthStackParamList, 'ConfirmEmail'>;
const COOLDOWN_SECONDS = 60;

// --- Custom Hook ---
/**
 * Hook customizado para gerenciar um contador regressivo.
 * @param initialCount O número inicial de segundos para a contagem.
 * @returns Um objeto com o tempo restante e uma função para reiniciar o contador.
 */
const useCountdown = (initialCount: number) => {
    const [countdown, setCountdown] = useState(initialCount);
    const isRunning = countdown > 0;

    useEffect(() => {
        if (!isRunning) return;

        const timerId = setInterval(() => {
            setCountdown(current => current - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [isRunning]);

    const resetCountdown = () => setCountdown(initialCount);

    return { countdown, isRunning, resetCountdown };
};

// --- Componente Principal ---
/**
 * Tela para o usuário inserir o código de verificação (OTP) enviado para seu e-mail.
 */
const ConfirmEmailScreen: React.FC = () => {
    const route = useRoute<ConfirmEmailRouteProp>();
    const { email } = route.params;

    // --- Estados ---
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendStatus, setResendStatus] = useState('');
    const { countdown, isRunning, resetCountdown } = useCountdown(COOLDOWN_SECONDS);

    // --- Funções ---
    /**
     * Valida e envia o código OTP para o Supabase para verificação.
     */
    const handleConfirmOtp = async () => {
        setError('');
        if (otp.length !== 6) {
            setError("O código deve ter 6 dígitos.");
            return;
        }

        setLoading(true);
        const { error: verifyError } = await supabase.auth.verifyOtp({ 
            email: email, 
            token: otp, 
            type: 'signup' 
        });

        if (verifyError) {
            setError("Código inválido ou expirado. Tente novamente.");
        }
        // Em caso de sucesso, o listener de autenticação no App.tsx cuidará da navegação.
        setLoading(false);
    };

    /**
     * Solicita o reenvio de um novo código OTP para o e-mail do usuário.
     */
    const handleResendOtp = async () => {
        if (isRunning || loading) return;

        setLoading(true);
        setResendStatus('');
        setError('');
        
        const { error: resendError } = await supabase.auth.resend({ type: 'signup', email: email });
        
        if (resendError) {
            setError("Ocorreu um erro ao reenviar o código.");
        } else {
            setResendStatus("Um novo código foi enviado para seu e-mail.");
            resetCountdown(); // Reinicia o contador
        }
        setLoading(false);
    };

    // --- Renderização ---
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.contentContainer}>
                    <Ionicons name="mail-open-outline" size={80} color="#3F83F8" style={styles.icon} />
                    <Text style={styles.title}>Verifique seu E-mail</Text>
                    <Text style={styles.message}>
                        Enviamos um código de 6 dígitos para {email}. Por favor, insira-o abaixo.
                    </Text>
                    <TextInput
                        style={styles.otpInput}
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                        maxLength={6}
                        placeholder="------"
                        placeholderTextColor="#CBD5E0"
                    />

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity style={styles.button} onPress={handleConfirmOtp} disabled={loading}>
                        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Confirmar e Continuar</Text>}
                    </TouchableOpacity>
                    
                    <View style={styles.resendContainer}>
                        {!isRunning ? (
                            <TouchableOpacity style={styles.resendButton} onPress={handleResendOtp} disabled={loading}>
                                <Text style={styles.resendButtonText}>Não recebeu? Reenviar código</Text>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.resendText}>
                                Você pode reenviar o código em {countdown} segundos
                            </Text>
                        )}
                        {resendStatus ? <Text style={styles.resendStatusText}>{resendStatus}</Text> : null}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ConfirmEmailScreen;