import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import firebase from "../Config";

const database = firebase.database();
const refDiscussions = database.ref("Discussions");

export default function Chat({ route }) {
  const { secondUser = {}, currentUser = {} } = route.params || {};

  if (!currentUser.id || !secondUser.id) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          User data is missing. Please try again.
        </Text>
      </View>
    );
  }

  const discussionId =
    currentUser.id > secondUser.id
      ? currentUser.id + secondUser.id
      : secondUser.id + currentUser.id;

  const refDiscussion = refDiscussions.child(discussionId);
  const currentUserTypingRef = refDiscussion.child(`${currentUser.id} isTyping`);
  const secondUserTypingRef = refDiscussion.child(`${secondUser.id} isTyping`);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef();

  // Listen for new messages and typing status
  useEffect(() => {
    const messageListener = refDiscussion.on("child_added", (snapshot) => {
      setMessages((prevMessages) => [...prevMessages, snapshot.val()]);
      flatListRef.current?.scrollToEnd({ animated: true });
    });

    const typingListener = secondUserTypingRef.on("value", (snapshot) => {
      setIsTyping(snapshot.val() || false);
    });

    return () => {
      refDiscussion.off("child_added", messageListener);
      secondUserTypingRef.off("value", typingListener);
      currentUserTypingRef.set(false); // Cleanup typing state when component unmounts
    };
  }, []);

  // Send a new message
  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

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
  };

  // Format timestamps for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{secondUser.nom || "Chat"}</Text>
        {isTyping && <Text style={styles.typingIndicator}>Typing...</Text>}
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        ref={flatListRef}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === currentUser.id
                ? styles.currentUserMessage
                : styles.secondUserMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.body}</Text>
            <Text style={styles.messageTime}>{formatTimestamp(item.time)}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesList}
      />

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          onFocus={() => currentUserTypingRef.set(true)}
          onBlur={() => currentUserTypingRef.set(false)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    backgroundColor: "#008CBA",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  typingIndicator: {
    fontSize: 14,
    color: "#fff",
    fontStyle: "italic",
  },
  messagesList: {
    flexGrow: 1,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  currentUserMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  secondUserMessage: {
    backgroundColor: "#e6e6e6",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#008CBA",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});
