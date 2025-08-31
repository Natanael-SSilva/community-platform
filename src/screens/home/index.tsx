import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator'; // Importamos o mapa de telas
import { styles } from './style';

// Tipagem para a navegação
type HomeScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'MainTabs'>;

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Bem-vindo à Plataforma!</Text>
            <Text style={styles.subtitle}>Anuncie seus serviços ou encontre a ajuda que precisa na sua comunidade.</Text>

            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('AddService')}
            >
                <Text style={styles.buttonText}>Anunciar um Serviço</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

// Se o seu estilo já está em um arquivo separado, não precisa desta parte aqui.
// Apenas garanta que o arquivo styles.ts esteja atualizado.
// const styles = StyleSheet.create({ ... });

export default HomeScreen;