import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // O container principal que permite a rolagem
    scrollContainer: {
        flexGrow: 1, // Permite que o conteúdo cresça e preencha o espaço
        backgroundColor: '#FFFFFF',
    },
    // Estilos para o Carrossel de Imagens
    imageCarousel: {
        width: width,
        height: 250,
    },
    image: {
        width: width,
        height: 250,
        resizeMode: 'cover',
    },
    imageCounter: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: '#FFFFFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 15,
        fontSize: 12,
        overflow: 'hidden', // Garante o arredondamento no iOS
    },
    // Conteúdo principal da tela
    contentContainer: {
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    categoryTag: {
        backgroundColor: '#E6F0FF',
        color: '#3F83F8',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        alignSelf: 'flex-start',
        overflow: 'hidden',
        marginBottom: 15,
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    // Bloco do Prestador de Serviço
    providerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        marginTop: 20,
    },
    providerAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        backgroundColor: '#EFEFEF',
    },
    providerName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Seção de Preço e Botão de Ação (Rodapé)
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        backgroundColor: '#FFFFFF', // Garante um fundo branco
    },
    priceLabel: {
        fontSize: 14,
        color: '#666',
    },
    priceValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    actionButton: {
        backgroundColor: '#3F83F8',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});