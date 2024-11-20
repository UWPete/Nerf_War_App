// HubScreen.js

import React, { useState } from 'react';
import { View, FlatList, TextInput, Button, Text, StyleSheet } from 'react-native';

const HubScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), text: newMessage }]);
    setNewMessage('');
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message"
          style={styles.input}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default HubScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messageList: {
    marginBottom: 16,
  },
  messageContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginRight: 8,
    padding: 8,
  },
});
