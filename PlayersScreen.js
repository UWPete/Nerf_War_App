// PlayersScreen.js

import React, { useEffect, useState } from 'react';
import { 
  FlatList, 
  Text, 
  StyleSheet, 
  View, 
  ActivityIndicator, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { db, auth } from './firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const PlayersScreen = ({ route }) => {
  const { gameId } = route.params;
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const playersQuery = query(
        collection(db, 'games', gameId, 'players'),
        orderBy('joinedAt', 'desc')
      );
      const querySnapshot = await getDocs(playersQuery);
      const playersList = querySnapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data(),
        isCurrentUser: doc.id === auth.currentUser.uid
      }));
      setPlayers(playersList);
      setError(null);
    } catch (error) {
      console.error('Error fetching players:', error);
      setError('Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [gameId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#4CAF50';
      case 'eliminated':
        return '#ff4444';
      case 'spectating':
        return '#3498db';
      default:
        return '#666';
    }
  };

  const PlayerCard = ({ player }) => (
    <View style={[
      styles.playerCard,
      player.isCurrentUser && styles.currentPlayerCard
    ]}>
      <View style={styles.playerInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {player.email?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        
        <View style={styles.playerDetails}>
          <Text style={styles.playerName}>
            {player.email?.split('@')[0]}
            {player.isCurrentUser && ' (You)'}
          </Text>
          <Text style={styles.playerEmail}>{player.email}</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={[
          styles.statusBadge, 
          { borderColor: getStatusColor(player.status) }
        ]}>
          <Text style={[
            styles.statusText,
            { color: getStatusColor(player.status) }
          ]}>
            {player.status || 'Unknown'}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ff4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchPlayers}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Players</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {players.length} Total • {players.filter(p => p.status === 'active').length} Active
          </Text>
        </View>
      </View>

      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PlayerCard player={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color="#666" />
            <Text style={styles.emptyText}>No players yet</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={fetchPlayers}
      >
        <Ionicons name="refresh" size={20} color="#666" />
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    backgroundColor: '#161616',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    color: '#666',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  playerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#161616',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  currentPlayerCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#1a3320',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  playerEmail: {
    color: '#666',
    fontSize: 14,
  },
  statusContainer: {
    marginLeft: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#333',
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 8,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#161616',
  },
  refreshText: {
    color: '#666',
    fontSize: 14,
  },
});

export default PlayersScreen;