// TeamsTab.js

import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Button, Alert, TextInput } from 'react-native';
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const TeamsTab = ({ route }) => {
  const { gameId } = route.params;
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');

  const fetchTeams = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'games', gameId, 'teams'));
      const teamsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTeams(teamsList);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [gameId]);

  // Function to add a team
  const addTeam = async () => {
    if (!teamName) {
      Alert.alert('Error', 'Please enter a team name.');
      return;
    }

    try {
      await addDoc(collection(db, 'games', gameId, 'teams'), {
        name: teamName,
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Team added successfully!');
      setTeamName('');
      // Refresh the teams list
      fetchTeams();
    } catch (error) {
      console.error('Error adding team:', error);
      Alert.alert('Error', 'Failed to add team.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Team Name"
        value={teamName}
        onChangeText={setTeamName}
        style={styles.input}
      />
      <Button title="Add Team" onPress={addTeam} />
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id}
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
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
