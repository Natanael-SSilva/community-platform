import React from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import { supabase } from '../../services/supabase';

const HomeScreen = () => {
    // Função para fazer logout
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.subtitle}>Você está na tela principal.</Text>
            <Button title="Sair (Logout)" onPress={handleLogout} color="#FF6347" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 30,
    },
});

export default HomeScreen;