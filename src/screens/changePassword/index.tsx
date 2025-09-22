import React, { useState } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, SafeAreaView, 
    Modal, ActivityIndicator, TextInputProps
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { styles } from './style';

// --- Subcomponente para Clean Code ---

interface PasswordInputProps extends TextInputProps {
    value: string;
    onChangeText: (text: string) => void;
}

/**
 * Um componente de input de senha reutilizável com um ícone para alternar a visibilidade.
 */
const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChangeText, ...props }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={!isVisible}
                autoCapitalize="none"
                {...props}
            />
            <TouchableOpacity onPress={() => setIsVisible(!isVisible)} style={styles.icon}>
                <Ionicons name={isVisible ? "eye-off" : "eye"} size={24} color="gray" />
            </TouchableOpacity>
        </View>
    );
};

// --- Componente Principal ---

/**
 * Tela que permite ao usuário alterar sua senha.
 * O usuário deve fornecer a senha atual e uma nova senha (com confirmação).
 */
const ChangePasswordScreen = () => {
    const navigation = useNavigation();
    
    // --- Estados ---
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    /**
     * Valida as senhas inseridas pelo usuário.
     * @returns Uma string de erro se a validação falhar, caso contrário, null.
     */
    const validatePasswords = (): string | null => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return "Todos os campos são obrigatórios.";
        }
        if (newPassword.length < 6) {
            return "A nova senha deve ter no mínimo 6 caracteres.";
        }
        if (newPassword !== confirmNewPassword) {
            return "As novas senhas não coincidem.";
        }
        return null;
    };

    /**
     * Orquestra o processo de alteração de senha, incluindo validação e chamadas à API.
     */
    const handleChangePassword = async () => {
        setError('');
        const validationError = validatePasswords();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user?.email) throw new Error("Usuário não autenticado. Por favor, faça login novamente.");

            // Verifica se a senha atual está correta tentando fazer login com ela
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword,
            });

            if (signInError) {
                setError("A senha atual está incorreta.");
                return; // Não precisa de throw, apenas para a execução
            }

            // Se a verificação passar, atualiza para a nova senha
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateError) throw updateError;

            // Exibe o modal de sucesso e navega de volta após um intervalo
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigation.goBack();
            }, 2000);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Modal transparent={true} visible={showSuccessModal} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Ionicons name="checkmark-circle" size={80} color="#48BB78" />
                        <Text style={styles.modalText}>Senha Alterada!</Text>
                    </View>
                </View>
            </Modal>

            <Text style={styles.headerText}>
                Sua senha precisa ter no mínimo 6 caracteres para sua segurança.
            </Text>

            <PasswordInput
                placeholder="Senha atual"
                value={currentPassword}
                onChangeText={setCurrentPassword}
            />

            <PasswordInput
                placeholder="Nova senha"
                value={newPassword}
                onChangeText={setNewPassword}
            />

            <PasswordInput
                placeholder="Repita a nova senha"
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleChangePassword} 
                disabled={loading}
            >
                {loading 
                    ? <ActivityIndicator color="#FFFFFF" /> 
                    : <Text style={styles.buttonText}>Confirmar alteração</Text>
                }
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ChangePasswordScreen;