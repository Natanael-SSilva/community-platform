import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, FlatList, 
    KeyboardAvoidingView, Platform, ActivityIndicator, Alert
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../services/supabase';
import type { AppStackParamList } from '../../navigation/types';
import { styles } from './style';
import { format, isSameDay, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// --- Tipos ---
type Message = {
    id: number;
    content: string;
    sender_id: string;
    created_at: string;
};

type ListItem = { type: 'message', data: Message } | { type: 'date', date: string };

// --- Custom Hook para Lógica de Dados ---
/**
 * Hook customizado para gerenciar o estado das mensagens de um chat.
 * Busca as mensagens iniciais e se inscreve para atualizações em tempo real.
 * @param conversationId O ID da conversa para buscar mensagens.
 * @returns Um objeto contendo as mensagens, o estado de carregamento e o ID do usuário atual.
 */
const useChatMessages = (conversationId: number) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id || null);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!conversationId || !userId) return;

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: false });
            
            if (error) {
                Alert.alert("Erro", "Não foi possível carregar as mensagens.");
            } else if (data) {
                setMessages(data);
            }
            setLoading(false);
        };
        fetchMessages();

        const channel = supabase.channel(`chat_room_${conversationId}`)
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'messages', 
                filter: `conversation_id=eq.${conversationId}` 
            }, (payload) => {
                if (payload.new.sender_id !== userId) {
                    setMessages(prev => [payload.new as Message, ...prev]);
                }
            }).subscribe();
            
        return () => { supabase.removeChannel(channel); };
    }, [conversationId, userId]);

    return { messages, setMessages, loading, userId };
};

// --- Subcomponentes de Renderização ---
const DateSeparator = ({ date }: { date: string }) => (
    <View style={styles.dateSeparator}>
        <Text style={styles.dateSeparatorText}>{date}</Text>
    </View>
);

const MessageBubble = ({ message, isMyMessage }: { message: Message, isMyMessage: boolean }) => (
    <View style={[styles.bubbleContainer, isMyMessage ? styles.myBubbleContainer : styles.recipientBubbleContainer]}>
        <View style={[styles.messageBubble, isMyMessage ? styles.myBubble : styles.recipientBubble]}>
            <Text style={isMyMessage ? styles.myMessageText : styles.recipientMessageText}>
                {message.content}
            </Text>
        </View>
        <Text style={[styles.timestamp, isMyMessage ? styles.myTimestamp : styles.recipientTimestamp]}>
            {format(new Date(message.created_at), 'HH:mm')}
        </Text>
    </View>
);

// --- Componente Principal ---
const ChatScreen = () => {
    const route = useRoute<RouteProp<AppStackParamList, 'Chat'>>();
    const { conversationId } = route.params;
    const insets = useSafeAreaInsets();
    
    const { messages, setMessages, loading, userId } = useChatMessages(conversationId);
    const [newMessage, setNewMessage] = useState('');
    
    const processedMessages = useMemo(() => {
        const items: ListItem[] = [];
        let lastDate: Date | null = null;
        
        messages.forEach(message => {
            const messageDate = new Date(message.created_at);
            if (!lastDate || !isSameDay(messageDate, lastDate)) {
                let dateString;
                if (isToday(messageDate)) { dateString = 'Hoje'; } 
                else if (isYesterday(messageDate)) { dateString = 'Ontem'; } 
                else { dateString = format(messageDate, "dd 'de' MMMM", { locale: ptBR }); }
                
                items.push({ type: 'date', date: dateString });
                lastDate = messageDate;
            }
            items.push({ type: 'message', data: message });
        });
        return items;
    }, [messages]);

    const handleSendMessage = async () => {
        const content = newMessage.trim();
        if (!content || !userId) return;

        const optimisticMessage: Message = {
            id: Math.random(),
            content: content,
            sender_id: userId,
            created_at: new Date().toISOString(),
        };

        setMessages(prev => [optimisticMessage, ...prev]);
        setNewMessage('');

        const { error } = await supabase
            .from('messages')
            .insert({ conversation_id: conversationId, sender_id: userId, content });
        
        if (error) {
            Alert.alert("Erro", "Não foi possível enviar a mensagem.");
            setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
            setNewMessage(content);
        }
    };
    
    const renderItem = useCallback(({ item }: { item: ListItem }) => {
        if (item.type === 'date') {
            return <DateSeparator date={item.date} />;
        }
        return <MessageBubble message={item.data} isMyMessage={item.data.sender_id === userId} />;
    }, [userId]);

    if (loading) return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} />;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={90}
            >
                <FlatList
                    data={processedMessages}
                    keyExtractor={(item, index) => item.type === 'message' ? item.data.id.toString() : `date-${index}`}
                    inverted
                    style={styles.messageList}
                    contentContainerStyle={{ paddingTop: 10 }}
                    renderItem={renderItem}
                />
                <View style={[styles.inputContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }]}>
                    <TextInput
                        style={styles.input}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Digite sua mensagem..."
                        multiline
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                        <Ionicons name="send" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default ChatScreen;