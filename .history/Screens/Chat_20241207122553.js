import React, { useState, useEffect } from "react";
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
const ref_LesMessages = database.ref("Discussions");

export default function Chat(props) {
  const secondUser = props.route.params.secondUser;
  const currentUser = props.route.params.currentUser;

  const iddisc =
    currentUser.id > secondUser.id
      ? currentUser.id + secondUser.id
      : secondUser.id + currentUser.id;

  const ref_unedisc = ref_LesMessages.child(iddisc);
  const currentistyping = ref_unedisc.child(`${currentUser.id} isTyping`);
  const secondistyping = ref_unedisc.child(`${secondUser.id} isTyping`);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const listener = ref_unedisc.on("value", (snapshot) => {
      const fetchedMessages = [];
      snapshot.forEach((unmsg) => {
        fetchedMessages.push(unmsg.val());
      });
      setMessages(fetchedMessages);
    });

    return () => {
      ref_unedisc.off("value", listener);
    };
  }, []);

  const sendMessage = () => {
    const key = ref_unedisc.push().key;
    const ref_unmessage = ref_unedisc.child(key);

    if (newMessage.trim() === "") return; 

    ref_unmessage.set({
      body: newMessage,
      time: new Date().toLocaleString(),
      sender: currentUser.id,
      receiver: secondUser.id,
    });

    setNewMessage(""); // Clear input field
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>{secondUser.nom}</Text>
      </View>
      <FlatList
        data={messages}
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
          </View>
        )}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          onFocus={() => currentistyping.set(true)}
          onBlur={() => currentistyping.set(false)}
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
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
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
});
