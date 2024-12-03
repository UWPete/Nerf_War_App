// JoinGameScreen.js

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator, 
  FlatList,
  Modal,
  TextInput
} from 'react-native';
import { db, auth } from './firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const JoinGameScreen = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [gamePassword, setGamePassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchAvailableGames();
  }, []);

  const fetchAvailableGames = async () => {
    try {
      setLoading(true);
      const gamesCollection = collection(db, 'games');
      const gamesSnapshot = await getDocs(gamesCollection);
      
      const gamesList = gamesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setGames(gamesList);
    } catch (error) {
      console.error('Error fetching games:', error);
      Alert.alert('Error', 'Failed to load available games');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = (game) => {
    setSelectedGame(game);
    setPasswordModalVisible(true);
    setGamePassword('');
  };

  const verifyAndJoinGame = async () => {
    if (!selectedGame || !gamePassword) return;

    if (gamePassword !== selectedGame.password) {
      Alert.alert('Error', 'Incorrect password');
      return;
    }

    try {
      setLoading(true);

      // Check if user document exists, create if it doesn't
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          createdAt: new Date(),
          currentGameId: null
        });
      }

      // Add player to the game
      await addDoc(collection(db, 'games', selectedGame.id, 'players'), {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        role: 'player',
        status: 'active',
        joinedAt: new Date()
      });

      // Update game's current player count
      await updateDoc(doc(db, 'games', selectedGame.id), {
        currentPlayers: increment(1)
      });

      // Update user's current game
      await updateDoc(userDocRef, {
        currentGameId: selectedGame.id
      });

      setPasswordModalVisible(false);
      navigation.navigate('GameScreen', { gameId: selectedGame.id });
    } catch (error) {
      console.error('Error joining game:', error);
      Alert.alert('Error', 'Failed to join game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderGameCard = ({ item: game }) => (
    <View style={styles.gameCard}>
      <View style={styles.gameInfo}>
        <Text style={styles.gameName}>{game.name}</Text>
        <View style={styles.gameDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{game.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {game.currentPlayers}/{game.maxPlayers} Players
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.joinButton,
          game.currentPlayers >= game.maxPlayers && styles.joinButtonDisabled
        ]}
        onPress={() => handleJoinGame(game)}
        disabled={game.currentPlayers >= game.maxPlayers}
      >
        <Ionicons 
          name="enter-outline" 
          size={24} 
          color={game.currentPlayers >= game.maxPlayers ? "#666" : "#4CAF50"} 
        />
      </TouchableOpacity>
    </View>
  );

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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.title}>Available Games</Text>
      </View>

      <FlatList
        data={games}
        renderItem={renderGameCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="game-controller-outline" size={48} color="#666" />
            <Text style={styles.emptyText}>No games available</Text>
            <Text style={styles.emptySubtext}>Try creating a new game!</Text>
          </View>
        }
      />

      <Modal
        visible={passwordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Game Password</Text>
            
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter password"
              placeholderTextColor="#666"
              value={gamePassword}
              onChangeText={setGamePassword}
              secureTextEntry
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setPasswordModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.verifyButton,
                  !gamePassword && styles.verifyButtonDisabled
                ]}
                onPress={verifyAndJoinGame}
                disabled={!gamePassword}
              >
                <Text style={styles.verifyButtonText}>Join Game</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#161616',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  listContainer: {
    padding: 16,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  gameDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: '#666',
    fontSize: 14,
  },
  joinButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1a3320',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  joinButtonDisabled: {
    backgroundColor: '#161616',
    borderColor: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  passwordInput: {
    backgroundColor: '#000',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#331a1a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
  },
  verifyButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    backgroundColor: '#1a3320',
    opacity: 0.5,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default JoinGameScreen;