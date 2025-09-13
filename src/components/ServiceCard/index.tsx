import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AppStackParamList } from '../../navigation/types'; // Importação corrigida
import { styles } from './style';

/**
 * @description
 * Define a estrutura de dados esperada para um card de serviço.
 * Exportar este tipo permite que outras partes do aplicativo (como a tela de busca)
 * saibam exatamente quais dados este componente precisa.
 */
export type ServiceCardData = {
    id: number;
    title: string;
    price: number | null;
    photo_urls: string[] | null;
    full_name: string | null;
    avg_rating: number | null;
    review_count: number | null;
};

type Props = {
    service: ServiceCardData;
};

// O tipo de navegação agora usa a definição centralizada
type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'MainTabs'>;

/**
 * @description
 * Componente reutilizável para exibir um resumo de um serviço em um card.
 * É responsável pela apresentação visual e pela navegação para a tela de detalhes,
 * seguindo o princípio de "Single Responsibility".
 * @param {Props} props - As propriedades do componente, contendo os dados do serviço.
 * @returns {React.FC} Um card de serviço clicável.
 */
const ServiceCard: React.FC<Props> = ({ service }) => {
    const navigation = useNavigation<NavigationProp>();

    /**
     * @description Renderiza as estrelas de avaliação com base em uma nota.
     * @param {number | null} rating - A nota média do serviço.
     * @returns {JSX.Element[]} Um array de componentes de ícone de estrela.
     */
    const renderStars = (rating: number | null) => {
        const totalStars = 5;
        const starRating = rating ? Math.round(rating * 2) / 2 : 0; // Arredonda para 0.5
        const starElements = [];
        for (let i = 1; i <= totalStars; i++) {
            let iconName: keyof typeof Ionicons.glyphMap = 'star-outline';
            if (i <= starRating) {
                iconName = 'star';
            } else if (i - 0.5 === starRating) {
                iconName = 'star-half-sharp';
            }
            starElements.push(<Ionicons key={i} name={iconName} size={16} color="#FFC107" />);
        }
        return starElements;
    };

    return (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ServiceDetail', { serviceId: service.id })}
        >
            <Image
                source={{ uri: service.photo_urls?.[0] || 'https://via.placeholder.com/300' }}
                style={styles.image}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>{service.title}</Text>
                <Text style={styles.providerName}>por {service.full_name || 'Prestador'}</Text>
                <View style={styles.ratingContainer}>
                    {renderStars(service.avg_rating)}
                    <Text style={styles.ratingText}>
                        {service.avg_rating ? service.avg_rating.toFixed(1) : 'Novo'} ({service.review_count || 0})
                    </Text>
                </View>
                {service.price != null && <Text style={styles.price}>R$ {service.price.toFixed(2)}</Text>}
            </View>
        </TouchableOpacity>
    );
};

export default ServiceCard;