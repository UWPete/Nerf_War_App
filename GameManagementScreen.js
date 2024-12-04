// GameManagementScreen.js

import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TeamsTab from './TeamsTab';
import PlayersTab from './PlayersTab';
import HubScreen from './HubScreen';
import StatsTab from './StatsTab'; // Import the new StatsTab
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

const Tab = createBottomTabNavigator();

const GameManagementScreen = ({ route }) => {
  const { gameName } = route.params;
  const navigation = useNavigation();

  const [teams, setTeams] = useState([]);
  const [playersOut, setPlayersOut] = useState(0);
  const [teamsOut, setTeamsOut] = useState(0);
  const [gameLocation, setGameLocation] = useState(null);

  useEffect(() => {
    const totalTeamsOut = teams.filter((team) => team.status === 'eliminated').length;
    const totalPlayersOut = teams.reduce(
      (sum, team) => sum + team.players.filter((player) => player.status === 'eliminated').length,
      0
    );

    setTeamsOut(totalTeamsOut);
    setPlayersOut(totalPlayersOut);
  }, [teams]);

  useEffect(() => {
    // Get location when the game is created
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setGameLocation(currentLocation.coords);
    })();
  }, []);

  const totalPlayers = teams.reduce((sum, team) => sum + team.players.length, 0);
  const totalTeams = teams.length;
  const playersInGame = totalPlayers - playersOut;
  const teamsInGame = totalTeams - teamsOut;

  const StatCard = ({ title, value, total, color }) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statTotal}>of {total}</Text>
    </View>
  );

  const DashboardHeader = () => (
    <View style={styles.dashboard}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>{gameName}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('AuthenticatedScreen')}
        >
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          title="Active Players"
          value={playersInGame}
          total={totalPlayers}
          color="#4CAF50"
        />
        <StatCard
          title="Active Teams"
          value={teamsInGame}
          total={totalTeams}
          color="#4CAF50"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <DashboardHeader />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: {
            backgroundColor: '#161616',
            borderTopColor: '#333',
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#666',
          headerStyle: {
            backgroundColor: '#161616',
            borderBottomColor: '#333',
            borderBottomWidth: 1,
          },
          headerTintColor: '#fff',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Teams') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Players') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Hub') {
              iconName = focused ? 'grid' : 'grid-outline';
            } else if (route.name === 'Stats') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Teams"
          children={() => <TeamsTab teams={teams} setTeams={setTeams} />}
          options={{ title: 'Teams' }}
        />
        <Tab.Screen
          name="Players"
          children={() => <PlayersTab teams={teams} setTeams={setTeams} />}
          options={{ title: 'Players' }}
        />
        <Tab.Screen
          name="Hub"
          children={() => <HubScreen route={{ params: { gameLocation } }} />}
          options={{ title: 'Game Hub' }}
        />
        <Tab.Screen
          name="Stats"
          children={() => <StatsTab teams={teams} />}
          options={{ title: 'Stats' }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  dashboard: {
    backgroundColor: '#161616',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTotal: {
    fontSize: 12,
    color: '#666',
  },
});

export default GameManagementScreen;
