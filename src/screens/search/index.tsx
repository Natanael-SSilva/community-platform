import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, Alert, ActivityIndicator, TextInput, TouchableOpacity, Modal, Keyboard, StatusBar } from 'react-native';
import { supabase } from '../../services/supabase';
import { styles } from './style';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ServiceCard, { ServiceCardData } from '../../components/ServiceCard';
import useDebounce from '../../hooks/useDebounce';

type Category = { id: number; name: string; };

/**
 * @description
 * Tela de busca de serviços. Carrega os serviços mais recentes por padrão e permite
 * uma busca dinâmica e filtrada pelo usuário, com uma interface limpa e reativa.
 */
const SearchScreen: React.FC = () => {
    // Estados para dados e controle da UI
    const [services, setServices] = useState<ServiceCardData[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para os filtros
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce para a busca em tempo real
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    
    // Estados para o modal de filtro
    const [isModalVisible, setModalVisible] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [tempSelectedCategories, setTempSelectedCategories] = useState<number[]>([]);

    /**
     * @description
     * Função central para buscar os serviços no backend.
     * Ela é "memoizada" com useCallback e é recriada sempre que os filtros mudam,
     * garantindo que a busca seja sempre executada com os parâmetros mais recentes.
     */
    const fetchServices = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.rpc('get_services_with_ratings', {
                search_term: debouncedSearchTerm.trim() === '' ? null : debouncedSearchTerm,
                category_ids_filter: selectedCategories.length === 0 ? null : selectedCategories
            });

            if (error) throw error;
            setServices(data || []);
        } catch (error: any) {
            Alert.alert("Erro ao buscar serviços", error.message);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm, selectedCategories]); // A função depende destes filtros

    // Dispara a busca sempre que os filtros "debounceados" ou de categoria mudam.
    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const openFilterModal = async () => {
        if (availableCategories.length === 0) {
            const { data } = await supabase.from('categories').select('id, name');
            setAvailableCategories(data || []);
        }
        setTempSelectedCategories(selectedCategories);
        setModalVisible(true);
    };

    const applyFilters = () => {
        setSelectedCategories(tempSelectedCategories);
        setModalVisible(false);
    };

    return (
        <SafeAreaProvider style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            
            <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filtrar categorias</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close-circle" size={30} color="#CCC" /></TouchableOpacity>
                        </View>
                        <FlatList
                            data={availableCategories}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => {
                                const isSelected = tempSelectedCategories.includes(item.id);
                                return (
                                    <TouchableOpacity style={styles.categoryItem} onPress={() => {
                                        if (isSelected) { setTempSelectedCategories(prev => prev.filter(id => id !== item.id)); } 
                                        else { setTempSelectedCategories(prev => [...prev, item.id]); }
                                    }}>
                                        <Ionicons name={isSelected ? "checkbox" : "square-outline"} size={24} color={isSelected ? "#3F83F8" : "#CCC"} />
                                        <Text style={styles.categoryText}>{item.name}</Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={[styles.modalButton, styles.closeButton]} onPress={() => setModalVisible(false)}><Text style={styles.modalButtonText}>Fechar</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={applyFilters}><Text style={[styles.modalButtonText, { color: '#FFF' }]}>Salvar</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            
            <View style={styles.header}>
                <View style={styles.inputContainer}>
                    <Ionicons name="search" size={20} color="#999" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar por serviço ou especialidade..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        returnKeyType="search"
                    />
                </View>
                <View style={styles.filtersContainer}>
                    <TouchableOpacity style={styles.filterChip} onPress={openFilterModal}>
                        <Ionicons name="options-outline" size={16} color="#3F83F8" />
                        <Text style={styles.filterChipText}>
                            {selectedCategories.length > 0 ? `${selectedCategories.length} Categoria(s)` : 'Filtrar'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator style={{ flex: 1 }} size="large" color="#3F83F8" />
            ) : (
                <FlatList
                    data={services}
                    renderItem={({ item }) => <ServiceCard service={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContentContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search-circle-outline" size={60} color="#CBD5E0" style={styles.emptyIcon} />
                            <Text style={styles.emptyTitle}>Nenhum serviço encontrado</Text>
                            <Text style={styles.emptySubtitle}>Tente ajustar sua busca ou filtros para encontrar o que procura.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaProvider>
    );
};

export default SearchScreen;