import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator, Image, ScrollView } from 'react-native';
import { supabase } from '../../services/supabase';
import { styles } from './style';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { decode } from 'base64-arraybuffer';
import LocationSelectorModal from '../../components/LocationSelectorModal';

const EditProfileScreen = () => {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [location, setLocation] = useState('');
    const [isLocationModalVisible, setLocationModalVisible] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("Usuário não encontrado");

                const { data, error } = await supabase
                    .from('profiles')
                    .select(`username, full_name, phone, avatar_url, location`)
                    .eq('id', user.id)
                    .single();
                if (error && error.code !== 'PGRST116') throw error;
                if (data) {
                    setUsername(data.username || '');
                    setFullName(data.full_name || '');
                    setPhone(data.phone || '');
                    setAvatarUrl(data.avatar_url);
                    setLocation(data.location || '');
                }
            } catch (error: any) {
                Alert.alert("Erro ao carregar dados", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const pickImage = async (fromCamera: boolean) => {
        let result;
        const options: ImagePicker.ImagePickerOptions = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
            base64: true,
        };
    
        if (fromCamera) {
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

    const uploadAvatar = async (base64Image: string) => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Usuário não encontrado");

            const fileExt = 'png';
            const filePath = `${user.id}/${new Date().getTime()}.${fileExt}`;
            const imageArrayBuffer = decode(base64Image);

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, imageArrayBuffer, {
                    contentType: `image/${fileExt}`,
                    upsert: false,
                    cacheControl: '3600',
                });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);

            if (publicUrlData) {
                const newAvatarUrl = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;
                setAvatarUrl(newAvatarUrl);
                const { error: updateError } = await supabase.from('profiles').update({ avatar_url: newAvatarUrl, updated_at: new Date() }).eq('id', user.id);
                if (updateError) throw updateError;
                Alert.alert("Sucesso!", "Foto de perfil atualizada.");
            }
        } catch (error: any) {
            Alert.alert("Erro no upload", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Usuário não encontrado");

            const updates = {
                id: user.id,
                username,
                full_name: fullName,
                phone,
                location,
                updated_at: new Date(),
            };
            
            const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
            if (error) throw error;
            
            Alert.alert("Sucesso!", "Seu perfil foi atualizado.");
        } catch (error: any) {
            Alert.alert("Erro ao atualizar", error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !avatarUrl) return <ActivityIndicator style={{ flex: 1 }} />;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
            <LocationSelectorModal
                visible={isLocationModalVisible}
                onClose={() => setLocationModalVisible(false)}
                onLocationSelect={(selectedLocation) => {
                    setLocation(selectedLocation);
                }}
            />
            <ScrollView style={styles.container}>
                <View style={styles.avatarContainer}>
                    {avatarUrl ? (
                        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="person" size={50} color="#666" />
                        </View>
                    )}
                    <TouchableOpacity onPress={() => Alert.alert("Adicionar Foto", "Escolha uma opção", [{ text: "Tirar Foto", onPress: () => pickImage(true) }, { text: "Escolher da Galeria", onPress: () => pickImage(false) }, { text: "Cancelar", style: "cancel" }])} style={styles.editAvatarButton}>
                        <Ionicons name="camera" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Nome de Usuário</Text>
                <TextInput style={styles.input} value={username} onChangeText={setUsername} />

                <Text style={styles.label}>Nome e Sobrenome</Text>
                <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

                <Text style={styles.label}>Telefone</Text>
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

                <Text style={styles.label}>Minha Localização</Text>
                <TouchableOpacity style={styles.locationButton} onPress={() => setLocationModalVisible(true)}>
                    {location ? (
                        <Text style={styles.locationText}>{location}</Text>
                    ) : (
                        <Text style={styles.locationPlaceholder}>Clique para selecionar sua cidade</Text>
                    )}
                    <Ionicons name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleUpdateProfile} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Salvar Alterações</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfileScreen;