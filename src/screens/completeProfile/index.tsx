import React, { useState } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, 
    ScrollView, KeyboardAvoidingView, Platform, Alert, Image 
} from 'react-native';
import MaskInput from 'react-native-mask-input';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../../services/supabase';
import LocationSelectorModal from '../../components/LocationSelectorModal';
import { styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'CompleteProfile'>;

/**
 * @description
 * Tela de "Completar Cadastro" (Onboarding).
 * Coleta informações essenciais do perfil após a confirmação do e-mail.
 */
const CompleteProfileScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isLocationModalVisible, setLocationModalVisible] = useState(false);

    /**
     * Abre a galeria ou a câmera para o usuário selecionar uma foto de perfil.
     * @param {boolean} fromCamera - Define se a imagem deve ser capturada pela câmera.
     */
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

    /**
     * Realiza o upload da imagem selecionada para o Supabase Storage.
     * @param {string} base64 - A imagem codificada em base64.
     */
    const uploadAvatar = async (base64: string) => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Usuário não encontrado");

            const filePath = `${user.id}/${new Date().getTime()}.png`;
            const imageBuffer = decode(base64);

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, imageBuffer, { contentType: 'image/png' });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const publicUrl = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;
            setAvatarUrl(publicUrl);

            // Atualiza a URL do avatar na tabela de perfis
            const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
            if (updateError) throw updateError;
        } catch (error: any) {
            Alert.alert("Erro no upload", error.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Valida e salva as informações do perfil no banco de dados.
     * Em caso de sucesso, reseta a navegação para a tela principal do app.
     */
    const handleCompleteProfile = async () => {
        if (!fullName || !phone || !location) {
            Alert.alert("Campos obrigatórios", "Por favor, preencha todas as informações para continuar.");
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Usuário não autenticado.");

            const updates = {
                id: user.id,
                full_name: fullName,
                phone,
                location,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
            if (error) throw error;
            
            // SUCESSO! Reseta a pilha de navegação para a tela principal.
            // O usuário não poderá "voltar" para esta tela de onboarding.
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });

        } catch (error: any) {
            Alert.alert("Erro ao salvar perfil", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    
                    <LocationSelectorModal
                        visible={isLocationModalVisible}
                        onClose={() => setLocationModalVisible(false)}
                        onLocationSelect={setLocation}
                    />

                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Continue seu cadastro</Text>
                        <Text style={styles.subtitle}>Falta pouco! Complete seu perfil para começar a usar a plataforma.</Text>
                    </View>

                    <TouchableOpacity style={styles.avatarPicker} onPress={() => Alert.alert("Adicionar Foto", "Escolha uma opção", [{ text: "Tirar Foto", onPress: () => pickImage(true) }, { text: "Escolher da Galeria", onPress: () => pickImage(false) }, { text: "Cancelar", style: "cancel" }])}>
                        {avatarUrl ? (
                            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Ionicons name="camera" size={40} color="#A0AEC0" />
                            </View>
                        )}
                        <Text style={styles.avatarEditText}>Adicionar foto de perfil</Text>
                    </TouchableOpacity>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Nome Completo*</Text>
                        <TextInput style={styles.input} placeholder="Digite seu nome e sobrenome" value={fullName} onChangeText={setFullName} />

                        <Text style={styles.label}>Telefone (WhatsApp)*</Text>
                        <MaskInput
                            style={styles.input}
                            value={phone}
                            onChangeText={(masked, unmasked) => setPhone(unmasked)}
                            mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                            placeholder="(XX) XXXXX-XXXX"
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Sua Localização*</Text>
                        <TouchableOpacity style={styles.locationButton} onPress={() => setLocationModalVisible(true)}>
                            <Text style={location ? styles.locationText : styles.locationPlaceholder}>
                                {location || 'Selecione sua cidade'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleCompleteProfile} disabled={loading}>
                        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Finalizar Cadastro</Text>}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default CompleteProfileScreen;