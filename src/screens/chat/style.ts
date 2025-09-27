import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  bubbleContainer: {
    maxWidth: '80%',
    marginBottom: 10,
  },
  myBubbleContainer: {
    alignSelf: 'flex-end',
  },
  recipientBubbleContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  recipientBubble: {
    backgroundColor: '#EFEFEF',
  },
  myBubble: {
    backgroundColor: '#3F83F8',
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  recipientMessageText: {
    color: '#000000',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  myTimestamp: {
    alignSelf: 'flex-end',
  },
  recipientTimestamp: {
    alignSelf: 'flex-start',
  },
  dateSeparator: {
    alignSelf: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 15,
  },
  dateSeparatorText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    minHeight: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
    paddingTop: 10,
  },
  sendButton: {
    backgroundColor: '#3F83F8',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
