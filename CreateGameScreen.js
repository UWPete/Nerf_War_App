// CreateGameScreen.js

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { auth, db } from './firebaseConfig';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const CreateGameScreen = () => {
  const [gameName, setGameName] = useState('');
  const [location, setLocation] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const navigation = useNavigation();

  const createGame = async () => {
    Alert.alert('Debug', 'CreateGame function called'); // Debugging statement

    // Check if user is authenticated
    if (!auth.currentUser) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    if (!gameName || !location || !maxPlayers) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (isNaN(maxPlayers) || parseInt(maxPlayers) <= 0) {
      Alert.alert('Error', 'Please enter a valid number of players.');
      return;
    }

    try {
      Alert.alert('Debug', 'Attempting to create game in Firestore'); // Debugging statement

      // Create a new game document
      const gameDocRef = await addDoc(collection(db, 'games'), {
        name: gameName,
        location: location,
        maxPlayers: parseInt(maxPlayers),
        currentPlayers: 1, // Since the creator is the first player
        createdAt: new Date(),
      });

      const gameId = gameDocRef.id;
      Alert.alert('Debug', `Game created with ID: ${gameId}`); // Debugging statement

      // Add the user to the game's players subcollection
      await setDoc(doc(db, 'games', gameId, 'players', auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        joinedAt: new Date(),
      });

      // Update user's currentGameId in their user document
      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        { currentGameId: gameId },
        { merge: true }
      );

      Alert.alert('Success', 'Game created successfully!');
      // Navigate to the new GameManagementScreen
      try {
        navigation.navigate('GameManagementScreen', { gameId });
      } catch (navError) {
        console.error('Navigation error:', navError);
        Alert.alert('Navigation Error', `Failed to navigate: ${navError.message}`);
      }
    } catch (error) {
      console.error('Error creating game:', error);
      Alert.alert('Error', `Failed to create game: ${error.message}`);
    }
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
