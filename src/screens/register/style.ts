import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30, // Aumentamos o espaço
        color: '#333',
    },
    // Container para o campo de input e o ícone do olho
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    icon: {
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#3F83F8',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10, // Adiciona um espaço acima do botão
    },
    // Estilo para o botão quando estiver carregando
    buttonDisabled: {
        backgroundColor: '#A5C8FF', // Um azul mais claro
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Estilo para a mensagem de erro
    errorText: {
        color: '#E53E3E', // Vermelho
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 14,
    },
    // Estilos para o Modal de Sucesso
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semitransparente
    },
    modalView: {
        width: 150,
        height: 150,
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
});