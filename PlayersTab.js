// PlayersTab.js

import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Button, Alert } from 'react-native';
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const PlayersTab = ({ route }) => {
  const { gameId } = route.params;
  const [players, setPlayers] = useState([]);

  const fetchPlayers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'games', gameId, 'players'));
      const playersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPlayers(playersList);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [gameId]);

  // Function to add a player
  const addPlayer = async () => {
    try {
      // For simplicity, we'll add a dummy player
      await addDoc(collection(db, 'games', gameId, 'players'), {
        name: 'New Player',
        email: 'player@example.com',
        addedAt: new Date(),
      });
      Alert.alert('Success', 'Player added successfully!');
      // Refresh the players list
      fetchPlayers();
    } catch (error) {
      console.error('Error adding player:', error);
      Alert.alert('Error', 'Failed to add player.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>{item.email || item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Add Player" onPress={addPlayer} />
      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default PlayersTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    marginTop: 16,
  },
  itemContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
