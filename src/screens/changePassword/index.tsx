import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Modal, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { styles } from './style';

const ChangePasswordScreen = () => {
    const navigation = useNavigation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChangePassword = async () => {
        setError('');

        // Validações
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setError("Todos os campos são obrigatórios.");
            return;
        }
        if (newPassword.length < 6) {
            setError("A nova senha deve ter no mínimo 6 caracteres.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError("As novas senhas não coincidem.");
            return;
        }

        setLoading(true);

        try {
            // A API do Supabase para atualizar a senha não exige a senha antiga.
            // Para uma segurança extra, vamos primeiro tentar fazer um "re-login" com a senha atual.
            // Se funcionar, significa que a senha atual está correta.
            const { data: { user } } = await supabase.auth.getUser();
            if (!user?.email) throw new Error("Usuário não encontrado.");

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword,
            });

            if (signInError) {
                setError("A senha atual está incorreta.");
                setLoading(false);
                return;
            }

            // Se a senha atual estiver correta, prosseguimos com a atualização
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateError) throw updateError;

            // Sucesso!
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                navigation.goBack(); // Volta para a tela de Perfil
            }, 2000);

        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Modal transparent={true} visible={showSuccess} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Ionicons name="checkmark-circle" size={80} color="#48BB78" />
                        <Text style={styles.modalText}>Senha Alterada!</Text>
                    </View>
                </View>
            </Modal>

            <Text style={styles.headerText}>
                Sua senha precisa ter no mínimo 6 caracteres e conter letras e números para sua segurança.
            </Text>

            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Senha atual" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry={!isCurrentPasswordVisible} />
                <TouchableOpacity onPress={() => setIsCurrentPasswordVisible(!isCurrentPasswordVisible)}>
                    <Ionicons name={isCurrentPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" style={styles.icon} />
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Nova senha" value={newPassword} onChangeText={setNewPassword} secureTextEntry={!isNewPasswordVisible} />
                <TouchableOpacity onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}>
                    <Ionicons name={isNewPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" style={styles.icon} />
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Repita a nova senha" value={confirmNewPassword} onChangeText={setConfirmNewPassword} secureTextEntry={!isConfirmPasswordVisible} />
                <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                    <Ionicons name={isConfirmPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" style={styles.icon} />
                </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleChangePassword} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Confirmar alteração</Text>}
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ChangePasswordScreen;