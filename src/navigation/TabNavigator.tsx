import React from 'react';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/home';
import SearchScreen from '../screens/search';
import ProfileScreen from '../screens/profile';

// MELHORIA: Definimos o "mapa" de telas para o Tab Navigator
export type TabParamList = {
  Início: undefined;
  Pesquisar: undefined;
  Perfil: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      // MELHORIA: A tipagem agora é mais limpa e automática
      screenOptions={({ route }: BottomTabScreenProps<TabParamList>) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          // MELHORIA: Usando 'switch' para deixar a lógica mais clara
          switch (route.name) {
            case 'Início':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Pesquisar':
              iconName = focused ? 'search' : 'search-outline';
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
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;