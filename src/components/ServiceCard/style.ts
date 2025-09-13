import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 20,
        overflow: 'hidden', // Garante que a imagem não ultrapasse as bordas arredondadas
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 150,
        backgroundColor: '#EFEFEF',
    },
    infoContainer: {
        padding: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 4,
    },
    providerName: {
        fontSize: 14,
        color: '#718096',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingText: {
        marginLeft: 6,
        fontSize: 14,
        color: '#4A5568',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3F83F8',
        marginTop: 4,
    },
});