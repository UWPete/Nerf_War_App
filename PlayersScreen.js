// PlayersScreen.js

import React, { useEffect, useState } from 'react';
import { FlatList, Text, StyleSheet, View } from 'react-native';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const PlayersScreen = ({ route }) => {
  const { gameId } = route.params;
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'games', gameId, 'players'));
        const playersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPlayers(playersList);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, [gameId]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>{item.email}</Text>
    </View>
  );

  return (
    <FlatList
      data={players}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

export default PlayersScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  itemContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
