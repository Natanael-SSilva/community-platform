import React, { useState, useCallback, useEffect } from 'react';
import { 
    View, Text, FlatList, Alert, ActivityIndicator, 
    TextInput, TouchableOpacity, Modal, StatusBar 
} from 'react-native';
import { supabase } from '../../services/supabase';
import { styles } from './style';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ServiceCard, { ServiceCardData } from '../../components/ServiceCard';
import useDebounce from '../../hooks/useDebounce';

// --- Tipos ---
type Category = { id: number; name: string; };

// --- Custom Hook para a Lógica de Busca ---
/**
 * Hook para gerenciar a busca, filtros e carregamento de serviços.
 */
const useServiceSearch = () => {
    const [services, setServices] = useState<ServiceCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchServices = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.rpc('get_services_with_ratings', {
                search_term: debouncedSearchTerm.trim() === '' ? null : debouncedSearchTerm,
                category_ids_filter: selectedCategories.length === 0 ? null : selectedCategories
            });

            if (error) throw error;
            setServices(data || []);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
            Alert.alert("Erro ao buscar serviços", message);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm, selectedCategories]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    return { services, loading, searchTerm, setSearchTerm, selectedCategories, setSelectedCategories };
};

// --- Subcomponente para o Modal de Filtro ---
type FilterModalProps = {
    visible: boolean;
    onClose: () => void;
    onApply: (selectedIds: number[]) => void;
    initialSelectedCategories: number[];
};

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply, initialSelectedCategories }) => {
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [tempSelected, setTempSelected] = useState<number[]>(initialSelectedCategories);

    useEffect(() => {
        // Busca categorias apenas uma vez quando o modal é preparado para abrir
        if (visible && availableCategories.length === 0) {
            supabase.from('categories').select('id, name').then(({ data }) => {
                setAvailableCategories(data || []);
            });
        }
        // Sincroniza o estado temporário com o estado real quando o modal abre
        setTempSelected(initialSelectedCategories);
    }, [visible, initialSelectedCategories, availableCategories.length]);

    const handleToggleCategory = (id: number) => {
        setTempSelected(prev => 
            prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
        );
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filtrar categorias</Text>
                        <TouchableOpacity onPress={onClose}><Ionicons name="close-circle" size={30} color="#CCC" /></TouchableOpacity>
                    </View>
                    <FlatList
                        data={availableCategories}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => {
                            const isSelected = tempSelected.includes(item.id);
                            return (
                                <TouchableOpacity style={styles.categoryItem} onPress={() => handleToggleCategory(item.id)}>
                                    <Ionicons name={isSelected ? "checkbox" : "square-outline"} size={24} color={isSelected ? "#3F83F8" : "#CCC"} />
                                    <Text style={styles.categoryText}>{item.name}</Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={[styles.modalButton, styles.closeButton]} onPress={onClose}><Text style={styles.modalButtonText}>Fechar</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={() => onApply(tempSelected)}><Text style={[styles.modalButtonText, { color: '#FFF' }]}>Salvar</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// --- Componente Principal ---
/**
 * Tela de busca de serviços. Permite busca por texto e filtro por categorias.
 */
const SearchScreen: React.FC = () => {
    const { services, loading, searchTerm, setSearchTerm, selectedCategories, setSelectedCategories } = useServiceSearch();
    const [isModalVisible, setModalVisible] = useState(false);

    const handleApplyFilters = (categories: number[]) => {
        setSelectedCategories(categories);
        setModalVisible(false);
    };

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="search-circle-outline" size={60} color="#CBD5E0" style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>Nenhum serviço encontrado</Text>
            <Text style={styles.emptySubtitle}>Tente ajustar sua busca ou filtros para encontrar o que procura.</Text>
        </View>
    );

    return (
        // O ideal é que o SafeAreaProvider envolva todo o app em App.tsx, não cada tela.
        <SafeAreaProvider> 
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" />
                
                <FilterModal
                    visible={isModalVisible}
                    onClose={() => setModalVisible(false)}
                    onApply={handleApplyFilters}
                    initialSelectedCategories={selectedCategories}
                />
                
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
                        <TouchableOpacity style={styles.filterChip} onPress={() => setModalVisible(true)}>
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
                        ListEmptyComponent={renderEmptyList}
                    />
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default SearchScreen;