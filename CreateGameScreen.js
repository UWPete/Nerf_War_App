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
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CreateGameScreen = () => {
  const [gameName, setGameName] = useState('');
  const [rulesVisible, setRulesVisible] = useState(false);
  const navigation = useNavigation();

  const createGame = () => {
    if (!gameName) {
      Alert.alert('Error', 'Please enter a game name.');
      return;
    }
    navigation.navigate('GameManagementScreen', { gameName });
  };

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

          <TouchableOpacity 
            style={styles.rulesButton} 
            onPress={() => setRulesVisible(true)}
          >
            <Ionicons name="shield-checkmark-outline" size={24} color="#4CAF50" />
            <Text style={styles.rulesButtonText}>View Official Rules</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={createGame}>
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
  scrollContainer: {
    padding: 20,
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