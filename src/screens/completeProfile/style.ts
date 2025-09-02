import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
    },
    // Estilo aprimorado para o seletor de avatar
    avatarPicker: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F7FAFC',
        borderWidth: 2,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    avatarEditText: {
        marginTop: 10,
        color: '#3F83F8',
        fontSize: 16,
        fontWeight: '500',
    },
    formContainer: {
        width: '100%',
    },
    label: {
        fontSize: 16,
        color: '#4A5568',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        height: 50,
        backgroundColor: '#F7FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#2D3748',
        marginBottom: 15,
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        backgroundColor: '#F7FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    locationText: {
        flex: 1,
        fontSize: 16,
        color: '#2D3748',
    },
    locationPlaceholder: {
        flex: 1,
        fontSize: 16,
        color: '#A0AEC0',
    },
    button: {
        width: '100%',
        backgroundColor: '#3F83F8',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});