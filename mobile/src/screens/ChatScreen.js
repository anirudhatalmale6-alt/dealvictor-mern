import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../styles/colors';

const ChatScreen = ({ navigation, route }) => {
  const [message, setMessage] = useState('');
  const flatListRef = useRef(null);

  const conversation = {
    id: route.params?.conversationId || 1,
    user: {
      name: 'John Smith',
      avatar: 'J',
      online: true,
      project: 'E-commerce Website Development'
    }
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hi! I saw your profile and I think you would be a great fit for my project.',
      sender: 'other',
      time: '10:30 AM'
    },
    {
      id: 2,
      text: 'Hello! Thank you for reaching out. I would love to learn more about your project.',
      sender: 'me',
      time: '10:32 AM'
    },
    {
      id: 3,
      text: 'Great! I need an e-commerce website built with React and Node.js. It should have user authentication, product catalog, cart, and payment integration.',
      sender: 'other',
      time: '10:35 AM'
    },
    {
      id: 4,
      text: 'That sounds like a comprehensive project. I have experience with similar e-commerce platforms. Could you tell me more about the timeline and your budget?',
      sender: 'me',
      time: '10:38 AM'
    },
    {
      id: 5,
      text: 'I am looking to complete it within 4-6 weeks. Budget is around $2000-2500.',
      sender: 'other',
      time: '10:40 AM'
    },
    {
      id: 6,
      text: 'That timeline and budget work for me. I can provide detailed milestones once we finalize the requirements.',
      sender: 'me',
      time: '10:42 AM'
    },
    {
      id: 7,
      text: 'Perfect! Can you share some examples of similar work you have done?',
      sender: 'other',
      time: '10:45 AM'
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: message.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item, index }) => {
    const isMe = item.sender === 'me';
    const showAvatar = !isMe && (index === 0 || messages[index - 1].sender !== 'other');

    return (
      <View style={[
        styles.messageRow,
        isMe ? styles.messageRowMe : styles.messageRowOther
      ]}>
        {!isMe && showAvatar && (
          <View style={styles.messageAvatar}>
            <Text style={styles.messageAvatarText}>{conversation.user.avatar}</Text>
          </View>
        )}
        {!isMe && !showAvatar && <View style={styles.avatarPlaceholder} />}
        <View style={[
          styles.messageBubble,
          isMe ? styles.messageBubbleMe : styles.messageBubbleOther
        ]}>
          <Text style={[
            styles.messageText,
            isMe && styles.messageTextMe
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            isMe && styles.messageTimeMe
          ]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.dark} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{conversation.user.avatar}</Text>
            {conversation.user.online && <View style={styles.onlineIndicator} />}
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{conversation.user.name}</Text>
            <Text style={styles.headerProject} numberOfLines={1}>
              {conversation.user.project}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <Icon name="more-vertical" size={20} color={colors.dark} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Icon name="paperclip" size={22} color={colors.gray} />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={colors.gray}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={1000}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              message.trim() && styles.sendButtonActive
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Icon
              name="send"
              size={20}
              color={message.trim() ? colors.white : colors.gray}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lighterGray,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 12,
  },
  headerAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.white,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  headerProject: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    maxWidth: '80%',
  },
  messageRowMe: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  messageAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  avatarPlaceholder: {
    width: 40,
    marginRight: 8,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: '100%',
  },
  messageBubbleMe: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: colors.dark,
    lineHeight: 22,
  },
  messageTextMe: {
    color: colors.white,
  },
  messageTime: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  messageTimeMe: {
    color: 'rgba(255,255,255,0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lighterGray,
    gap: 8,
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.lighterGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.lighterGray,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
    maxHeight: 120,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 16,
    color: colors.dark,
    paddingVertical: 4,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.lighterGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
});

export default ChatScreen;
