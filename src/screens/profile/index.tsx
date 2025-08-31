import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../../services/supabase';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { styles } from './style';
import { Ionicons } from '@expo/vector-icons';

type ProfileScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'MainTabs'>;

const ProfileScreen = () => {
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            const fetchProfile = async () => {
                try {
                    setLoading(true);
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error("Usuário não encontrado");

                    const { data, error } = await supabase
                        .from('profiles')
                        .select(`full_name, avatar_url`)
                        .eq('id', user.id)
                        .single();

                    if (error && error.code !== 'PGRST116') throw error;
                    
                    if (data) {
                        setFullName(data.full_name);
                        if (data.avatar_url) {
                            setAvatarUrl(`${data.avatar_url}?t=${new Date().getTime()}`);
                        }
                    }
                } catch (error: any) {
                    Alert.alert('Erro ao carregar perfil', error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchProfile();
        }, [])
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#3F83F8" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContent}>
                <View style={styles.profileHeader}>
                    {avatarUrl ? (
                        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="person" size={50} color="#666" />
                        </View>
                    )}
                    <Text style={styles.fullName}>{fullName || 'Nome do Usuário'}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                        <Text style={styles.editProfileText}>Editar perfil</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Em breve!", "Funcionalidade de pedidos em desenvolvimento.")}>
                        <Ionicons name="receipt-outline" size={24} color="#666" />
                        <Text style={styles.menuItemText}>Pedidos</Text>
                    </TouchableOpacity>

                    {/* Botão de "Alterar senha" agora navega para a tela correta */}
                    <TouchableOpacity 
                        style={styles.menuItem} 
                        onPress={() => navigation.navigate('ChangePassword')}
                    >
                        <Ionicons name="key-outline" size={24} color="#666" />
                        <Text style={styles.menuItemText}>Alterar senha</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Em breve!", "Funcionalidade de Ajuda em desenvolvimento.")}>
                        <Ionicons name="help-circle-outline" size={24} color="#666" />
                        <Text style={styles.menuItemText}>Ajuda</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={() => supabase.auth.signOut()}>
                <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ProfileScreen;