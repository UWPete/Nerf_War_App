// CreateGameScreen.js

import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

const CreateGameScreen = () => {
  const [gameName, setGameName] = useState('');
  const [location, setLocation] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('12');
  const [gamePassword, setGamePassword] = useState('');
  const [rulesVisible, setRulesVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const rulesList = [
    'Players must use approved Nerf guns only',
    'No shooting in school buildings or during school hours',
    'Shots must be from a distance of 15 feet or greater',
    'No shooting at players who are driving or at work',
    'Players must record their eliminations in the app',
    'No modifications to Nerf guns or ammunition',
    'Players must wear safety glasses during gameplay',
    'Eliminated players cannot interfere with active gameplay',
    'Be respectful of non-players and private property',
    'Have fun and play fairly!'
  ];

  const createGame = async () => {
    if (!gameName.trim()) {
      Alert.alert('Error', 'Please enter a game name.');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location.');
      return;
    }

    if (!gamePassword || gamePassword.length < 6 || gamePassword.length > 20) {
      Alert.alert('Error', 'Password must be between 6 and 20 characters.');
      return;
    }

    if (!maxPlayers || isNaN(maxPlayers) || Number(maxPlayers) < 2) {
      Alert.alert('Error', 'Please enter a valid number of players (minimum 2)');
      return;
    }

    try {
      setLoading(true);

      const gameData = {
        name: gameName.trim(),
        location: location.trim(),
        password: gamePassword,
        maxPlayers: parseInt(maxPlayers),
        currentPlayers: 1,
        hostId: auth.currentUser.uid,
        hostEmail: auth.currentUser.email,
        createdAt: new Date(),
        status: 'waiting',
        rules: rulesList
      };

      const gameRef = await addDoc(collection(db, 'games'), gameData);

      // Add host as first player
      await addDoc(collection(db, 'games', gameRef.id, 'players'), {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        role: 'host',
        status: 'active',
        joinedAt: new Date()
      });

      navigation.navigate('GameManagementScreen', { gameId: gameRef.id });
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
          <Text style={styles.title}>Create New Game</Text>
          <Text style={styles.subtitle}>Set up your Senior Assassin match</Text>
        </View>

        <View style={styles.card}>
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
            <Text style={styles.label}>Game Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Enter game password (6-20 characters)"
                placeholderTextColor="#666"
                value={gamePassword}
                onChangeText={setGamePassword}
                secureTextEntry={!isPasswordVisible}
                style={[styles.input, styles.passwordInput]}
                maxLength={20}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.passwordToggle}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
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

          <TouchableOpacity
            style={styles.rulesButton}
            onPress={() => setRulesVisible(true)}
          >
            <Ionicons name="shield-checkmark-outline" size={24} color="#4CAF50" />
            <Text style={styles.rulesButtonText}>View Official Rules</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.createButton,
            (!gameName.trim() || !location.trim() || !gamePassword) && styles.createButtonDisabled
          ]}
          onPress={createGame}
          disabled={!gameName.trim() || !location.trim() || !gamePassword}
        >
          <Text style={styles.createButtonText}>Create Game</Text>
        </TouchableOpacity>

        <Modal
          visible={rulesVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setRulesVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Official Rules</Text>
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => setRulesVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.rulesList}>
                {rulesList.map((rule, index) => (
                  <View key={index} style={styles.ruleItem}>
                    <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
                    <Text style={styles.ruleText}>{rule}</Text>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => setRulesVisible(false)}
              >
                <Text style={styles.acceptButtonText}>I Understand</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContainer: {
    padding: 20,
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
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
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
    backgroundColor: '#000',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  rulesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  rulesButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#161616',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeIcon: {
    padding: 4,
  },
  rulesList: {
    marginBottom: 20,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  ruleText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateGameScreen;