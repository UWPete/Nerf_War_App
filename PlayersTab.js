// PlayersTab.js

import React, { useState } from 'react';
import { View, FlatList, TextInput, Button, Text, Alert, StyleSheet, Picker } from 'react-native';

const PlayersTab = ({ teams, setTeams }) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  const addPlayer = () => {
    if (!playerName || !selectedTeam) {
      Alert.alert('Error', 'Please enter a player name and select a team.');
      return;
    }

    const updatedTeams = teams.map((team) => {
      if (team.name === selectedTeam) {
        return {
          ...team,
          players: [...team.players, { name: playerName, status: 'in' }],
        };
      }
      return team;
    });

    setTeams(updatedTeams);
    setPlayerName('');
    setSelectedTeam('');
  };

  const togglePlayerStatus = (teamIndex, playerIndex) => {
    const updatedTeams = [...teams];
    const player = updatedTeams[teamIndex].players[playerIndex];
    player.status = player.status === 'in' ? 'out' : 'in';
    setTeams(updatedTeams);
  };

  const renderPlayer = (team, teamIndex) =>
    team.players.map((player, playerIndex) => (
      <View key={`${teamIndex}-${playerIndex}`} style={styles.itemContainer}>
        <Text>{player.name}</Text>
        <Text>Status: {player.status === 'in' ? 'Active' : 'Eliminated'}</Text>
        <Button
          title={player.status === 'in' ? 'Eliminate' : 'Reinstate'}
          color="#e74c3c"
          onPress={() => togglePlayerStatus(teamIndex, playerIndex)}
        />
      </View>
    ));

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Player Name"
        value={playerName}
        onChangeText={setPlayerName}
        style={styles.input}
      />
      <Picker
        selectedValue={selectedTeam}
        onValueChange={(value) => setSelectedTeam(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select a Team" value="" />
        {teams.map((team) => (
          <Picker.Item key={team.name} label={team.name} value={team.name} />
        ))}
      </Picker>
      <Button title="Add Player" onPress={addPlayer} />
      <FlatList
        data={teams}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => renderPlayer(item, index)}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default PlayersTab;

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
  picker: {
    height: 50,
    marginBottom: 16,
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
