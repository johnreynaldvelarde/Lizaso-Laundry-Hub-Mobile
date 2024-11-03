import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import noconvo from "../../assets/images/start_convo.png";
import { LinearGradient } from "expo-linear-gradient";
import {
  createMessageSenderStaff,
  createNewMessage,
  setPostNewMessage,
} from "../../data/api/postApi";
import { getMessages } from "../../data/api/getApi";
import usePolling from "../../hooks/usePolling";
import { useFocusEffect } from "expo-router";
import useAuth from "../context/AuthContext";
import { decryptMessage, encryptMessage } from "../../constants/method";
import { updateMessageisRead } from "../../data/api/putApi";

export default function Chat() {
  const route = useRoute();
  const { userDetails } = useAuth();
  const navigation = useNavigation();
  const { user_id, name } = route.params;
  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef();
  const [decryptedMessages, setDecryptedMessages] = useState([]);

  const fetchMessages = useCallback(async () => {
    const response = await getMessages(userDetails.userId, user_id);
    return response.data;
  }, [userDetails.userId, user_id]);

  const fetchupdateMessageRead = useCallback(async () => {
    const response = await updateMessageisRead(userDetails.userId, user_id);
    console.log(response.message);
    return response.message;
  }, [userDetails.userId, user_id]);

  const {
    data: messages,
    loading,
    error,
    setIsPolling,
  } = usePolling(fetchMessages, 1000);

  const { setIsPolling: setUpdatePolling } = usePolling(
    fetchupdateMessageRead,
    2000
  );

  useFocusEffect(
    useCallback(() => {
      setIsPolling(true);
      setUpdatePolling(true);

      return () => {
        setIsPolling(false);
        setUpdatePolling(false);
      };
    }, [])
  );

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const encryptedMessage = await encryptMessage(newMessage);

        const messageData = {
          sender_id: userDetails.userId,
          recipient_id: user_id,
          message: encryptedMessage,
        };

        const response = await createNewMessage(messageData);
        if (response && response.success) {
          setNewMessage("");
        } else {
          console.error("Message failed to send", response);
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    } else {
      console.log("Cannot send an empty message.");
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    const decryptMessages = async () => {
      const decrypted = await Promise.all(
        messages.map(async (message) => {
          const decryptedMessage = await decryptMessage(message.message);
          return {
            ...message,
            message: decryptedMessage,
          };
        })
      );
      setDecryptedMessages(decrypted);
    };

    decryptMessages();
  }, [messages]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#5787C8", "#71C7DA"]}
        locations={[0, 0.8]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.5, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      {/* Chat window */}
      <ScrollView
        contentContainerStyle={[
          styles.chatContainer,
          messages.length === 0 && styles.centeredContent, // Center the "Start Conversation" message
        ]}
        ref={scrollViewRef} // Attach the ref to the ScrollView
        keyboardShouldPersistTaps="handled" // Allows tapping on the input field while keyboard is open
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {decryptedMessages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image source={noconvo} style={styles.noConversationImage} />
            <Text style={styles.startConversationText}>
              Start a conversation now!
            </Text>
          </View>
        ) : (
          decryptedMessages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.sender_id === userDetails.userId
                  ? styles.sent
                  : styles.received,
              ]}
            >
              <Text style={styles.messageText}>{message.message}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Message input field */}
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          style={styles.input}
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingVertical: 5,
    backgroundColor: COLORS.secondary,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 20,
    color: COLORS.secondary,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.Bold,
    textAlign: "center",
    flex: 1,
    color: COLORS.white,
  },
  placeholder: {
    width: 50,
  },
  chatContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  noConversationImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  startConversationText: {
    fontSize: 18,
    color: COLORS.secondary,
    fontFamily: fonts.Medium,
    textAlign: "center",
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#C7D7EC",
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
  },
  messageText: {
    fontSize: 16,
    color: COLORS.text3,
    fontFamily: fonts.Medium,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
});
