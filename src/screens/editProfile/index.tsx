import React, { useState, useEffect } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, 
    ActivityIndicator, Image, ScrollView 
} from 'react-native';
import { supabase } from '../../services/supabase';
import { styles } from './style';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { decode } from 'base64-arraybuffer';
import LocationSelectorModal from '../../components/LocationSelectorModal';

// --- Tipos ---
type Profile = {
    username: string;
    full_name: string;
    phone: string;
    avatar_url: string | null;
    location: string;
};

// --- Custom Hook ---
/**
 * Hook para gerenciar os dados do perfil do usuário.
 * Encapsula a lógica de buscar, atualizar o perfil e o avatar.
 */
const useProfile = () => {
    const [profile, setProfile] = useState<Partial<Profile>>({});
    const [loading, setLoading] = useState(true);
    const [isDirty, setIsDirty] = useState(false); // Rastreia se houve mudanças

    // Busca o perfil inicial do usuário
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("Usuário não encontrado");

                const { data, error } = await supabase
                    .from('profiles')
                    .select(`username, full_name, phone, avatar_url, location`)
                    .eq('id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;
                if (data) setProfile(data);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
                Alert.alert("Erro ao carregar dados", message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    /** Atualiza um campo específico do perfil */
    const updateProfileField = (field: keyof Profile, value: string | null) => {
        setProfile(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    /** Salva todas as mudanças do perfil no banco de dados */
    const saveProfileChanges = async () => {
        if (!isDirty) {
            Alert.alert("Nenhuma alteração", "Não há nenhuma alteração para salvar.");
            return;
        }
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Usuário não encontrado");

            const updates = { ...profile, updated_at: new Date() };
            const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
            if (error) throw error;
            
            Alert.alert("Sucesso!", "Seu perfil foi atualizado.");
            setIsDirty(false); // Reseta o estado de mudanças
        } catch (error) {
            const message = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
            Alert.alert("Erro ao atualizar", message);
        } finally {
            setLoading(false);
        }
    };
    
    /** Faz o upload de um novo avatar */
    const uploadAvatar = async (base64Image: string) => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Usuário não encontrado");

            const filePath = `${user.id}/${new Date().getTime()}.png`;
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, decode(base64Image), { contentType: 'image/png', upsert: true });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const newAvatarUrl = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;
            
            await supabase.from('profiles').update({ avatar_url: newAvatarUrl, updated_at: new Date() }).eq('id', user.id);
            updateProfileField('avatar_url', newAvatarUrl);

            Alert.alert("Sucesso!", "Foto de perfil atualizada.");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
            Alert.alert("Erro no upload", message);
        } finally {
            setLoading(false);
        }
    };

    return { profile, loading, updateProfileField, saveProfileChanges, uploadAvatar };
};


// --- Componente Principal ---
const EditProfileScreen = () => {
    const { profile, loading, updateProfileField, saveProfileChanges, uploadAvatar } = useProfile();
    const [isLocationModalVisible, setLocationModalVisible] = useState(false);

    const handlePickImage = async () => {
        Alert.alert(
            "Alterar Foto",
            "Escolha uma opção",
            [
                { text: "Tirar Foto", onPress: () => selectImage('camera') },
                { text: "Escolher da Galeria", onPress: () => selectImage('gallery') },
                { text: "Cancelar", style: "cancel" }
            ]
        );
    };

    const selectImage = async (source: 'camera' | 'gallery') => {
        const options: ImagePicker.ImagePickerOptions = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
            base64: true,
        };
        
        let result;
        if (source === 'camera') {
            await ImagePicker.requestCameraPermissionsAsync();
            result = await ImagePicker.launchCameraAsync(options);
        } else {
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            result = await ImagePicker.launchImageLibraryAsync(options);
        }
    
        if (!result.canceled && result.assets && result.assets[0].base64) {
            uploadAvatar(result.assets[0].base64);
        }
    };

    if (loading && !profile.avatar_url) {
        return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" />;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
            <LocationSelectorModal
                visible={isLocationModalVisible}
                onClose={() => setLocationModalVisible(false)}
                onLocationSelect={(selectedLocation) => {
                    updateProfileField('location', selectedLocation);
                    setLocationModalVisible(false); // Fecha o modal após a seleção
                }}
            />
            <ScrollView style={styles.container}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: profile.avatar_url || undefined }} style={styles.avatar} />
                    <TouchableOpacity onPress={handlePickImage} style={styles.editAvatarButton}>
                        <Ionicons name="camera" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Nome de Usuário</Text>
                <TextInput style={styles.input} value={profile.username} onChangeText={(text) => updateProfileField('username', text)} />

                <Text style={styles.label}>Nome e Sobrenome</Text>
                <TextInput style={styles.input} value={profile.full_name} onChangeText={(text) => updateProfileField('full_name', text)} />

                <Text style={styles.label}>Telefone</Text>
                <TextInput style={styles.input} value={profile.phone} onChangeText={(text) => updateProfileField('phone', text)} keyboardType="phone-pad" />

                <Text style={styles.label}>Minha Localização</Text>
                <TouchableOpacity style={styles.locationButton} onPress={() => setLocationModalVisible(true)}>
                    <Text style={profile.location ? styles.locationText : styles.locationPlaceholder}>
                        {profile.location || 'Clique para selecionar sua cidade'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={saveProfileChanges} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Salvar Alterações</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfileScreen;