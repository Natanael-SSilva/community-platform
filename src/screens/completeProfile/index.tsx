import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
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
// CORREÇÃO: Importação do tipo do arquivo central 'types'
import type { AppStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'CompleteProfile'
>;

/**
 * Tela de "Completar Cadastro" (Onboarding).
 * Coleta informações essenciais do perfil do usuário, como nome, telefone,
 * localização e foto, após a confirmação do e-mail inicial.
 */
const CompleteProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // --- Estados do Componente ---
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLocationModalVisible, setLocationModalVisible] = useState(false);

  // --- Funções ---

  /**
   * Lida com a seleção de uma imagem de avatar, seja da câmera ou da galeria.
   * @param source Define a origem da imagem ('camera' ou 'gallery').
   */
  const handleAvatarSelection = async (source: 'camera' | 'gallery') => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    };

    let result;
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Precisamos de acesso à câmera para tirar uma foto.',
        );
        return;
      }
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Precisamos de acesso à galeria para escolher uma foto.',
        );
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled && result.assets && result.assets[0].base64) {
      uploadAvatar(result.assets[0].base64);
    }
  };

  /**
   * Faz o upload da imagem do avatar para o Supabase Storage e atualiza o perfil.
   * @param base64 A imagem codificada em base64.
   */
  const uploadAvatar = async (base64: string) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não encontrado');

      const filePath = `${user.id}/${new Date().getTime()}.png`;
      const imageBuffer = decode(base64);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, imageBuffer, { contentType: 'image/png' });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      const publicUrl = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`; // Cache busting
      setAvatarUrl(publicUrl);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro desconhecido.';
      Alert.alert('Erro no upload', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Valida e salva as informações do perfil no banco de dados.
   * Em caso de sucesso, reseta a navegação para a tela principal do app.
   */
  const handleCompleteProfile = async () => {
    if (!fullName.trim() || !phone || !location) {
      Alert.alert(
        'Campos obrigatórios',
        'Por favor, preencha todas as informações para continuar.',
      );
      return;
    }

    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado.');

      const updates = {
        id: user.id,
        full_name: fullName.trim(),
        phone,
        location,
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      if (error) throw error;

      // Navega para a tela principal, impedindo o usuário de voltar para o onboarding
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro desconhecido.';
      Alert.alert('Erro ao salvar perfil', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert('Adicionar Foto', 'Escolha uma opção', [
      { text: 'Tirar Foto', onPress: () => handleAvatarSelection('camera') },
      {
        text: 'Escolher da Galeria',
        onPress: () => handleAvatarSelection('gallery'),
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  // --- Renderização ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <LocationSelectorModal
            visible={isLocationModalVisible}
            onClose={() => setLocationModalVisible(false)}
            onLocationSelect={setLocation}
          />

          <View style={styles.headerContainer}>
            <Text style={styles.title}>Continue seu cadastro</Text>
            <Text style={styles.subtitle}>
              Falta pouco! Complete seu perfil para começar a usar a plataforma.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.avatarPicker}
            onPress={showImagePickerOptions}
          >
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
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome e sobrenome"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.label}>Telefone (WhatsApp)*</Text>
            <MaskInput
              style={styles.input}
              value={phone}
              onChangeText={(masked, unmasked) => setPhone(unmasked)}
              mask={[
                '(',
                /\d/,
                /\d/,
                ')',
                ' ',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
              placeholder="(XX) XXXXX-XXXX"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Sua Localização*</Text>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => setLocationModalVisible(true)}
            >
              <Text
                style={
                  location ? styles.locationText : styles.locationPlaceholder
                }
              >
                {location || 'Selecione sua cidade'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleCompleteProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Finalizar Cadastro</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CompleteProfileScreen;
