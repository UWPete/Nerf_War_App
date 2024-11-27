// CreateGameScreen.js

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CreateGameScreen = () => {
  const [gameName, setGameName] = useState('');
  const [rulesVisible, setRulesVisible] = useState(false);
  const navigation = useNavigation();

  const createGame = () => {
    if (!gameName) {
      Alert.alert('Error', 'Please enter a game name.');
      return;
    }
    // After validation, navigate to GameManagementScreen
    navigation.navigate('GameManagementScreen', { gameName });
  };

  // Just a generic list, can be changed as we see fit
  const rulesList = [
    'Rule 1: Respect all players.',
    'Rule 2: Follow the instructions given by the game admin.',
    'Rule 3: No cheating or unfair play.',
    'Rule 4: Keep the game environment friendly.',
    'Rule 5: Have fun and enjoy the game!',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Game</Text>
      <TouchableOpacity style={styles.rulesButton} onPress={() => setRulesVisible(true)}>
        <Text style={styles.buttonText}>Rules</Text>
      </TouchableOpacity>
      {/* Modal for displaying rules */}
      <Modal
        visible={rulesVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRulesVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Game Rules</Text>
            <ScrollView>
              {rulesList.map((rule, index) => (
                <Text key={index} style={styles.ruleItem}>
                  {rule}
                </Text>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setRulesVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TextInput
        placeholder="Game Name"
        value={gameName}
        onChangeText={setGameName}
        style={styles.input}
      />

      <TouchableOpacity style={styles.createButton} onPress={createGame}>
        <Text style={styles.buttonText}>Create Game</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateGameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  createButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  rulesButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ruleItem: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
});
