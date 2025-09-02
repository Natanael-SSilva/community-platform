import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../services/supabase';
import { styles } from '../forgotPassword/style'; // Reutilizando estilo
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;

/**
 * Tela onde o usuário define a nova senha após clicar no link de recuperação.
 */
const ResetPasswordScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password: password });

        if (error) {
            setError(error.message);
        } else {
            Alert.alert("Senha Redefinida!", "Sua senha foi alterada com sucesso. Por favor, faça o login novamente.");
            // Reseta a navegação para a tela de Login
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Defina sua Nova Senha</Text>
                <Text style={styles.subtitle}>Escolha uma senha forte e segura.</Text>

                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Nova senha" value={password} onChangeText={setPassword} secureTextEntry={!isPasswordVisible} />
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="#A0AEC0" />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Confirmar nova senha" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!isPasswordVisible} />
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Salvar Nova Senha</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ResetPasswordScreen;