// TeamsScreen.js

import React, { useEffect, useState } from 'react';
import { FlatList, Text, Button, StyleSheet, View, TextInput, Alert } from 'react-native';
import { auth, db } from './firebaseConfig';
import { collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';

const TeamsScreen = ({ route }) => {
  const { gameId } = route.params;
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'games', gameId, 'teams'));
        const teamsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTeams(teamsList);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, [gameId]);

  const joinTeam = async (teamId) => {
    try {
      await setDoc(doc(db, 'games', gameId, 'teams', teamId, 'players', auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        joinedAt: new Date(),
      });

      Alert.alert('Success', 'Joined team successfully!');
    } catch (error) {
      console.error('Error joining team:', error);
      Alert.alert('Error', 'Failed to join team.');
    }
  };

  const createTeam = async () => {
    try {
      const teamDocRef = await addDoc(collection(db, 'games', gameId, 'teams'), {
        name: newTeamName,
        createdAt: new Date(),
      });

      // Add user to the newly created team
      await setDoc(
        doc(db, 'games', gameId, 'teams', teamDocRef.id, 'players', auth.currentUser.uid),
        {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          joinedAt: new Date(),
        }
      );

      Alert.alert('Success', 'Team created and joined successfully!');
      setNewTeamName('');
    } catch (error) {
      console.error('Error creating team:', error);
      Alert.alert('Error', 'Failed to create team.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>{item.name}</Text>
      <Button title="Join Team" onPress={() => joinTeam(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="New Team Name"
        value={newTeamName}
        onChangeText={setNewTeamName}
        style={styles.input}
      />
      <Button title="Create Team" onPress={createTeam} />

      <FlatList
        data={teams}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default TeamsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    marginTop: 16,
  },
  itemContainer: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
  },
});
