import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { styles } from '../register/style'; // Reutilizando o mesmo estilo!

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

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
            setError(error.message);
        } else {
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                // O listener no App.tsx cuidará da navegação
            }, 1500); // 1.5 segundos é suficiente para o login
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Modal transparent={true} visible={showSuccess} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Ionicons name="checkmark-circle" size={80} color="#48BB78" />
                    </View>
                </View>
            </Modal>

            <Text style={styles.title}>Acesse sua Conta</Text>
            
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={text => { setEmail(text); setError(''); }} keyboardType="email-address" autoCapitalize="none" />
            </View>
            
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={text => { setPassword(text); setError(''); }} secureTextEntry={!isPasswordVisible} />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" style={styles.icon} />
                </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.buttonText}>Entrar</Text>
                )}
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default LoginScreen;