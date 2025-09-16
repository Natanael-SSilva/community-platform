import { StyleSheet } from 'react-native';

/**
 * @description
 * Estilos para a SearchScreen.
 * O design foi refinado para uma aparência mais limpa e profissional,
 * com melhor espaçamento e hierarquia visual.
 */
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    // Container do cabeçalho de busca que fica fixo no topo
    header: {
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
        borderRadius: 12,
        paddingHorizontal: 15,
    },
    searchInput: {
        flex: 1,
        height: 48,
        fontSize: 16,
        marginLeft: 10,
        color: '#2D3748',
    },
    filtersContainer: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 10, // Espaçamento entre os botões de filtro
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6F0FF',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    filterChipText: {
        color: '#3F83F8',
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 6,
    },
    // Estilo para o container da lista
    listContentContainer: {
        padding: 20,
    },
    // Estilos para o estado de lista vazia
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
    },
    emptyIcon: {
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3748',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#718096',
        textAlign: 'center',
        marginTop: 8,
    },
    // Estilos do Modal (consistentes com o resto do app)
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold' },
    categoryItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    categoryText: { fontSize: 18, marginLeft: 15 },
    modalFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    modalButton: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center' },
    closeButton: { backgroundColor: '#EEE', marginRight: 10 },
    saveButton: { backgroundColor: '#3F83F8', marginLeft: 10 },
    modalButtonText: { fontSize: 16, fontWeight: 'bold' },
});