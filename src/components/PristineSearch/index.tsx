import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../../services/supabase';
import { styles } from './style';

type Category = {
    id: number;
    name: string;
};

type Props = {
    // A prop 'onCategoryPress' está definida para enviar dois argumentos: um número e uma string.
    onCategoryPress: (categoryId: number, categoryName: string) => void;
};

/**
 * @description
 * Componente para o estado inicial da tela de busca, exibindo categorias.
 */
const PristineSearch: React.FC<Props> = ({ onCategoryPress }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('id, name')
                .limit(8);

            if (error) {
                Alert.alert("Erro", "Não foi possível carregar as categorias.");
            } else {
                setCategories(data || []);
            }
            setLoading(false);
        };
        fetchCategories();
    }, []);

    if (loading) {
        return <ActivityIndicator style={{ marginTop: 30 }} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Explorar Categorias</Text>
            <View style={styles.categoryContainer}>
                {categories.map(category => (
                    <TouchableOpacity
                        key={category.id}
                        style={styles.categoryChip}
                        // Aqui, nós chamamos a função com os dois argumentos esperados.
                        onPress={() => onCategoryPress(category.id, category.name)}
                    >
                        <Text style={styles.categoryChipText}>{category.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default PristineSearch;