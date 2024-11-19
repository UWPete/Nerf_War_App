// StartGameScreen.js

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { db } from './firebaseConfig';
import { collection, addDoc } from '@firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const StartGameScreen = () => {
  const [gameName, setGameName] = useState('');
  const [location, setLocation] = useState('');
  const navigation = useNavigation();

  const startGame = async () => {
    try {
      const docRef = await addDoc(collection(db, 'games'), {
        name: gameName,
        location: location,
        createdAt: new Date(),
      });
      console.log('Game created with ID: ', docRef.id);
      navigation.navigate('GameScreen', { gameId: docRef.id });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title="Start Game" onPress={startGame} />
    </View>
  );
};

export default StartGameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
});
