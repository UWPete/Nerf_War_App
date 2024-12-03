// JoinGameScreen.js

import React, { useEffect, useState } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { auth, db } from './firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const JoinGameScreen = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'games'));
      const gamesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGames(gamesList);
    } catch (error) {
      console.error('Error fetching games:', error);
      Alert.alert('Error', 'Failed to load available games.');
    } finally {
      setLoading(false);
    }
  };

  const joinGame = async (gameId) => {
    try {
      setLoading(true);
      const gameDocRef = doc(db, 'games', gameId);
      const gameDoc = await getDoc(gameDocRef);

      if (gameDoc.exists()) {
        const gameData = gameDoc.data();
        if (gameData.currentPlayers >= gameData.maxPlayers) {
          Alert.alert('Game Full', 'This game has reached its maximum number of players.');
          return;
        }

        await setDoc(doc(db, 'games', gameId, 'players', auth.currentUser.uid), {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          joinedAt: new Date(),
          status: 'active'
        });

        await updateDoc(gameDocRef, { currentPlayers: gameData.currentPlayers + 1 });
        await setDoc(
          doc(db, 'users', auth.currentUser.uid),
          { currentGameId: gameId },
          { merge: true }
        );

        Alert.alert('Success', 'You have joined the game successfully!');
        navigation.navigate('AuthenticatedScreen');
      } else {
        Alert.alert('Error', 'Game not found.');
      }
    } catch (error) {
      console.error('Error joining game:', error);
      Alert.alert('Error', 'Failed to join game.');
    } finally {
      setLoading(false);
    }
  };

  const GameCard = ({ item }) => {
    const isFull = item.currentPlayers >= item.maxPlayers;
    
    return (
      <View style={styles.gameCard}>
        <View style={styles.gameHeader}>
          <Text style={styles.gameName}>{item.name}</Text>
          <View style={[styles.statusBadge, isFull && styles.statusBadgeFull]}>
            <Text style={[styles.statusText, isFull && styles.statusTextFull]}>
              {isFull ? 'Full' : 'Open'}
            </Text>
          </View>
        </View>

        <View style={styles.gameInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.gameDetail}>{item.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.gameDetail}>
              {item.currentPlayers}/{item.maxPlayers} Players
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.joinButton, isFull && styles.joinButtonDisabled]}
          onPress={() => joinGame(item.id)}
          disabled={isFull}
        >
          <Text style={[styles.joinButtonText, isFull && styles.joinButtonTextDisabled]}>
            {isFull ? 'Game Full' : 'Join Game'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Games</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchGames}>
          <Ionicons name="refresh" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {games.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="game-controller-outline" size={48} color="#666" />
          <Text style={styles.emptyStateText}>No games available</Text>
          <Text style={styles.emptyStateSubtext}>Try creating a new game instead!</Text>
        </View>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GameCard item={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#161616',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  gameCard: {
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 16,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gameName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBadge: {
    backgroundColor: '#1a3320',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  statusBadgeFull: {
    backgroundColor: '#331a1a',
    borderColor: '#ff4444',
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextFull: {
    color: '#ff4444',
  },
  gameInfo: {
    gap: 12,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gameDetail: {
    color: '#fff',
    fontSize: 16,
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    backgroundColor: '#331a1a',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  joinButtonTextDisabled: {
    color: '#ff4444',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyStateSubtext: {
    color: '#666',
    fontSize: 16,
    marginTop: 8,
  },
});

export default JoinGameScreen;