import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import { supabase } from '../../services/supabase';
import { styles } from './style';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { decode } from 'base64-arraybuffer';

type Category = {
    id: number;
    name: string;
};

type SelectedImage = {
    uri: string;
    base64: string;
};

const AddServiceScreen = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [availability, setAvailability] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('id, name')
                .order('name', { ascending: true });

            if (error) {
                Alert.alert("Erro", "Não foi possível carregar as categorias.");
            } else if (data) {
                setCategories(data);
                if (data.length > 0 && selectedCategory === null) {
                    setSelectedCategory(data[0].id);
                }
            }
        };
        fetchCategories();
    }, []);

    const pickImage = async (fromCamera: boolean) => {
        if (selectedImages.length >= 4) {
            Alert.alert("Limite atingido", "Você só pode adicionar até 4 fotos.");
            return;
        }

        const options: ImagePicker.ImagePickerOptions = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
            base64: true,
        };

        let result;
        if (fromCamera) {
            await ImagePicker.requestCameraPermissionsAsync();
            result = await ImagePicker.launchCameraAsync(options);
        } else {
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            result = await ImagePicker.launchImageLibraryAsync(options);
        }

        if (!result.canceled && result.assets && result.assets[0].base64) {
            const asset = result.assets[0];
            setSelectedImages(prevImages => [...prevImages, { uri: asset.uri, base64: asset.base64! }]);
        }
    };
    
    const handleRemoveImage = (uriToRemove: string) => {
        setSelectedImages(prevImages => prevImages.filter(image => image.uri !== uriToRemove));
    };

    const handleSaveService = async () => {
        if (!title || !selectedCategory) {
            Alert.alert("Erro", "Título e Categoria são obrigatórios.");
            return;
        }
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Usuário não encontrado.");

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('location')
                .eq('id', user.id)
                .single();
            
            if (profileError) throw profileError;
            if (!profileData?.location) {
                Alert.alert("Localização não definida", "Por favor, defina sua localização no seu perfil antes de cadastrar um serviço.");
                setLoading(false);
                return;
            }

            const uploadedPhotoUrls: string[] = [];

            for (const image of selectedImages) {
                const fileExt = image.uri.split('.').pop() || 'png';
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;
                const imageArrayBuffer = decode(image.base64);

                const { error: uploadError } = await supabase.storage
                    .from('service_images')
                    .upload(filePath, imageArrayBuffer, { contentType: `image/${fileExt}` });

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage.from('service_images').getPublicUrl(filePath);
                if (publicUrlData) {
                    uploadedPhotoUrls.push(publicUrlData.publicUrl);
                }
            }

            const { error: insertError } = await supabase
                .from('services')
                .insert({
                    user_id: user.id,
                    title,
                    description,
                    category_id: selectedCategory,
                    price: price ? parseFloat(price) : null,
                    availability,
                    photo_urls: uploadedPhotoUrls,
                    location: profileData.location,
                });

            if (insertError) throw insertError;

            Alert.alert("Sucesso!", "Seu serviço foi cadastrado com sucesso!");
            
            setTitle(''); setDescription(''); setPrice(''); setAvailability('');
            setSelectedCategory(categories.length > 0 ? categories[0].id : null);
            setSelectedImages([]);
            
        } catch (error: any) {
            Alert.alert("Erro ao cadastrar serviço", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>Título do Serviço*</Text>
                <TextInput style={styles.input} placeholder="Ex: Conserto de vazamentos" value={title} onChangeText={setTitle} />

                <Text style={styles.label}>Descrição</Text>
                <TextInput style={[styles.input, styles.textArea]} placeholder="Descreva o que você oferece, seus diferenciais, etc." value={description} onChangeText={setDescription} multiline />

                <Text style={styles.label}>Categoria*</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedCategory}
                        onValueChange={(itemValue) => setSelectedCategory(itemValue as number)}
                    >
                        {categories.map((category) => (
                            <Picker.Item key={category.id} label={category.name} value={category.id} />
                        ))}
                    </Picker>
                </View>

                <Text style={styles.label}>Preço (R$)</Text>
                <TextInput style={styles.input} placeholder="Ex: 50.00 (ou deixe em branco)" value={price} onChangeText={setPrice} keyboardType="numeric" />

                <Text style={styles.label}>Disponibilidade</Text>
                <TextInput style={styles.input} placeholder="Ex: Seg a Sex, 9h às 18h" value={availability} onChangeText={setAvailability} />
                
                <View style={styles.imageUploadContainer}>
                    <Text style={styles.label}>Fotos do Serviço (até 4)</Text>
                    <View style={styles.imagePreviewContainer}>
                        {selectedImages.map((image, index) => (
                            <View key={index}>
                                <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                                <TouchableOpacity onPress={() => handleRemoveImage(image.uri)} style={styles.imageRemoveButton}>
                                    <Text style={styles.imageRemoveButtonText}>×</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        {selectedImages.length < 4 && (
                            <TouchableOpacity onPress={() => pickImage(false)} style={styles.addPhotoButton}>
                                <Ionicons name="camera" size={30} color="#666" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSaveService} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Salvar Serviço</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddServiceScreen;