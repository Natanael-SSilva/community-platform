import { StyleSheet } from 'react-native';

/**
 * Estilos para a tela ConfirmEmailScreen.
 * O layout é centralizado usando Flexbox no 'contentContainer'.
 */
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    // Container principal que centraliza todo o conteúdo
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#333',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
        lineHeight: 24,
    },
    otpInput: {
        width: '90%', // Aumentamos a largura para melhor aparência
        height: 50,
        backgroundColor: '#F7FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 22,
        letterSpacing: 10,
        marginBottom: 20,
        color: '#2D3748',
    },
    button: {
        width: '90%',
        backgroundColor: '#3F83F8',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#E53E3E',
        marginBottom: 15,
        fontSize: 14,
        textAlign: 'center',
    },
    resendContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    resendText: {
        fontSize: 14,
        color: '#718096',
    },
    resendButton: {
        marginTop: 5,
    },
    resendButtonText: {
        fontSize: 14,
        color: '#3F83F8',
        fontWeight: 'bold',
    },
    resendStatusText: {
        fontSize: 14,
        color: '#48BB78',
        marginTop: 10,
    },
});