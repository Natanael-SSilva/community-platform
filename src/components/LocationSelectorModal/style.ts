import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        height: '80%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    input: {
        flex: 1,
        height: 45,
        fontSize: 16,
        marginLeft: 10,
    },
    listItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    listItemText: {
        fontSize: 16,
    },
});