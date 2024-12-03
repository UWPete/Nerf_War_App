// GameScreen.js

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const GameScreen = ({ route, navigation }) => {
  const { gameId } = route.params;
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameData();
  }, []);

  const fetchGameData = async () => {
    try {
      const gameDoc = await getDoc(doc(db, 'games', gameId));
      if (gameDoc.exists()) {
        setGameData({ id: gameDoc.id, ...gameDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching game:', error);
      Alert.alert('Error', 'Failed to load game data');
    } finally {
      setLoading(false);
    }
  };

  const NavigationCard = ({ title, subtitle, icon, onPress }) => (
    <TouchableOpacity style={styles.navCard} onPress={onPress}>
      <View style={styles.navIconContainer}>
        <Ionicons name={icon} size={24} color="#4CAF50" />
      </View>
      <View style={styles.navContent}>
        <Text style={styles.navTitle}>{title}</Text>
        <Text style={styles.navSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );

  const StatusBadge = ({ status }) => (
    <View style={[styles.statusBadge, 
      status === 'active' ? styles.activeBadge : styles.waitingBadge
    ]}>
      <View style={[styles.statusDot, 
        status === 'active' ? styles.activeDot : styles.waitingDot
      ]} />
      <Text style={[styles.statusText, 
        status === 'active' ? styles.activeText : styles.waitingText
      ]}>
        {status === 'active' ? 'Active' : 'Waiting'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.title}>Game Dashboard</Text>
      </View>

      <ScrollView style={styles.content}>
        {gameData && (
          <>
            <View style={styles.gameInfoCard}>
              <View style={styles.gameHeader}>
                <Text style={styles.gameName}>{gameData.name}</Text>
                <StatusBadge status={gameData.status || 'waiting'} />
              </View>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {gameData.currentPlayers || 0}/{gameData.maxPlayers || 0}
                  </Text>
                  <Text style={styles.statLabel}>Players</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{gameData.location}</Text>
                  <Text style={styles.statLabel}>Location</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Game Management</Text>

            <NavigationCard
              title="Players"
              subtitle="Manage participants"
              icon="people"
              onPress={() => navigation.navigate('PlayersScreen', { gameId })}
            />

            <NavigationCard
              title="Teams"
              subtitle="Organize teams"
              icon="people-circle"
              onPress={() => navigation.navigate('TeamsScreen', { gameId })}
            />

            <NavigationCard
              title="Location"
              subtitle="View game boundaries"
              icon="location"
              onPress={() => navigation.navigate('LocationScreen', { gameId })}
            />

            <NavigationCard
              title="Rules"
              subtitle="Game guidelines"
              icon="book"
              onPress={() => navigation.navigate('RulesScreen', { gameId })}
            />
          </>
        )}
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#161616',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  gameInfoCard: {
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  gameName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  activeBadge: {
    backgroundColor: '#1a3320',
    borderColor: '#4CAF50',
  },
  waitingBadge: {
    backgroundColor: '#1a1a3a',
    borderColor: '#3498db',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  activeDot: {
    backgroundColor: '#4CAF50',
  },
  waitingDot: {
    backgroundColor: '#3498db',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeText: {
    color: '#4CAF50',
  },
  waitingText: {
    color: '#3498db',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#333',
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a3320',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  navContent: {
    flex: 1,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  navSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default GameScreen;