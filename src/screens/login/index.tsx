import React, { useState } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, SafeAreaView, Modal, 
    ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Alert, StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { styles } from './style';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

/**
 * @description
 * Tela de Login. Permite que usuários existentes acessem suas contas.
 * A tela se ajusta automaticamente quando o teclado aparece.
 */
const LoginScreen: React.FC = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    /**
     * Tenta autenticar o usuário com o e-mail e senha fornecidos.
     */
    const handleLogin = async () => {
        setError('');
        if (!email || !password) {
            setError("Por favor, preencha e-mail e senha.");
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setError(error.message === 'Email not confirmed' ? 'Por favor, confirme seu e-mail.' : 'E-mail ou senha inválidos.');
        } else {
            setShowSuccess(true);
        }
        setLoading(false);
    };

    /**
     * Navega para a tela de Cadastro.
     */
    const navigateToRegister = () => {
        navigation.navigate('Register');
    };

    /**
     * Navega para a tela de recuperação de senha.
     */
    const navigateToForgotPassword = () => {
        navigation.navigate('ForgotPassword');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView 
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <Modal transparent={true} visible={showSuccess} animationType="fade">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalView}>
                            <Ionicons name="checkmark-circle" size={80} color="#48BB78" />
                        </View>
                    </View>
                </Modal>
                
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer} 
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Bem-vindo(a) de volta!</Text>
                        <Text style={styles.subtitle}>Acesse sua conta para continuar.</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={text => { setEmail(text); setError(''); }} keyboardType="email-address" autoCapitalize="none" />
                        </View>
                        
                        <View style={styles.inputContainer}>
                            <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={text => { setPassword(text); setError(''); }} secureTextEntry={!isPasswordVisible} />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="#A0AEC0" style={styles.icon} />
                            </TouchableOpacity>
                        </View>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TouchableOpacity style={styles.forgotPasswordButton} onPress={navigateToForgotPassword}>
                            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footerContainer}>
                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginButtonText}>Entrar</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.signupButton} onPress={navigateToRegister}>
                            <Text style={styles.signupText}>
                                Não tem uma conta? <Text style={styles.signupLink}>Cadastre-se</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;