// StartGameScreen.js

import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { db, auth } from './firebaseConfig';
import { collection, addDoc } from '@firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const StartGameScreen = () => {
  const [gameName, setGameName] = useState('');
  const [location, setLocation] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('12');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const validateForm = () => {
    if (!gameName.trim()) {
      Alert.alert('Error', 'Please enter a game name');
      return false;
    }
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return false;
    }
    if (!maxPlayers || isNaN(maxPlayers) || Number(maxPlayers) < 2) {
      Alert.alert('Error', 'Please enter a valid number of players (minimum 2)');
      return false;
    }
    return true;
  };

  const startGame = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const gameData = {
        name: gameName.trim(),
        location: location.trim(),
        maxPlayers: Number(maxPlayers),
        currentPlayers: 1,
        hostId: auth.currentUser.uid,
        hostEmail: auth.currentUser.email,
        createdAt: new Date(),
        status: 'waiting',
        rules: [
          'No shooting within 15 feet',
          'Wear eye protection',
          'No shooting at head/face',
          'No physical contact',
          'Record all eliminations'
        ]
      };

      const docRef = await addDoc(collection(db, 'games'), gameData);
      
      // Add host as first player
      await addDoc(collection(db, 'games', docRef.id, 'players'), {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        role: 'host',
        status: 'active',
        joinedAt: new Date()
      });

      navigation.navigate('GameScreen', { gameId: docRef.id });
    } catch (error) {
      console.error('Error creating game:', error);
      Alert.alert('Error', 'Failed to create game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Creating game...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#666" />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Start New Game</Text>
            <Text style={styles.subtitle}>Create your Senior Assassin match</Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Game Name</Text>
            <TextInput
              placeholder="e.g., Class of 2024 Senior Assassin"
              placeholderTextColor="#666"
              value={gameName}
              onChangeText={setGameName}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              placeholder="e.g., Downtown Area"
              placeholderTextColor="#666"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Maximum Players</Text>
            <TextInput
              placeholder="Enter number of players"
              placeholderTextColor="#666"
              value={maxPlayers}
              onChangeText={setMaxPlayers}
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#4CAF50" />
            <Text style={styles.infoText}>
              As the game host, you'll be responsible for managing players and enforcing rules. 
              Make sure all participants understand and agree to the game rules.
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.startButton}
          onPress={startGame}
        >
          <Ionicons name="play" size={24} color="#fff" />
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  scrollContainer: {
    flexGrow: 1,
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#161616',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#1a3320',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
    gap: 12,
  },
  infoText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    height: 56,
    marginHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 20,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default StartGameScreen;