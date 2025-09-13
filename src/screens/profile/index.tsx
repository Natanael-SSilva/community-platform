import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator, Image, ScrollView, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../../services/supabase';
import { AppStackParamList } from '../../navigation/types'; // Importação corrigida
import { styles } from './style';
import { Ionicons } from '@expo/vector-icons';

// Tipagem para os dados do perfil
type ProfileData = {
    fullName: string | null;
    avatarUrl: string | null;
};

// Tipagem para as props do subcomponente MenuItem
type MenuItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
    onPress: () => void;
    isLast?: boolean;
};

// O tipo de navegação agora usa a definição centralizada
type ProfileScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'MainTabs'>;

/**
 * @description Subcomponente reutilizável para renderizar um item do menu do perfil.
 */
const MenuItem: React.FC<MenuItemProps> = ({ icon, text, onPress, isLast = false }) => (
    <TouchableOpacity style={[styles.menuItem, !isLast && styles.menuItemBorder]} onPress={onPress}>
        <View style={styles.menuItemContent}>
            <Ionicons name={icon} size={24} color="#718096" />
            <Text style={styles.menuItemText}>{text}</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={24} color="#CBD5E0" />
    </TouchableOpacity>
);

/**
 * @description
 * Tela de Perfil do usuário. Exibe um resumo das informações e serve como
 * ponto de entrada para o gerenciamento da conta.
 */
const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<ProfileData>({ fullName: null, avatarUrl: null });

    useFocusEffect(
        useCallback(() => {
            const fetchProfile = async () => {
                try {
                    setLoading(true);
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error("Usuário não encontrado");

                    const { data, error } = await supabase.from('profiles').select(`full_name, avatar_url`).eq('id', user.id).single();
                    if (error && error.code !== 'PGRST116') throw error;
                    
                    if (data) {
                        setProfile({
                            fullName: data.full_name,
                            avatarUrl: data.avatar_url ? `${data.avatar_url}?t=${new Date().getTime()}` : null
                        });
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
        return <ActivityIndicator style={{ flex: 1 }} />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.profileHeader}>
                    {profile.avatarUrl ? (
                        <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center' }]}>
                            <Ionicons name="person" size={50} color="#CBD5E0" />
                        </View>
                    )}
                    <Text style={styles.fullName}>{profile.fullName || 'Complete seu Perfil'}</Text>
                    <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate('EditProfile')}>
                        <Text style={styles.editProfileText}>Editar perfil</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Minha Conta</Text>
                <View style={styles.menuGroup}>
                    <MenuItem
                        icon="key-outline"
                        text="Alterar senha"
                        onPress={() => navigation.navigate('ChangePassword')}
                    />
                    <MenuItem
                        icon="receipt-outline"
                        text="Meus Serviços"
                        onPress={() => Alert.alert("Em breve!", "Aqui você poderá ver e gerenciar os serviços que cadastrou.")}
                        isLast={true}
                    />
                </View>

                <Text style={styles.sectionTitle}>Ajuda</Text>
                <View style={styles.menuGroup}>
                    <MenuItem
                        icon="help-circle-outline"
                        text="Central de Ajuda"
                        onPress={() => Alert.alert("Em breve!", "Funcionalidade em desenvolvimento.")}
                    />
                    <MenuItem
                        icon="document-text-outline"
                        text="Termos de uso"
                        onPress={() => Alert.alert("Em breve!", "Funcionalidade em desenvolvimento.")}
                        isLast={true}
                    />
                </View>
                
                <TouchableOpacity style={styles.logoutButton} onPress={() => supabase.auth.signOut()}>
                    <Text style={styles.logoutButtonText}>Sair</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;