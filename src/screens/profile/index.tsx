import React, { useState, useCallback } from 'react';
import { 
    View, Text, TouchableOpacity, Alert, SafeAreaView, 
    ActivityIndicator, Image, ScrollView, StatusBar 
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../../services/supabase';
import type { AppStackParamList } from '../../navigation/types';
import { styles } from './style';
import { Ionicons } from '@expo/vector-icons';

// --- Tipos ---
type ProfileData = {
    fullName: string | null;
    avatarUrl: string | null;
};
type MenuItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
    onPress: () => void;
    isLast?: boolean;
};
type ProfileScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'MainTabs'>;

// --- Custom Hook ---
/**
 * Hook para buscar e gerenciar os dados do perfil do usuário.
 * Atualiza os dados sempre que a tela entra em foco.
 */
const useUserProfile = () => {
    const [profile, setProfile] = useState<ProfileData>({ fullName: null, avatarUrl: null });
    const [loading, setLoading] = useState(true);

    // useFocusEffect com useCallback garante que a função de busca seja recriada
    // apenas se necessário e executada toda vez que a tela focar.
    useFocusEffect(
        useCallback(() => {
            const fetchProfile = async () => {
                try {
                    setLoading(true);
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error("Usuário não autenticado");

                    const { data, error } = await supabase
                        .from('profiles')
                        .select(`full_name, avatar_url`)
                        .eq('id', user.id)
                        .single();
                        
                    if (error && error.code !== 'PGRST116') throw error;
                    
                    if (data) {
                        setProfile({
                            fullName: data.full_name,
                            // Adiciona um timestamp para evitar problemas de cache com a imagem
                            avatarUrl: data.avatar_url ? `${data.avatar_url}?t=${new Date().getTime()}` : null
                        });
                    }
                } catch (error) {
                    const message = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
                    Alert.alert('Erro ao carregar perfil', message);
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        }, [])
    );

    return { profile, loading };
};


// --- Subcomponentes ---
/**
 * Subcomponente reutilizável para renderizar um item do menu do perfil.
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


// --- Componente Principal ---
/**
 * Tela de Perfil do usuário. Exibe um resumo das informações e serve como
 * ponto de entrada para o gerenciamento da conta e outras seções do app.
 */
const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const { profile, loading } = useUserProfile();

    /**
     * Lida com o logout do usuário, exibindo um `Alert` de confirmação antes.
     */
    const handleSignOut = () => {
        Alert.alert(
            "Sair da Conta",
            "Você tem certeza que deseja sair?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sair", style: "destructive", onPress: () => supabase.auth.signOut() }
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ActivityIndicator style={{ flex: 1 }} size="large" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.profileHeader}>
                    {profile.avatarUrl ? (
                        <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
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
                
                <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
                    <Text style={styles.logoutButtonText}>Sair</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;