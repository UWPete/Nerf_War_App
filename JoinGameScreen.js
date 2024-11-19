// JoinGameScreen.js

import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Button, StyleSheet, Alert } from 'react-native';
import { auth, db } from './firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const JoinGameScreen = () => {
  const [games, setGames] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'games'));
        const gamesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setGames(gamesList);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  const joinGame = async (gameId) => {
    try {
      const gameDocRef = doc(db, 'games', gameId);
      const gameDoc = await getDoc(gameDocRef);

      if (gameDoc.exists()) {
        const gameData = gameDoc.data();
        if (gameData.currentPlayers >= gameData.maxPlayers) {
          Alert.alert('Game Full', 'This game has reached its maximum number of players.');
          return;
        }

        // Add the user to the game's players collection
        await setDoc(doc(db, 'games', gameId, 'players', auth.currentUser.uid), {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          joinedAt: new Date(),
        });

        // Update game's currentPlayers count
        await updateDoc(gameDocRef, { currentPlayers: gameData.currentPlayers + 1 });

        // Update user's currentGameId
        await setDoc(
          doc(db, 'users', auth.currentUser.uid),
          { currentGameId: gameId },
          { merge: true }
        );

        Alert.alert('Success', 'Joined game successfully!');
        navigation.navigate('AuthenticatedScreen');
      } else {
        Alert.alert('Error', 'Game not found.');
      }
    } catch (error) {
      console.error('Error joining game:', error);
      Alert.alert('Error', 'Failed to join game.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.gameName}>{item.name}</Text>
      <Text style={styles.gameDetail}>Location: {item.location}</Text>
      <Text style={styles.gameDetail}>
        Players: {item.currentPlayers}/{item.maxPlayers}
      </Text>
      <Button title="Join Game" onPress={() => joinGame(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default JoinGameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
});
