// GameManagementScreen.js

import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import TeamsTab from './TeamsTab';
import PlayersTab from './PlayersTab';
import HubScreen from './HubScreen';

const Tab = createBottomTabNavigator();

const GameManagementScreen = ({ route }) => {
  const { gameName } = route.params;

  // State for managing teams and players
  const [teams, setTeams] = useState([]); // Example: [{ name: "Team A", players: [{ name: "Player 1", status: "in" }] }]
  const [playersOut, setPlayersOut] = useState(0);
  const [teamsOut, setTeamsOut] = useState(0);

  // Calculate dynamic totals whenever teams or their statuses change
  useEffect(() => {
    const totalTeamsOut = teams.filter((team) => team.status === 'out').length;
    const totalPlayersOut = teams.reduce(
      (sum, team) => sum + team.players.filter((player) => player.status === 'out').length,
      0
    );

    setTeamsOut(totalTeamsOut);
    setPlayersOut(totalPlayersOut);
  }, [teams]);

  // Calculate total stats
  const totalPlayers = teams.reduce((sum, team) => sum + team.players.length, 0);
  const totalTeams = teams.length;

  const playersInGame = totalPlayers - playersOut;
  const teamsInGame = totalTeams - teamsOut;

  return (
    <View style={styles.container}>
      {/* Game Dashboard */}
      <View style={styles.dashboard}>
        <Text style={styles.title}>{gameName}</Text>
        <Text style={styles.info}>
          Teams in Game: {teamsInGame} | Teams Out: {teamsOut}
        </Text>
        <Text style={styles.info}>
          Players in Game: {playersInGame} | Players Out: {playersOut}
        </Text>
      </View>

      {/* Bottom Tab Navigator */}
      <Tab.Navigator>
        <Tab.Screen
          name="Teams"
          children={() => (
            <TeamsTab
              teams={teams}
              setTeams={setTeams}
            />
          )}
        />
        <Tab.Screen
          name="Players"
          children={() => (
            <PlayersTab
              teams={teams}
              setTeams={setTeams}
            />
          )}
        />
        <Tab.Screen name="Hub" component={HubScreen} />
      </Tab.Navigator>
    </View>
  );
};

export default GameManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dashboard: {
    padding: 16,
    backgroundColor: '#3498db',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: '#fff',
  },
});
