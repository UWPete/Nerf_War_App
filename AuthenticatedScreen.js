// AuthenticatedScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { auth, db } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const AuthenticatedScreen = () => {
  const navigation = useNavigation();
  const [currentGame, setCurrentGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserGame = async () => {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.currentGameId) {
            const gameDocRef = doc(db, 'games', userData.currentGameId);
            const gameDoc = await getDoc(gameDocRef);
            if (gameDoc.exists()) {
              setCurrentGame({ id: gameDoc.id, ...gameDoc.data() });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user game:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGame();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  const navigateToAboutPage = () => navigation.navigate('AboutScreen');
  const navigateToCreateGame = () => navigation.navigate('CreateGameScreen');
  const navigateToJoinGame = () => navigation.navigate('JoinGameScreen');
  const navigateToPlayers = () => navigation.navigate('PlayersScreen', { gameId: currentGame.id });
  const navigateToTeams = () => navigation.navigate('TeamsScreen', { gameId: currentGame.id });

  const leaveGame = async () => {
    try {
      setLoading(true);
      const playerDocRef = doc(db, 'games', currentGame.id, 'players', auth.currentUser.uid);
      await deleteDoc(playerDocRef);

      const gameDocRef = doc(db, 'games', currentGame.id);
      const gameDoc = await getDoc(gameDocRef);
      if (gameDoc.exists()) {
        const gameData = gameDoc.data();
        await updateDoc(gameDocRef, { currentPlayers: gameData.currentPlayers - 1 });
      }

      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, { currentGameId: null });

      setCurrentGame(null);
      Alert.alert('Success', 'Left game successfully');
    } catch (error) {
      console.error('Error leaving game:', error);
      Alert.alert('Error', 'Failed to leave game.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!currentGame) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.emailText}>{auth.currentUser.email}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.mainButton} onPress={navigateToCreateGame}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.mainButtonText}>Create Game</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainButton} onPress={navigateToJoinGame}>
            <Ionicons name="enter-outline" size={24} color="#fff" />
            <Text style={styles.mainButtonText}>Join Game</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={navigateToAboutPage}>
            <Ionicons name="information-circle-outline" size={24} color="#666" />
            <Text style={styles.secondaryButtonText}>About Our App</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#666" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.gameHeader}>
        <Text style={styles.gameName}>{currentGame.name}</Text>
        <View style={styles.gameStatus}>
          <View style={styles.statusIndicator} />
          <Text style={styles.statusText}>Live Game</Text>
        </View>
      </View>

      <View style={styles.gameCard}>
        <Text style={styles.cardTitle}>Game Details</Text>
        <View style={styles.gameInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.gameDetail}>{currentGame.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.gameDetail}>
              {currentGame.currentPlayers}/{currentGame.maxPlayers} Players
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={navigateToPlayers}>
          <Ionicons name="people" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Players</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={navigateToTeams}>
          <Ionicons name="people-circle" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Teams</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.leaveButton]} 
          onPress={leaveGame}
        >
          <Ionicons name="exit" size={24} color="#ff4444" />
          <Text style={styles.leaveButtonText}>Leave</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#666" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    color: '#666',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    gap: 16,
  },
  mainButton: {
    backgroundColor: '#161616',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '600',
  },
  gameHeader: {
    marginTop: 40,
    marginBottom: 30,
  },
  gameName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  gameStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  gameCard: {
    backgroundColor: '#161616',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTitle: {
    color: '#666',
    fontSize: 16,
    marginBottom: 16,
  },
  gameInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gameDetail: {
    color: '#fff',
    fontSize: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#161616',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  actionButtonText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  leaveButton: {
    backgroundColor: '#1a0000',
  },
  leaveButtonText: {
    color: '#ff4444',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 'auto',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  logoutButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AuthenticatedScreen;