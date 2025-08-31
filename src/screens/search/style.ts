import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    // Container para a barra de busca e filtros
    searchContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        height: 45,
        fontSize: 16,
        marginLeft: 10,
    },
    filterButton: {
        backgroundColor: '#E6F0FF',
        borderColor: '#3F83F8',
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
        alignSelf: 'flex-start',
        marginTop: 10,
    },
    filterButtonText: {
        color: '#3F83F8',
        fontWeight: 'bold',
        fontSize: 14,
    },
    listContainer: {
        padding: 20,
    },
    // ESTILOS DO CARD (INCLUINDO O 'cardImage' QUE FALTAVA)
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#EFEFEF',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cardProvider: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    cardPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3F83F8',
        marginTop: 5,
    },
    // Estilos do Modal de Filtro
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    categoryText: {
        fontSize: 18,
        marginLeft: 15,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#EEE',
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: '#3F83F8',
        marginLeft: 10,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Estilos da Paginação
    loadMoreButton: {
        backgroundColor: '#3F83F8',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    loadMoreText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});