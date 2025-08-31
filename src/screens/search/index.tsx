import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, Image, Alert, ActivityIndicator, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../../services/supabase';
import { styles } from './style';
import { Ionicons } from '@expo/vector-icons';
import { AppStackParamList } from '../../navigation/AppNavigator';

// Tipos para os dados
type Service = {
    id: number;
    title: string;
    price: number;
    photo_urls: string[];
    profiles: { full_name: string }[] | null;
};
type Category = {
    id: number;
    name: string;
};

const PAGE_SIZE = 10;

const SearchScreen = () => {
    // Tipagem para a navegação
    type SearchScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'MainTabs'>;
    const navigation = useNavigation<SearchScreenNavigationProp>();

    // Estados do componente
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    
    // Estados para os filtros
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [tempSelectedCategories, setTempSelectedCategories] = useState<number[]>([]);

    // Função para buscar os serviços, com a lógica de paginação corrigida
    const fetchServices = async (isNewSearch = false, pageToFetch: number) => {
        if (isNewSearch) {
            setServices([]);
            setHasMore(true);
        }

        try {
            const from = pageToFetch * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            let query = supabase
                .from('services')
                .select(`id, title, price, photo_urls, profiles ( full_name )`, { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(from, to);

            if (searchText) query = query.ilike('title', `%${searchText}%`);
            if (selectedCategories.length > 0) query = query.in('category_id', selectedCategories);

            const { data, error, count } = await query;

            if (error) throw error;

            if (data) {
                setServices(prev => isNewSearch ? data : [...prev, ...data]);
                if (data.length < PAGE_SIZE || (count && services.length + data.length >= count)) {
                    setHasMore(false);
                }
            }
        } catch (error: any) {
            Alert.alert("Erro ao buscar serviços", error.message);
        }
    };
    
    // Efeito para buscar na carga inicial ou quando os filtros de categoria mudam
    useEffect(() => {
        setLoading(true);
        fetchServices(true, 0).finally(() => setLoading(false));
    }, [selectedCategories]);

    // Função para carregar mais serviços ao clicar no botão "Ver mais"
    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            const nextPage = page + 1;
            setPage(nextPage);
            fetchServices(false, nextPage).finally(() => setLoadingMore(false));
        }
    };

    // Abre o modal de filtros
    const openFilterModal = async () => {
        if (availableCategories.length === 0) {
            const { data } = await supabase.from('categories').select('id, name');
            setAvailableCategories(data || []);
        }
        setTempSelectedCategories(selectedCategories);
        setModalVisible(true);
    };

    // Aplica os filtros selecionados e fecha o modal
    const applyFilters = () => {
        setPage(0); // Reseta a página para iniciar uma nova busca com os filtros
        setSelectedCategories(tempSelectedCategories);
        setModalVisible(false);
    };

    // Componente para renderizar cada cartão de serviço
    const renderServiceCard = ({ item }: { item: Service }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}>
            <View style={styles.card}>
                <Image
                    source={{ uri: item.photo_urls?.[0] || 'https://via.placeholder.com/150' }}
                    style={styles.cardImage}
                />
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardProvider}>Oferecido por: {item.profiles?.[0]?.full_name || 'Usuário'}</Text>
                {item.price != null && <Text style={styles.cardPrice}>R$ {item.price.toFixed(2)}</Text>}
            </View>
        </TouchableOpacity>
    );

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#3F83F8" />;

    return (
        <SafeAreaView style={styles.container}>
            {/* Modal de Filtro de Categorias */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filtrar categorias</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close-circle" size={30} color="#CCC" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={availableCategories}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => {
                                const isSelected = tempSelectedCategories.includes(item.id);
                                return (
                                    <TouchableOpacity 
                                        style={styles.categoryItem}
                                        onPress={() => {
                                            if (isSelected) {
                                                setTempSelectedCategories(prev => prev.filter(id => id !== item.id));
                                            } else {
                                                setTempSelectedCategories(prev => [...prev, item.id]);
                                            }
                                        }}
                                    >
                                        <Ionicons name={isSelected ? "checkbox" : "square-outline"} size={24} color={isSelected ? "#3F83F8" : "#CCC"} />
                                        <Text style={styles.categoryText}>{item.name}</Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={[styles.modalButton, styles.closeButton]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Fechar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={applyFilters}>
                                <Text style={[styles.modalButtonText, { color: '#FFF' }]}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Lista Principal de Serviços */}
            <FlatList
                data={services}
                renderItem={renderServiceCard}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <View style={styles.searchContainer}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="search" size={20} color="#999" />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Buscar por título do serviço..."
                                value={searchText}
                                onChangeText={setSearchText}
                                onSubmitEditing={() => { setLoading(true); fetchServices(true, 0).finally(() => setLoading(false)); }}
                                returnKeyType="search"
                            />
                        </View>
                        <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
                            <Text style={styles.filterButtonText}>Filtrar categorias ▼</Text>
                        </TouchableOpacity>
                    </View>
                }
                contentContainerStyle={styles.listContainer}
                ListFooterComponent={
                    loadingMore ? <ActivityIndicator style={{ marginTop: 10 }} size="large" color="#3F83F8" /> : (
                        hasMore ? (
                            <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
                                <Text style={styles.loadMoreText}>Ver mais</Text>
                            </TouchableOpacity>
                        ) : null
                    )
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum serviço encontrado para estes filtros.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default SearchScreen;