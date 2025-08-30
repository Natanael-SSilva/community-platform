import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1, // Faz o container ocupar todo o espaço vertical disponível.
        backgroundColor: '#FFFFFF', 
        alignItems: 'center', 
        justifyContent: 'space-around', 
        paddingHorizontal: 20, 
    },
    content: {
        alignItems: 'center', 
    },
    logo: {
        width: 150, 
        height: 150, 
        resizeMode: 'contain', // Garante que a imagem caiba no espaço sem distorcer.
        marginBottom: 20, // Adiciona um espaço abaixo do logo.
    },
    title: {
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#333333', 
        textAlign: 'center', 
    },
    button: {
        backgroundColor: '#3F83F8', 
        paddingVertical: 15, // Espaçamento vertical interno.
        paddingHorizontal: 30, // Espaçamento horizontal interno.
        borderRadius: 10, // Arredonda as bordas do botão.
        width: '100%', // Faz o botão ocupar toda a largura disponível.
        alignItems: 'center', // Centraliza o texto dentro do botão.
    },
    buttonText: {
        color: '#FFFFFF', // Cor do texto (branco).
        fontSize: 18, // Tamanho da fonte.
        fontWeight: 'bold', // Deixa o texto em negrito.
    },
});