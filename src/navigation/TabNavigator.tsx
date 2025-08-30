import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Importando os ícones

// Importando nossas telas
import HomeScreen from '../screens/home';
import SearchScreen from '../screens/search';
import ProfileScreen from '../screens/profile';

// Cria o navegador de abas
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                // Função para definir o ícone de cada aba
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Início') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Pesquisar') {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    // Retorna o componente de ícone
                    return <Ionicons name={iconName as any} size={size} color={color} />;
                },
                // Definindo as cores com base na nossa identidade visual
                tabBarActiveTintColor: '#3F83F8', // Cor do ícone ativo (azul)
                tabBarInactiveTintColor: 'gray', // Cor do ícone inativo
                headerShown: false, // Esconde o cabeçalho de cada tela da aba
            })}
        >
            <Tab.Screen name="Início" component={HomeScreen} />
            <Tab.Screen name="Pesquisar" component={SearchScreen} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default TabNavigator;