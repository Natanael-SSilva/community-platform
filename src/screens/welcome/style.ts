import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1, // Faz o container ocupar todo o espaço vertical disponível.
        backgroundColor: '#FFFFFF', // Define a cor de fundo como branco.
        alignItems: 'center', // Centraliza os filhos na horizontal.
        justifyContent: 'space-around', // Distribui os filhos verticalmente com espaço entre eles.
        paddingHorizontal: 20, // Adiciona um espaçamento nas laterais.
    },
    content: {
        alignItems: 'center', // Centraliza o logo e o texto.
    },
    logo: {
        width: 150, // Largura da imagem.
        height: 150, // Altura da imagem.
        resizeMode: 'contain', // Garante que a imagem caiba no espaço sem distorcer.
        marginBottom: 20, // Adiciona um espaço abaixo do logo.
    },
    title: {
        fontSize: 24, // Tamanho da fonte.
        fontWeight: 'bold', // Deixa o texto em negrito.
        color: '#333333', // Cor do texto.
        textAlign: 'center', // Centraliza o texto.
    },
    button: {
        backgroundColor: '#3F83F8', // Cor de fundo azul do botão.
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