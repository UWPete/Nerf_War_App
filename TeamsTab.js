// TeamsTab.js

import React, { useState } from 'react';
import { View, FlatList, TextInput, Button, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';

const TeamsTab = ({ teams, setTeams }) => {
  const [newTeamName, setNewTeamName] = useState('');

  const addTeam = () => {
    if (!newTeamName) {
      Alert.alert('Error', 'Please enter a team name.');
      return;
    }

    setTeams([...teams, { name: newTeamName, players: [], status: 'in' }]);
    setNewTeamName('');
  };

  const toggleTeamStatus = (index) => {
    const updatedTeams = [...teams];
    updatedTeams[index].status = updatedTeams[index].status === 'in' ? 'out' : 'in';
    setTeams(updatedTeams);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.teamName}>{item.name}</Text>
      <Text>Status: {item.status === 'in' ? 'Active' : 'Eliminated'}</Text>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => toggleTeamStatus(index)}
      >
        <Text style={styles.toggleText}>
          {item.status === 'in' ? 'Eliminate' : 'Reinstate'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Team Name"
        value={newTeamName}
        onChangeText={setNewTeamName}
        style={styles.input}
      />
      <Button title="Add Team" onPress={addTeam} />
      <FlatList
        data={teams}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default TeamsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
  },
  listContainer: {
    marginTop: 16,
  },
  itemContainer: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#e74c3c',
    borderRadius: 4,
  },
  toggleText: {
    color: '#fff',
    textAlign: 'center',
  },
});
