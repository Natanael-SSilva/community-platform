import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1, // Faz o container ocupar toda a tela
        backgroundColor: '#F9F9F9',
    },
    // Este novo container vai separar o conteúdo principal do botão de logout
    mainContent: {
        flex: 1, // Faz este container crescer e ocupar o espaço, empurrando o botão para baixo
    },
    profileHeader: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EFEFEF',
        marginBottom: 10,
    },
    fullName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    editProfileText: {
        fontSize: 16,
        color: '#3F83F8',
        fontWeight: '500', // Um pouco mais de peso
        marginTop: 5,
    },
    menuContainer: {
        marginTop: 20,
    },
    menuItem: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 18, // Um pouco mais de espaçamento
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    menuItemText: {
        flex: 1, // Faz o texto ocupar o espaço disponível
        fontSize: 18,
        marginLeft: 15,
        color: '#333',
    },
    logoutButton: {
        margin: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5, // Borda um pouco mais grossa
        borderColor: '#E53E3E',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#E53E3E',
        fontSize: 18,
        fontWeight: 'bold',
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EFEFEF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
},
});