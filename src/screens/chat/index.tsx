import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../services/supabase';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { styles } from './style';
import { format, isSameDay, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Message = {
    id: number;
    content: string;
    sender_id: string;
    created_at: string;
};

type ListItem = { type: 'message', data: Message } | { type: 'date', date: string };

const ChatScreen = () => {
    const route = useRoute<RouteProp<AppStackParamList, 'Chat'>>();
    const { conversationId } = route.params;
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    const processedMessages = useMemo(() => {
        const items: ListItem[] = [];
        let lastDate: Date | null = null;
        [...messages].reverse().forEach(message => {
            const messageDate = new Date(message.created_at);
            if (!lastDate || !isSameDay(messageDate, lastDate)) {
                let dateString;
                if (isToday(messageDate)) { dateString = 'Hoje'; } 
                else if (isYesterday(messageDate)) { dateString = 'Ontem'; } 
                else { dateString = format(messageDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }); }
                items.push({ type: 'date', date: dateString });
                lastDate = messageDate;
            }
            items.push({ type: 'message', data: message });
        });
        return items.reverse();
    }, [messages]);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id || null);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!conversationId) return;
        const fetchMessages = async () => {
            const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: false });
            if (data) setMessages(data);
            setLoading(false);
        };
        fetchMessages();

        const channel = supabase.channel(`chat_room_${conversationId}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
            // Apenas adiciona a mensagem se ela não for do usuário atual (para evitar duplicatas da atualização otimista)
            if (payload.new.sender_id !== userId) {
                setMessages(prevMessages => [payload.new as Message, ...prevMessages]);
            }
        }).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [conversationId, userId]); // Adiciona userId às dependências

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !userId) return;

        const content = newMessage.trim();

        // Lógica de Atualização Otimista
        const optimisticMessage: Message = {
            id: Math.random(), // ID temporário
            content: content,
            sender_id: userId,
            created_at: new Date().toISOString(),
        };

        setMessages(prevMessages => [optimisticMessage, ...prevMessages]);
        setNewMessage('');

        const { error } = await supabase
            .from('messages')
            .insert({
                conversation_id: conversationId,
                sender_id: userId,
                content: content,
            });
        
        if (error) {
            Alert.alert("Erro", "Não foi possível enviar a mensagem.");
            // Se der erro, remove a mensagem otimista e restaura o texto
            setMessages(prevMessages => prevMessages.filter(m => m.id !== optimisticMessage.id));
            setNewMessage(content);
        }
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

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
                    renderItem={({ item }) => {
                        if (item.type === 'date') {
                            return (
                                <View style={styles.dateSeparator}>
                                    <Text style={styles.dateSeparatorText}>{item.date}</Text>
                                </View>
                            );
                        }
                        const message = item.data;
                        const isMyMessage = message.sender_id === userId;
                        return (
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
                    }}
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