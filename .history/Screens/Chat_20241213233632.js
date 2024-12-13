import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { Picker } from 'emoji-mart';

const Chat = ({ currentUser, secondUser, refDiscussion }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const flatListRef = useRef();

  useEffect(() => {
    // Fetch initial messages from Firebase
    const fetchMessages = async () => {
      try {
        refDiscussion.on('value', (snapshot) => {
          const data = snapshot.val();
          const messagesList = data ? Object.keys(data).map(key => ({
            ...data[key],
            key
          })) : [];
          setMessages(messagesList);
        });
      } catch (error) {
        console.error("Error fetching messages:", error.message);
      }
    };

    fetchMessages();

    return () => {
      refDiscussion.off('value');
    };
  }, [refDiscussion]);

  const sendImageMessage = async (imageSource) => {
    try {
      const messageRef = refDiscussion.push();
      await messageRef.set({
        type: 'image',
        uri: imageSource.uri,
        time: new Date().toISOString(),
        sender: currentUser.id,
        receiver: secondUser.id,
      });
    } catch (error) {
      console.error("Error sending image message:", error.message);
    }
  };

  const sendFileMessage = async (fileUri) => {
    try {
      const messageRef = refDiscussion.push();
      await messageRef.set({
        type: 'file',
        uri: fileUri,
        time: new Date().toISOString(),
        sender: currentUser.id,
        receiver: secondUser.id,
      });
    } catch (error) {
      console.error("Error sending file message:", error.message);
    }
  };

  const sendLocationMessage = async () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        try {
          const messageRef = refDiscussion.push();
          await messageRef.set({
            type: 'location',
            location,
            time: new Date().toISOString(),
            sender: currentUser.id,
            receiver: secondUser.id,
          });
        } catch (error) {
          console.error("Error sending location message:", error.message);
        }
      },
      (error) => console.error(error.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await refDiscussion.child(messageId).update({
        read: true,
      });
    } catch (error) {
      console.error("Error marking message as read:", error.message);
    }
  };

  const handleScroll = () => {
    // Mark messages as read when the user scrolls
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender !== currentUser.id) {
      markMessageAsRead(lastMessage.key);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const messageRef = refDiscussion.push();
        await messageRef.set({
          body: newMessage,
          time: new Date().toISOString(),
          sender: currentUser.id,
          receiver: secondUser.id,
        });
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji.native);
    setIsPickerVisible(false);
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.body}</Text>
            <Text style={styles.messageTime}>{formatTimestamp(item.time)}</Text>
            {item.type === 'image' && <Image source={{ uri: item.uri }} style={styles.messageImage} />}
            {item.type === 'file' && <Text style={styles.messageFile}>File: {item.uri}</Text>}
            {item.type === 'location' && (
              <Text style={styles.messageLocation}>
                Location: {item.location.latitude}, {item.location.longitude}
              </Text>
            )}
          </View>
        )}
        onEndReached={handleScroll}
        onEndReachedThreshold={0.1}
      />

      {isPickerVisible && (
        <Picker onSelect={handleEmojiSelect} set="apple" />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          onFocus={() => currentUserTypingRef.set(true)}
          onBlur={() => currentUserTypingRef.set(false)}
        />
        <TouchableOpacity
          style={styles.emojiButton}
          onPress={() => setIsPickerVisible(!isPickerVisible)}
        >
          <Text style={styles.emojiButtonText}>😀</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={uploadImage}>
          <Text style={styles.imageButtonText}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fileButton} onPress={uploadFile}>
          <Text style={styles.fileButtonText}>📎</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.locationButton} onPress={sendLocationMessage}>
          <Text style={styles.locationButtonText}>📍</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = {
  messageContainer: {
    padding: 10,
    marginBottom: 5,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
  },
  messageImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  messageFile: {
    fontSize: 14,
    color: '#007bff',
  },
  messageLocation: {
    fontSize: 14,
    color: '#007bff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    marginRight: 10,
  },
  emojiButton: {
    marginLeft: 10,
  },
  emojiButtonText: {
    fontSize: 24,
  },
  sendButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#ffffff',
  },
  imageButton: {
    marginLeft: 10,
  },
  imageButtonText: {
    fontSize: 24,
  },
  fileButton: {
    marginLeft: 10,
  },
  fileButtonText: {
    fontSize: 24,
  },
  locationButton: {
    marginLeft: 10,
  },
  locationButtonText: {
    fontSize: 24,
  },
};

export default Chat;
