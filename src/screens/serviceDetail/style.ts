import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

/**
 * @description Estilos para a ServiceDetailScreen e seus subcomponentes.
 */
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
    },
    // Carrossel de Imagens
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
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        fontSize: 12,
        overflow: 'hidden',
    },
    // Container principal para o conteúdo textual
    contentContainer: {
        padding: 20,
    },
    categoryTag: {
        backgroundColor: '#E6F0FF',
        color: '#3F83F8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        alignSelf: 'flex-start',
        overflow: 'hidden',
        marginBottom: 12,
        fontWeight: '500',
        fontSize: 14,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 16,
    },
    // Bloco do Prestador de Serviço
    providerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F7FAFC',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    providerAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        backgroundColor: '#E2E8F0',
    },
    providerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3748',
    },
    // Títulos de Seção (ex: "Detalhes", "Avaliações")
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A202C',
        marginTop: 24,
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#4A5568',
        lineHeight: 26,
    },
    // Container para o cabeçalho da seção de reviews
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        paddingBottom: 8,
    },
    addReviewButton: {
        backgroundColor: 'transparent',
    },
    addReviewButtonText: {
        color: '#3F83F8',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // ADICIONADO: Estilo para o texto de "nenhuma avaliação"
    noReviewsText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666'
    },
    // Estilos para o subcomponente ReviewItem
    reviewItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: '#E2E8F0',
    },
    reviewAuthor: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2D3748',
    },
    reviewStars: {
        flexDirection: 'row',
        marginLeft: 'auto',
    },
    reviewComment: {
        fontSize: 15,
        color: '#4A5568',
        lineHeight: 22,
    },
    // Rodapé Fixo
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
        paddingBottom: 25,
    },
    priceLabel: {
        fontSize: 14,
        color: '#718096',
    },
    priceValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1A202C',
    },
    actionButton: {
        backgroundColor: '#3F83F8',
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 12,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});