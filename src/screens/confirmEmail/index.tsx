import React, { useState, useEffect } from 'react';
import { 
    View, Text, SafeAreaView, TextInput, TouchableOpacity, 
    Alert, ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar 
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { styles } from './style';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type ConfirmEmailRouteProp = RouteProp<AuthStackParamList, 'ConfirmEmail'>;

const COOLDOWN_SECONDS = 60;

/**
 * @description
 * Tela para o usuário inserir o código de verificação (OTP) enviado para seu e-mail.
 * A tela se ajusta automaticamente para o teclado não cobrir o campo de input.
 */
const ConfirmEmailScreen: React.FC = () => {
    // A lógica de estados e funções permanece a mesma
    const route = useRoute<ConfirmEmailRouteProp>();
    const { email } = route.params;
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(COOLDOWN_SECONDS);
    const [canResend, setCanResend] = useState(false);
    const [resendStatus, setResendStatus] = useState('');

    useEffect(() => {
        if (countdown <= 0) {
            setCanResend(true);
            return;
        }
        const timerId = setInterval(() => {
            setCountdown(currentCountdown => currentCountdown - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [countdown]);

    const handleConfirmOtp = async () => {
        setError('');
        if (otp.length !== 6) {
            setError("O código deve ter 6 dígitos.");
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.verifyOtp({ email: email, token: otp, type: 'signup' });
        if (error) {
            setError("Código inválido ou expirado. Tente novamente.");
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!canResend) return;
        setLoading(true);
        setResendStatus('');
        setError('');
        const { error } = await supabase.auth.resend({ type: 'signup', email: email });
        if (error) {
            setError("Ocorreu um erro ao reenviar o código.");
        } else {
            setResendStatus("Um novo código foi enviado para seu e-mail.");
            setCountdown(COOLDOWN_SECONDS);
            setCanResend(false);
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                {/* MUDANÇA: Removemos o ScrollView e usamos uma View simples para centralizar */}
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
                    />

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity style={styles.button} onPress={handleConfirmOtp} disabled={loading}>
                        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Confirmar e Continuar</Text>}
                    </TouchableOpacity>
                    
                    <View style={styles.resendContainer}>
                        {canResend ? (
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