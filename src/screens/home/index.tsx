import React from 'react';
import { Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { styles } from './style';

/**
 * Tipagem para a propriedade de navegação específica desta tela.
 * Ajuda o TypeScript a autocompletar e validar as rotas e parâmetros.
 */
type HomeScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'MainTabs'>;

/**
 * Tela inicial do aplicativo (Home).
 * Apresenta uma mensagem de boas-vindas e um botão de ação principal.
 */
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

export default HomeScreen;