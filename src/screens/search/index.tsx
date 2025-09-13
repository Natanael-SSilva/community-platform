import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, Alert, ActivityIndicator, TextInput, TouchableOpacity, Modal, Keyboard, StatusBar } from 'react-native';
import { supabase } from '../../services/supabase';
import { styles } from './style';
import { Ionicons } from '@expo/vector-icons';
import ServiceCard, { ServiceCardData } from '../../components/ServiceCard';
import useDebounce from '../../hooks/useDebounce';
import PristineSearch from '../../components/PristineSearch';

type Category = { id: number; name: string; };

/**
 * @description
 * Tela de busca de serviços. Gerencia múltiplos estados (inicial, digitação, resultados)
 * e envia os filtros de busca e categoria para o backend para uma busca performática.
 */
const SearchScreen: React.FC = () => {
    const [services, setServices] = useState<ServiceCardData[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<Pick<ServiceCardData, 'id' | 'title'>[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    const [isPristine, setIsPristine] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [tempSelectedCategories, setTempSelectedCategories] = useState<number[]>([]);

    /**
     * Busca os serviços no backend, aplicando os filtros atuais de texto e categoria.
     */
    const executeSearch = useCallback(async (searchTextValue: string, categoryIds: number[]) => {
        setIsPristine(false);
        setIsTyping(false);
        Keyboard.dismiss();
        setLoading(true);
        try {
            const { data, error } = await supabase.rpc('get_services_with_ratings', {
                search_term: searchTextValue.trim() === '' ? null : searchTextValue,
                category_ids_filter: categoryIds.length === 0 ? null : categoryIds
            });
            if (error) throw error;
            setServices(data || []);
        } catch (error: any) {
            Alert.alert("Erro ao buscar serviços", error.message);
        } finally {
            setLoading(false);
        }
    }, []);
    
    useEffect(() => {
        if (debouncedSearchTerm.trim().length > 1 && isTyping) {
            const fetchSuggestions = async () => {
                const { data, error } = await supabase.from('services').select('id, title').ilike('title', `%${debouncedSearchTerm}%`).limit(5);
                if (error) console.error("Erro ao buscar sugestões:", error);
                else setSuggestions(data || []);
            };
            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [debouncedSearchTerm, isTyping]);
    
    const handleSuggestionPress = (suggestionTitle: string) => {
        setSearchTerm(suggestionTitle);
        executeSearch(suggestionTitle, selectedCategories);
    };

    const handleCategoryPress = (categoryId: number, categoryName: string) => {
        const newSelectedCategories = [categoryId];
        setSelectedCategories(newSelectedCategories);
        setSearchTerm(categoryName);
        executeSearch(categoryName, newSelectedCategories);
    };

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
        executeSearch(searchTerm, tempSelectedCategories);
    };

    /**
     * Decide qual conteúdo renderizar com base no estado da busca.
     */
    const renderContent = () => {
        if (loading) {
            return <ActivityIndicator style={{ flex: 1 }} size="large" color="#3F83F8" />;
        }
        if (isTyping) {
            return (
                <View style={styles.suggestionsContainer}>
                    <FlatList
                        data={suggestions}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSuggestionPress(item.title)}>
                                <Ionicons name="search-outline" size={20} color="#666" />
                                <Text style={styles.suggestionText}>{item.title}</Text>
                            </TouchableOpacity>
                        )}
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            );
        }
        if (isPristine) {
            return <PristineSearch onCategoryPress={handleCategoryPress} />;
        }
        return (
            <FlatList
                data={services}
                renderItem={({ item }) => <ServiceCard service={item} />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContentContainer}
                ListEmptyComponent={<View style={styles.emptyContainer}><Ionicons name="search-circle-outline" size={60} color="#CBD5E0" style={styles.emptyIcon} /><Text style={styles.emptyTitle}>Nenhum serviço encontrado</Text><Text style={styles.emptySubtitle}>Tente ajustar sua busca ou filtros.</Text></View>}
            />
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
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
                        onChangeText={(text) => {
                            setSearchTerm(text);
                            setIsTyping(text.length > 0);
                            if (text.length === 0) {
                                setIsPristine(true);
                                setServices([]);
                            } else {
                                setIsPristine(false);
                            }
                        }}
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
            
            {renderContent()}
        </SafeAreaView>
    );
};

export default SearchScreen;