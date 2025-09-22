import React, { useState, useCallback } from 'react';
import { 
    View, Text, SafeAreaView, FlatList, TouchableOpacity, 
    Alert, ActivityIndicator, Image 
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../../services/supabase';
import type { AppStackParamList, Profile as RecipientProfile } from '../../navigation/types';
import { styles } from './style';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// --- Tipos ---
/**
 * Representa a estrutura de dados de uma única conversa retornada pela API.
 */
type Conversation = {
    id: number;
    other_participant_id: string;
    other_participant_full_name: string;
    other_participant_avatar_url: string;
    last_message_content: string | null;
    last_message_at: string | null;
};
type ConversationsNavigationProp = NativeStackNavigationProp<AppStackParamList>;

// --- Custom Hook ---
/**
 * Hook para gerenciar a busca e as atualizações em tempo real das conversas do usuário.
 */
const useConversations = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchConversations = useCallback(async () => {
        try {
            const { data, error } = await supabase.rpc('get_user_conversations');
            if (error) throw error;
            setConversations(data || []);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
            Alert.alert("Erro ao carregar conversas", message);
        }
    }, []);

    // Busca as conversas quando a tela entra em foco
    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchConversations().finally(() => setLoading(false));
        }, [fetchConversations])
    );
    
    // Se inscreve para ouvir novas mensagens em tempo real
    React.useEffect(() => {
        const channel = supabase
            .channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' },
            // CORREÇÃO: Removido o 'payload' que não estava sendo usado
            () => {
                // Quando uma nova mensagem chega, apenas recarregamos a lista de conversas
                fetchConversations();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchConversations]);

    return { conversations, loading };
};


// --- Componente Principal ---
/**
 * Tela que exibe a lista de conversas ativas do usuário.
 */
const ConversationsScreen = () => {
    const navigation = useNavigation<ConversationsNavigationProp>();
    const { conversations, loading } = useConversations();

    const renderItem = ({ item }: { item: Conversation }) => {
        const recipient: RecipientProfile = {
            id: item.other_participant_id,
            full_name: item.other_participant_full_name,
            avatar_url: item.other_participant_avatar_url,
        };

        return (
            <TouchableOpacity 
                style={styles.conversationItem} 
                onPress={() => navigation.navigate('Chat', {
                    conversationId: item.id,
                    recipient,
                })}
            >
                <Image source={{ uri: item.other_participant_avatar_url }} style={styles.avatar} />
                <View style={styles.textContainer}>
                    <Text style={styles.userName}>{item.other_participant_full_name}</Text>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {item.last_message_content || 'Inicie a conversa!'}
                    </Text>
                </View>
                {item.last_message_at && (
                    <Text style={styles.timestamp}>
                        {formatDistanceToNow(new Date(item.last_message_at), { locale: ptBR, addSuffix: true })}
                    </Text>
                )}
            </TouchableOpacity>
        );
    };

    if (loading) {
        return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ flexGrow: 1 }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Você ainda não tem conversas. Inicie uma a partir da página de um serviço!</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default ConversationsScreen;