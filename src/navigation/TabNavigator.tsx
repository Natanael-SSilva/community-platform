import React from 'react';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TabParamList } from './types'; // Importa do arquivo central

// Importação das telas que este navegador gerencia
import HomeScreen from '../screens/home';
import SearchScreen from '../screens/search';
import ProfileScreen from '../screens/profile';
import ConversationsScreen from '../screens/conversations';

const Tab = createBottomTabNavigator<TabParamList>();

/**
 * @description
 * Componente de navegação que gerencia a barra de abas principal do aplicativo.
 * É a interface principal para um usuário autenticado.
 * @returns {React.FC} O navegador de abas.
 */
const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }: BottomTabScreenProps<TabParamList>) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Início':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Pesquisar':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Mensagens':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'Perfil':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'alert-circle-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3F83F8',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Pesquisar" component={SearchScreen} />
      <Tab.Screen name="Mensagens" component={ConversationsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;