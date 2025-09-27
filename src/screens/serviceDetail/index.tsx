import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  useRoute,
  RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../../services/supabase';
import type { AppStackParamList } from '../../navigation/types';
import { styles } from './style';
import ReviewModal from '../../components/ReviewModal';
import { Ionicons } from '@expo/vector-icons';

// --- Tipos ---
//  Definindo o tipo do perfil localmente para evitar erro de importação
type ProviderProfile = {
  id: string;
  full_name: string;
  avatar_url: string;
};
type ReviewData = {
  id: number;
  rating: number;
  comment: string | null;
  profiles: { full_name: string; avatar_url: string } | null;
};
type ServiceDetails = {
  id: number;
  title: string;
  description: string | null;
  price: number | null;
  photo_urls: string[] | null;
  availability: string | null;
  profiles: ProviderProfile | null;
  categories: { name: string } | null;
  reviews: ReviewData[];
};
type ServiceDetailRouteProp = RouteProp<AppStackParamList, 'ServiceDetail'>;
type ServiceDetailNavigationProp = NativeStackNavigationProp<AppStackParamList>;

// --- Custom Hook ---
const useServiceDetails = (serviceId: number) => {
  const navigation = useNavigation<ServiceDetailNavigationProp>();
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchServiceDetails = useCallback(async () => {
    if (!serviceId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select(
          `*, profiles(*), categories(name), reviews(id, rating, comment, profiles(full_name, avatar_url))`,
        )
        .eq('id', serviceId)
        .single();

      if (error) throw error;
      setService(data as ServiceDetails);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar os detalhes.';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useFocusEffect(
    useCallback(() => {
      fetchServiceDetails();
    }, [fetchServiceDetails]),
  );

  const handleSubmitReview = async (rating: number, comment: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Você precisa estar logado para avaliar.');
      if (user.id === service?.profiles?.id) {
        Alert.alert(
          'Ação inválida',
          'Você não pode avaliar o seu próprio serviço.',
        );
        return;
      }

      const { error } = await supabase
        .from('reviews')
        .insert({ service_id: serviceId, user_id: user.id, rating, comment });
      if (error) throw error;

      Alert.alert('Sucesso', 'Sua avaliação foi enviada!');
      fetchServiceDetails();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro desconhecido.';
      Alert.alert('Erro ao avaliar', message);
    }
  };

  const handleStartConversation = async () => {
    if (!service?.profiles?.id) return;
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user)
        throw new Error('Você precisa estar logado para iniciar uma conversa.');
      if (user.id === service.profiles.id) {
        Alert.alert(
          'Ação inválida',
          'Você não pode iniciar uma conversa consigo mesmo.',
        );
        return;
      }

      const { data: conversationId, error } = await supabase.rpc(
        'get_or_create_conversation',
        {
          participant1_id_input: user.id,
          participant2_id_input: service.profiles.id,
        },
      );
      if (error) throw error;

      if (conversationId && service.profiles) {
        // Checagem de segurança
        navigation.navigate('Chat', {
          conversationId,
          recipient: service.profiles,
        });
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro desconhecido.';
      Alert.alert('Erro ao iniciar conversa', message);
    }
  };
  return { service, loading, handleSubmitReview, handleStartConversation };
};

// --- Subcomponentes  ---
const ReviewItem: React.FC<{ review: ReviewData }> = ({ review }) => (
  <View style={styles.reviewItem}>
    <View style={styles.reviewHeader}>
      <Image
        source={{ uri: review.profiles?.avatar_url }}
        style={styles.reviewAvatar}
      />
      <Text style={styles.reviewAuthor}>
        {review.profiles?.full_name || 'Usuário Anônimo'}
      </Text>
      <View style={styles.reviewStars}>
        {[...Array(5)].map((_, i) => (
          <Ionicons
            key={i}
            name="star"
            size={16}
            color={i < review.rating ? '#FFC107' : '#CCC'}
          />
        ))}
      </View>
    </View>
    {review.comment && (
      <Text style={styles.reviewComment}>{review.comment}</Text>
    )}
  </View>
);

// --- Componente Principal ---
const ServiceDetailScreen: React.FC = () => {
  const route = useRoute<ServiceDetailRouteProp>();
  const { serviceId } = route.params;
  const { service, loading, handleSubmitReview, handleStartConversation } =
    useServiceDetails(serviceId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);

  const imageWidth = Dimensions.get('window').width;

  if (loading) {
    return (
      <ActivityIndicator
        style={styles.loadingContainer}
        size="large"
        color="#3F83F8"
      />
    );
  }
  if (!service) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Serviço não encontrado.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ReviewModal
        visible={isReviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        // CORREÇÃO 2: Adicionando 'async' para corresponder à prop onSubmit, que espera uma Promise
        onSubmit={async (rating, comment) => {
          await handleSubmitReview(rating, comment); // Adicionado await para garantir a ordem
          setReviewModalVisible(false);
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Carrossel de Imagens */}
        {service.photo_urls && service.photo_urls.length > 0 && (
          <FlatList
            data={service.photo_urls}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={[styles.image, { width: imageWidth }]}
              />
            )}
            keyExtractor={item => item}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={e => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / imageWidth,
              );
              setCurrentImageIndex(index);
            }}
          />
        )}
        {service.photo_urls && service.photo_urls.length > 1 && (
          <Text style={styles.imageCounter}>
            {currentImageIndex + 1} / {service.photo_urls.length}
          </Text>
        )}

        {/* Informações Principais */}
        <View style={styles.contentContainer}>
          <Text style={styles.categoryTag}>
            {service.categories?.name || 'Sem Categoria'}
          </Text>
          <Text style={styles.title}>{service.title}</Text>
          <TouchableOpacity style={styles.providerContainer}>
            <Image
              source={{ uri: service.profiles?.avatar_url }}
              style={styles.providerAvatar}
            />
            <View>
              <Text>Oferecido por</Text>
              <Text style={styles.providerName}>
                {service.profiles?.full_name || 'Usuário Anônimo'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Detalhes e Avaliações */}
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Detalhes do serviço</Text>
          <Text style={styles.description}>
            {service.description || 'Nenhuma descrição fornecida.'}
          </Text>

          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Avaliações</Text>
            <TouchableOpacity
              style={styles.addReviewButton}
              onPress={() => setReviewModalVisible(true)}
            >
              <Text style={styles.addReviewButtonText}>Avaliar</Text>
            </TouchableOpacity>
          </View>
          {service.reviews && service.reviews.length > 0 ? (
            service.reviews.map(review => (
              <ReviewItem key={review.id} review={review} />
            ))
          ) : (
            <Text style={styles.noReviewsText}>
              Seja o primeiro a avaliar este serviço!
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Rodapé com Preço e Ação */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>A partir de</Text>
          <Text style={styles.priceValue}>
            R$ {service.price?.toFixed(2).replace('.', ',') || 'A combinar'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleStartConversation}
        >
          <Text style={styles.actionButtonText}>Pedir Orçamento</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ServiceDetailScreen;
