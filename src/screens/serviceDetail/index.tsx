import React, { useState, useCallback } from 'react';
import { View, Text, SafeAreaView, Image, Alert, ActivityIndicator, FlatList, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRoute, RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../../services/supabase';
import { AppStackParamList } from '../../navigation/types';
import { styles } from './style';
import ReviewModal from '../../components/ReviewModal';
import { Ionicons } from '@expo/vector-icons';

// Tipos para os dados, mantendo o código limpo e seguro
type ReviewData = {
    id: number;
    rating: number;
    comment: string | null;
    profiles: { full_name: string; avatar_url: string; } | null;
};
type ServiceDetails = {
    id: number;
    title: string;
    description: string | null;
    price: number | null;
    photo_urls: string[] | null;
    availability: string | null;
    profiles: { id: string; full_name: string; avatar_url: string; } | null;
    categories: { name: string; } | null;
    reviews: ReviewData[];
};
type ServiceDetailRouteProp = RouteProp<AppStackParamList, 'ServiceDetail'>;

/**
 * @description
 * Subcomponente para renderizar um único item de avaliação.
 * Segue o princípio de "Single Responsibility", mantendo o código principal mais limpo.
 * @param {ReviewData} review - Os dados da avaliação a serem exibidos.
 * @returns {React.FC} Um componente de item de avaliação.
 */
const ReviewItem: React.FC<{ review: ReviewData }> = ({ review }) => (
    <View style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
            <Image source={{ uri: review.profiles?.avatar_url || 'https://via.placeholder.com/40' }} style={styles.reviewAvatar} />
            <Text style={styles.reviewAuthor}>{review.profiles?.full_name || 'Usuário'}</Text>
            <View style={styles.reviewStars}>
                {[1, 2, 3, 4, 5].map(star => <Ionicons key={star} name="star" size={16} color={star <= review.rating ? "#FFC107" : "#CCC"} />)}
            </View>
        </View>
        {review.comment && <Text style={styles.reviewComment}>{review.comment}</Text>}
    </View>
);

/**
 * @description
 * Tela que exibe os detalhes completos de um serviço, incluindo informações do prestador e avaliações.
 * Permite ao usuário iniciar uma conversa ou deixar uma nova avaliação.
 */
const ServiceDetailScreen: React.FC = () => {
    const route = useRoute<ServiceDetailRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
    const { serviceId } = route.params;

    const [service, setService] = useState<ServiceDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isReviewModalVisible, setReviewModalVisible] = useState(false);

    /**
     * @description
     * Busca os detalhes completos do serviço no backend.
     * Envolvida em useCallback para ser otimizada e reutilizada.
     */
    const fetchServiceDetails = useCallback(async () => {
        if (!serviceId) return;
        try {
            setLoading(true);
            const { data, error } = await supabase.from('services').select(`*, profiles(id, full_name, avatar_url), categories(name), reviews(id, rating, comment, profiles(full_name, avatar_url))`).eq('id', serviceId).single();
            if (error) throw error;
            setService(data as any);
        } catch (error: any) {
            Alert.alert("Erro", "Não foi possível carregar os detalhes do serviço.");
        } finally {
            setLoading(false);
        }
    }, [serviceId]);

    // CORREÇÃO: A chamada da função async é feita dentro do useCallback,
    // garantindo que a função passada para useFocusEffect não retorna uma Promise.
    useFocusEffect(
      useCallback(() => {
        fetchServiceDetails();
      }, [fetchServiceDetails])
    );
    
    const handleSubmitReview = async (rating: number, comment: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Você precisa estar logado para avaliar.");
            if (user.id === service?.profiles?.id) {
                Alert.alert("Ação inválida", "Você não pode avaliar o seu próprio serviço.");
                return;
            }
            const { error } = await supabase.from('reviews').insert({ service_id: serviceId, user_id: user.id, rating, comment });
            if (error) throw error;
            Alert.alert("Sucesso", "Sua avaliação foi enviada!");
            fetchServiceDetails();
        } catch (error: any) {
            Alert.alert("Erro ao avaliar", error.message);
        }
    };

    const handleStartConversation = async () => {
        if (!service?.profiles?.id) return;
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Usuário não logado");
            if (user.id === service.profiles.id) {
                Alert.alert("Ação inválida", "Você não pode iniciar uma conversa consigo mesmo.");
                return;
            }
            const { data: conversationId, error } = await supabase.rpc('get_or_create_conversation', {
                participant1_id_input: user.id,
                participant2_id_input: service.profiles.id
            });
            if (error) throw error;
            if (conversationId) {
                navigation.navigate('Chat', {
                    conversationId: conversationId,
                    recipient: service.profiles as any
                });
            }
        } catch (error: any) {
            Alert.alert("Erro ao iniciar conversa", error.message);
        }
    };

    if (loading) {
        return <ActivityIndicator style={styles.loadingContainer} size="large" color="#3F83F8" />;
    }
    if (!service) {
        return <View style={styles.loadingContainer}><Text>Serviço não encontrado.</Text></View>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <ReviewModal visible={isReviewModalVisible} onClose={() => setReviewModalVisible(false)} onSubmit={handleSubmitReview} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.sectionTitle}>Detalhes do serviço</Text>
                    <Text style={styles.description}>{service.description || 'Nenhuma descrição fornecida.'}</Text>
                    <Text style={styles.sectionTitle}>Avaliações</Text>
                    <TouchableOpacity style={styles.addReviewButton} onPress={() => setReviewModalVisible(true)}>
                        <Text style={styles.addReviewButtonText}>Deixar uma avaliação</Text>
                    </TouchableOpacity>
                    {service.reviews && service.reviews.length > 0 ? (
                        service.reviews.map((review) => <ReviewItem key={review.id} review={review} />)
                    ) : (
                        <Text style={{textAlign: 'center', marginTop: 20, color: '#666'}}>Seja o primeiro a avaliar este serviço!</Text>
                    )}
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <View>
                    <Text style={styles.priceLabel}>A partir de</Text>
                    <Text style={styles.priceValue}>R$ {service.price?.toFixed(2) || 'A combinar'}</Text>
                </View>
                <TouchableOpacity style={styles.actionButton} onPress={handleStartConversation}>
                    <Text style={styles.actionButtonText}>Pedir Orçamento</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ServiceDetailScreen;