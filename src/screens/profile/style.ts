import { StyleSheet } from 'react-native';

/**
 * Estilos para a tela de Perfil e seus subcomponentes.
 * O layout foi projetado com seções claras para melhorar a organização visual.
 */
export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    // Container do ScrollView para permitir rolagem de todo o conteúdo
    scrollContainer: {
        paddingBottom: 20,
    },
    // Cabeçalho do perfil com avatar e nome
    profileHeader: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 24,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 12,
        backgroundColor: '#E2E8F0',
    },
    // Estilo para o placeholder do avatar quando não há imagem
    avatarPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1A202C',
    },
    editProfileButton: {
        marginTop: 6,
    },
    editProfileText: {
        fontSize: 16,
        color: '#3F83F8',
        fontWeight: '500',
    },
    // Estilo para os títulos das seções do menu (ex: "Minha Conta")
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#718096',
        textTransform: 'uppercase',
        marginTop: 24,
        marginBottom: 8,
        paddingHorizontal: 20,
    },
    menuGroup: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E2E8F0',
    },
    // Estilos para o componente MenuItem
    menuItem: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    // Adiciona uma linha separadora, exceto para o último item
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    menuItemContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 17,
        marginLeft: 16,
        color: '#2D3748',
    },
    // Estilo para o botão de sair
    logoutButton: {
        margin: 20,
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    logoutButtonText: {
        color: '#E53E3E',
        fontSize: 17,
        fontWeight: '600',
    },
});