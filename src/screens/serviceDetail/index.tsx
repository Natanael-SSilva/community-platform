import React, { useState, useCallback } from 'react';
import { View, Text, SafeAreaView, Image, Alert, ActivityIndicator, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../../services/supabase';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { styles } from './style';
import ReviewModal from '../../components/ReviewModal';
import { Ionicons } from '@expo/vector-icons';

// Tipos para os dados
type Review = { id: number; rating: number; comment: string; profiles: { full_name: string; avatar_url: string; } | null; };
type ServiceDetails = { id: number; title: string; description: string; price: number; photo_urls: string[]; availability: string; profiles: { id: string; full_name: string; avatar_url: string; } | null; categories: { name: string; } | null; reviews: Review[]; };
type ServiceDetailRouteProp = RouteProp<AppStackParamList, 'ServiceDetail'>;

const ServiceDetailScreen = () => {
    const route = useRoute<ServiceDetailRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
    const { serviceId } = route.params;

    const [service, setService] = useState<ServiceDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isReviewModalVisible, setReviewModalVisible] = useState(false);

    const fetchServiceDetails = async () => {
        if (!serviceId) return;
        try {
            setLoading(true);
            const { data, error } = await supabase.from('services').select(`*, profiles ( id, full_name, avatar_url ), categories ( name ), reviews ( id, rating, comment, profiles ( full_name, avatar_url ) )`).eq('id', serviceId).single();
            if (error) throw error;
            setService(data as any);
        } catch (error: any) {
            Alert.alert("Erro", "Não foi possível carregar os detalhes do serviço.");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => { fetchServiceDetails(); }, [serviceId]));
    
    const handleSubmitReview = async (rating: number, comment: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Você precisa estar logado para avaliar.");
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

    if (loading) return <ActivityIndicator style={styles.loadingContainer} size="large" color="#3F83F8" />;
    if (!service) return <View style={styles.loadingContainer}><Text>Serviço não encontrado.</Text></View>;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ReviewModal visible={isReviewModalVisible} onClose={() => setReviewModalVisible(false)} onSubmit={handleSubmitReview} />
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContentContainer}>
                <View>
                    <FlatList data={service.photo_urls} renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />} keyExtractor={(item, index) => index.toString()} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={(e) => { const index = Math.round(e.nativeEvent.contentOffset.x / styles.image.width); setCurrentImageIndex(index); }} />
                    {service.photo_urls && service.photo_urls.length > 1 && (<Text style={styles.imageCounter}>{currentImageIndex + 1} / {service.photo_urls.length}</Text>)}
                </View>
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
                <View style={styles.contentContainer}>
                    <Text style={styles.sectionTitle}>Avaliações</Text>
                    <TouchableOpacity style={styles.addReviewButton} onPress={() => setReviewModalVisible(true)}>
                        <Text style={{color: '#FFF', fontWeight: 'bold', fontSize: 16}}>Deixar uma avaliação</Text>
                    </TouchableOpacity>
                    <View style={styles.reviewsContainer}>
                        {service.reviews && service.reviews.length > 0 ? (
                            service.reviews.map((review) => (
                                <View key={review.id} style={styles.reviewItem}>
                                    <View style={styles.reviewHeader}>
                                        <Image source={{ uri: review.profiles?.avatar_url || 'https://via.placeholder.com/40' }} style={styles.reviewAvatar} />
                                        <Text style={styles.reviewAuthor}>{review.profiles?.full_name}</Text>
                                        <View style={styles.reviewStars}>
                                            {[1,2,3,4,5].map(star => <Ionicons key={star} name="star" size={16} color={star <= review.rating ? "#FFC107" : "#CCC"} />)}
                                        </View>
                                    </View>
                                    <Text style={styles.reviewComment}>{review.comment}</Text>
                                </View>
                            ))
                        ) : (<Text style={{textAlign: 'center', marginTop: 15, color: '#666'}}>Este serviço ainda não tem avaliações. Seja o primeiro!</Text>)}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <View>
                    <Text style={styles.priceLabel}>Preço médio estimado</Text>
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