// AuthenticatedScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { auth, db } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const AuthenticatedScreen = () => {
  const navigation = useNavigation();
  const [currentGame, setCurrentGame] = useState(null);

  useEffect(() => {
    const fetchUserGame = async () => {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.currentGameId) {
            // User is part of a game, fetch game data
            const gameDocRef = doc(db, 'games', userData.currentGameId);
            const gameDoc = await getDoc(gameDocRef);
            if (gameDoc.exists()) {
              setCurrentGame({ id: gameDoc.id, ...gameDoc.data() });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user game:', error);
      }
    };

    fetchUserGame();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully!');
      // Navigation is handled by App.js
    } catch (error) {
      console.error('Logout error:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  const navigateToCreateGame = () => {
    navigation.navigate('CreateGameScreen');
  };

  const navigateToJoinGame = () => {
    navigation.navigate('JoinGameScreen');
  };

  const navigateToPlayers = () => {
    navigation.navigate('PlayersScreen', { gameId: currentGame.id });
  };

  const navigateToTeams = () => {
    navigation.navigate('TeamsScreen', { gameId: currentGame.id });
  };

  const leaveGame = async () => {
    try {
      // Remove user from the game's players collection
      const playerDocRef = doc(db, 'games', currentGame.id, 'players', auth.currentUser.uid);
      await deleteDoc(playerDocRef);

      // Update game's currentPlayers count
      const gameDocRef = doc(db, 'games', currentGame.id);
      const gameDoc = await getDoc(gameDocRef);
      if (gameDoc.exists()) {
        const gameData = gameDoc.data();
        await updateDoc(gameDocRef, { currentPlayers: gameData.currentPlayers - 1 });
      }

      // Update user's currentGameId to null
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, { currentGameId: null });

      setCurrentGame(null);

      Alert.alert('Left Game', 'You have left the game.');
    } catch (error) {
      console.error('Error leaving game:', error);
      Alert.alert('Error', 'Failed to leave game.');
    }
  };

  if (!currentGame) {
    // User is not in a game, show options to create or join a game
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome, {auth.currentUser.email}!</Text>
        <TouchableOpacity style={styles.button} onPress={navigateToCreateGame}>
          <Text style={styles.buttonText}>Create Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToJoinGame}>
          <Text style={styles.buttonText}>Join Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // User is in a game, show game info and options
  return (
    <View style={styles.container}>
      <Text style={styles.gameName}>{currentGame.name}</Text>

      <View style={styles.gameInfo}>
        <Text style={styles.gameDetail}>Location: {currentGame.location}</Text>
        <Text style={styles.gameDetail}>
          Players: {currentGame.currentPlayers}/{currentGame.maxPlayers}
        </Text>
      </View>

      <View style={styles.iconRow}>
        <TouchableOpacity style={styles.iconButton} onPress={navigateToPlayers}>
          <Text style={styles.iconLabel}>Players</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={navigateToTeams}>
          <Text style={styles.iconLabel}>Teams</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={leaveGame}>
          <Text style={styles.iconLabel}>Leave</Text>
        </TouchableOpacity>
      </View>

      {/* Additional game-related info can be added here */}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthenticatedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    marginHorizontal: 40,
    marginVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    marginHorizontal: 40,
    marginVertical: 30,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  topImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  gameName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginVertical: 20,
  },
  gameInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gameDetail: {
    fontSize: 18,
    color: '#34495e',
    marginVertical: 5,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  iconButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
  },
  iconLabel: {
    color: '#3498db',
    fontSize: 16,
  },
});
