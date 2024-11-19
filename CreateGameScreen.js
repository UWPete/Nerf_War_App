// CreateGameScreen.js

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CreateGameScreen = () => {
  const [gameName, setGameName] = useState('');
  const [location, setLocation] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const navigation = useNavigation(); // Use navigation from React Navigation

  const createGame = () => {
    if (!gameName || !location || !maxPlayers) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (isNaN(maxPlayers) || parseInt(maxPlayers) <= 0) {
      Alert.alert('Error', 'Please enter a valid number of players.');
      return;
    }

    // After validation, navigate to GameManagementScreen
    navigation.navigate('GameManagementScreen', { 
      gameName, 
      location, 
      maxPlayers: parseInt(maxPlayers) 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Game</Text>

      <TextInput
        placeholder="Game Name"
        value={gameName}
        onChangeText={setGameName}
        style={styles.input}
      />
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />
      <TextInput
        placeholder="Max Players"
        value={maxPlayers}
        onChangeText={setMaxPlayers}
        style={styles.input}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.createButton} onPress={createGame}>
        <Text style={styles.buttonText}>Create Game</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateGameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  createButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
