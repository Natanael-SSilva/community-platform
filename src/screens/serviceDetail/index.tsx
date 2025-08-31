import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, Alert, ActivityIndicator, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { supabase } from '../../services/supabase';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { styles } from './style';

// Tipos (sem alteração)
type ServiceDetails = {
    id: number;
    title: string;
    description: string;
    price: number;
    photo_urls: string[];
    availability: string;
    profiles: {
        full_name: string;
        avatar_url: string;
    } | null;
    categories: {
        name: string;
    } | null;
};
type ServiceDetailRouteProp = RouteProp<AppStackParamList, 'ServiceDetail'>;

const ServiceDetailScreen = () => {
    const route = useRoute<ServiceDetailRouteProp>();
    const { serviceId } = route.params;

    const [service, setService] = useState<ServiceDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        // Lógica de busca de dados (sem alteração)
        const fetchServiceDetails = async () => {
            if (!serviceId) return;
            const { data, error } = await supabase
                .from('services')
                .select(`*, profiles ( full_name, avatar_url ), categories ( name )`)
                .eq('id', serviceId)
                .single();
            if (error) {
                Alert.alert("Erro", "Não foi possível carregar os detalhes do serviço.");
            } else {
                setService(data as any);
            }
            setLoading(false);
        };
        fetchServiceDetails();
    }, [serviceId]);

    if (loading) {
        return <ActivityIndicator style={styles.loadingContainer} size="large" color="#3F83F8" />;
    }

    if (!service) {
        return <View style={styles.loadingContainer}><Text>Serviço não encontrado.</Text></View>;
    }

    // MUDANÇA PRINCIPAL: A ESTRUTURA DO JSX FOI REORGANIZADA
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Carrossel de Imagens */}
                <View>
                    <FlatList
                        data={service.photo_urls}
                        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / styles.image.width);
                            setCurrentImageIndex(index);
                        }}
                    />
                    {service.photo_urls && service.photo_urls.length > 1 && (
                        <Text style={styles.imageCounter}>{currentImageIndex + 1} / {service.photo_urls.length}</Text>
                    )}
                </View>

                {/* Conteúdo */}
                <View style={styles.contentContainer}>
                    <Text style={styles.categoryTag}>{service.categories?.name || 'Categoria'}</Text>
                    <Text style={styles.title}>{service.title}</Text>
                    <TouchableOpacity style={styles.providerContainer}>
                        <Image source={{ uri: service.profiles?.avatar_url || 'https://via.placeholder.com/50' }} style={styles.providerAvatar} />
                        <View>
                            <Text>Oferecido por</Text>
                            <Text style={styles.providerName}>{service.profiles?.full_name || 'Usuário'}</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.sectionTitle}>Detalhes do serviço</Text>
                    <Text style={styles.description}>{service.description || 'Nenhuma descrição fornecida.'}</Text>
                </View>

                {/* Rodapé com Preço e Botão AGORA DENTRO DO SCROLLVIEW */}
                <View style={styles.footer}>
                    <View>
                        <Text style={styles.priceLabel}>Preço médio estimado</Text>
                        <Text style={styles.priceValue}>R$ {service.price?.toFixed(2) || 'A combinar'}</Text>
                    </View>
                    <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert("Contato", "Funcionalidade de contato em desenvolvimento.")}>
                        <Text style={styles.actionButtonText}>Pedir Orçamento</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ServiceDetailScreen;