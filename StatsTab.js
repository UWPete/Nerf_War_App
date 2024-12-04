// StatsTab.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StatsTab = ({ teams }) => {
  const [sortedTeams, setSortedTeams] = useState([]);

  useEffect(() => {
    // Calculate team points based on player kills
    const teamsWithPoints = teams.map((team) => {
      const teamPoints = team.players.reduce(
        (sum, player) => sum + (player.kills || 0),
        0
      );
      return { ...team, points: teamPoints };
    });

    // Sort teams by points in descending order
    const sorted = teamsWithPoints.sort(
      (a, b) => b.points - a.points
    );

    setSortedTeams(sorted);
  }, [teams]);

  const TeamCard = ({ team, rank }) => (
    <View style={styles.teamCard}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>#{rank}</Text>
      </View>
      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.teamPoints}>
          {team.points} {team.points === 1 ? 'Point' : 'Points'}
        </Text>
        <View style={styles.playersList}>
          {team.players.map((player) => (
            <View
              key={player.name}
              style={styles.playerRow}
            >
              <Text style={styles.playerName}>
                {player.name}
              </Text>
              <Text style={styles.playerKills}>
                {player.kills || 0}{' '}
                {player.kills === 1 ? 'Kill' : 'Kills'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedTeams}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => (
          <TeamCard team={item} rank={index + 1} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="trophy-outline"
              size={48}
              color="#666"
            />
            <Text style={styles.emptyText}>
              No teams available
            </Text>
            <Text style={styles.emptySubtext}>
              Add teams to see the leaderboard
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  teamCard: {
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankContainer: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  teamPoints: {
    color: '#4CAF50',
    fontSize: 16,
    marginBottom: 8,
  },
  playersList: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 8,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
  },
  playerKills: {
    color: '#4CAF50',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
    fontWeight: 'bold',
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
});

export default StatsTab;
