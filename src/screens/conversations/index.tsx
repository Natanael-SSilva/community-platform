import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../../services/supabase';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { styles } from './style';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ConversationsScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // CORREÇÃO: A função agora não depende mais do estado 'loading'
    const fetchConversations = useCallback(async () => {
        try {
            const { data, error } = await supabase.rpc('get_user_conversations');
            if (error) throw error;
            setConversations(data || []);
        } catch (error: any) {
            Alert.alert("Erro ao carregar conversas", error.message);
        }
    }, []); // A array de dependências agora está vazia

    // Busca as conversas quando a tela entra em foco
    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchConversations().finally(() => setLoading(false));
        }, [fetchConversations])
    );
    
    // Se inscreve para ouvir novas mensagens em tempo real
    useEffect(() => {
        const channel = supabase
            .channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' },
            (payload) => {
                // Quando uma nova mensagem chega, apenas recarregamos a lista
                fetchConversations();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchConversations]);

    if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.conversationItem} 
                        onPress={() => navigation.navigate('Chat', {
                            conversationId: item.id,
                            recipient: {
                                id: item.other_participant_id,
                                full_name: item.other_participant_full_name,
                                avatar_url: item.other_participant_avatar_url,
                            },
                        })}
                    >
                        <Image source={{ uri: item.other_participant_avatar_url || 'https://via.placeholder.com/50' }} style={styles.avatar} />
                        <View style={styles.textContainer}>
                            <Text style={styles.userName}>{item.other_participant_full_name}</Text>
                            <Text style={styles.lastMessage} numberOfLines={1}>{item.last_message_content || 'Inicie a conversa!'}</Text>
                        </View>
                        <Text style={styles.timestamp}>
                            {item.last_message_at ? formatDistanceToNow(new Date(item.last_message_at), { locale: ptBR, addSuffix: true }) : ''}
                        </Text>
                    </TouchableOpacity>
                )}
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