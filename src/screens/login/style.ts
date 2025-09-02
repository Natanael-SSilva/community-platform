import { StyleSheet } from 'react-native';

/**
 * Define os estilos para a LoginScreen.
 * O layout foi projetado para ser limpo e funcional, com uma clara separação entre
 * o cabeçalho, o formulário e as ações no rodapé.
 */
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    // Garante que o ScrollView possa crescer e ocupar o espaço
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    // Cabeçalho com o título e subtítulo
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#718096',
    },
    // Container para os inputs de email e senha
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#2D3748',
    },
    icon: {
        marginLeft: 10,
    },
    // Estilo para o link "Esqueceu a senha?"
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#3F83F8',
        fontSize: 14,
        fontWeight: '500',
    },
    // Rodapé com o botão principal e o link para cadastro
    footerContainer: {
        width: '100%',
        alignItems: 'center',
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#3F83F8',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    signupButton: {
        marginTop: 20,
    },
    signupText: {
        fontSize: 16,
        color: '#718096',
    },
    signupLink: {
        color: '#3F83F8',
        fontWeight: 'bold',
    },
    // Estilos de erro e sucesso (reutilizados)
    errorText: {
        color: '#E53E3E',
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: 150,
        height: 150,
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});