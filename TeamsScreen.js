// TeamsScreen.js

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Alert,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal
} from 'react-native';
import { auth, db } from './firebaseConfig';
import { collection, getDocs, addDoc, doc, setDoc, query, orderBy } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const TeamsScreen = ({ route }) => {
  const { gameId } = route.params;
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const teamsQuery = query(
        collection(db, 'games', gameId, 'teams'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(teamsQuery);
      const teamsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTeams(teamsList);
      setError(null);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [gameId]);

  const joinTeam = async (teamId, teamName) => {
    Alert.alert(
      'Join Team',
      `Are you sure you want to join ${teamName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Join',
          onPress: async () => {
            try {
              setLoading(true);
              await setDoc(doc(db, 'games', gameId, 'teams', teamId, 'players', auth.currentUser.uid), {
                uid: auth.currentUser.uid,
                email: auth.currentUser.email,
                joinedAt: new Date(),
                status: 'active'
              });

              Alert.alert('Success', 'Joined team successfully!');
              fetchTeams();
            } catch (error) {
              console.error('Error joining team:', error);
              Alert.alert('Error', 'Failed to join team.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const createTeam = async () => {
    if (!newTeamName.trim()) {
      Alert.alert('Error', 'Please enter a team name');
      return;
    }

    try {
      setLoading(true);
      const teamDocRef = await addDoc(collection(db, 'games', gameId, 'teams'), {
        name: newTeamName.trim(),
        createdAt: new Date(),
        createdBy: auth.currentUser.uid,
        playerCount: 1
      });

      await setDoc(
        doc(db, 'games', gameId, 'teams', teamDocRef.id, 'players', auth.currentUser.uid),
        {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          joinedAt: new Date(),
          status: 'active',
          role: 'leader'
        }
      );

      Alert.alert('Success', 'Team created successfully!');
      setNewTeamName('');
      setIsCreateModalVisible(false);
      fetchTeams();
    } catch (error) {
      console.error('Error creating team:', error);
      Alert.alert('Error', 'Failed to create team.');
    } finally {
      setLoading(false);
    }
  };

  const TeamCard = ({ team }) => (
    <View style={styles.teamCard}>
      <View style={styles.teamInfo}>
        <View style={styles.teamIconContainer}>
          <Text style={styles.teamIcon}>
            {team.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.teamDetails}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Text style={styles.teamMeta}>
            {team.playerCount || 0} {team.playerCount === 1 ? 'Player' : 'Players'}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.joinButton}
        onPress={() => joinTeam(team.id, team.name)}
      >
        <Ionicons name="enter-outline" size={24} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );

  if (loading && teams.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Teams</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setIsCreateModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ff4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchTeams}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TeamCard team={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#666" />
              <Text style={styles.emptyText}>No teams yet</Text>
              <Text style={styles.emptySubtext}>Create the first team!</Text>
            </View>
          }
        />
      )}

      <Modal
        visible={isCreateModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Team</Text>
              <TouchableOpacity 
                onPress={() => setIsCreateModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Enter team name"
              placeholderTextColor="#666"
              value={newTeamName}
              onChangeText={setNewTeamName}
              style={styles.input}
            />

            <TouchableOpacity 
              style={[styles.createTeamButton, !newTeamName.trim() && styles.createTeamButtonDisabled]}
              onPress={createTeam}
              disabled={!newTeamName.trim()}
            >
              <Text style={styles.createTeamButtonText}>Create Team</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#161616',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  createButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#1a3320',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  listContainer: {
    padding: 16,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  teamInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  teamIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  teamDetails: {
    flex: 1,
  },
  teamName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  teamMeta: {
    color: '#666',
    fontSize: 14,
  },
  joinButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1a3320',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#161616',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  input: {
    backgroundColor: '#000',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  createTeamButton: {
    backgroundColor: '#4CAF50',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createTeamButtonDisabled: {
    backgroundColor: '#1a3320',
    opacity: 0.5,
  },
  createTeamButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 12,
    backgroundColor: '#161616',
    borderRadius: 8,
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
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 16,
    marginTop: 8,
  },
});

export default TeamsScreen;