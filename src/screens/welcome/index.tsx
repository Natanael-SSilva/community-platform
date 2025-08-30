// Importa o React e os componentes necessários do React Native.
import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';

import { styles } from './style';

const WelcomeScreen = () => {

    const handleGetStarted = () => {
        console.log("Botão 'Get Started' pressionado!");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>Bem-vindo ao Linka!</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                <Text style={styles.buttonText}>Vamos Começar!</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default WelcomeScreen;