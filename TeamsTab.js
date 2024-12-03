// TeamsTab.js

import React, { useState } from 'react';
import { 
  View, 
  FlatList, 
  TextInput, 
  Text, 
  Alert, 
  StyleSheet, 
  TouchableOpacity,
  Modal,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TeamsTab = ({ teams, setTeams }) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const addTeam = () => {
    if (!newTeamName.trim()) {
      Alert.alert('Error', 'Please enter a team name.');
      return;
    }

    setTeams([...teams, { 
      name: newTeamName.trim(), 
      players: [], 
      status: 'active',
      createdAt: new Date()
    }]);
    setNewTeamName('');
    setIsModalVisible(false);
  };

  const toggleTeamStatus = (index) => {
    Alert.alert(
      'Confirm Status Change',
      `Are you sure you want to ${teams[index].status === 'active' ? 'eliminate' : 'reinstate'} this team?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setLoading(true);
            setTimeout(() => {
              const updatedTeams = [...teams];
              updatedTeams[index].status = updatedTeams[index].status === 'active' ? 'eliminated' : 'active';
              setTeams(updatedTeams);
              setLoading(false);
            }, 500);
          }
        }
      ]
    );
  };

  const deleteTeam = (index) => {
    Alert.alert(
      'Delete Team',
      'Are you sure you want to delete this team? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedTeams = [...teams];
            updatedTeams.splice(index, 1);
            setTeams(updatedTeams);
          }
        }
      ]
    );
  };

  const TeamCard = ({ team, index }) => (
    <View style={[
      styles.teamCard,
      team.status === 'eliminated' && styles.eliminatedTeam
    ]}>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteTeam(index)}
      >
        <Ionicons name="trash-outline" size={16} color="#ff4444" />
      </TouchableOpacity>

      <View style={styles.teamInfo}>
        <View style={[
          styles.teamIconContainer,
          team.status === 'eliminated' && styles.eliminatedIcon
        ]}>
          <Text style={styles.teamIcon}>
            {team.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.teamDetails}>
          <Text style={styles.teamName}>{team.name}</Text>
          <View style={styles.statsRow}>
            <Text style={[
              styles.statusBadge,
              team.status === 'active' ? styles.activeBadge : styles.eliminatedBadge
            ]}>
              {team.status === 'active' ? 'Active' : 'Eliminated'}
            </Text>
            <Text style={styles.playerCount}>
              {team.players.length} Players
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.actionButton,
          team.status === 'active' ? styles.eliminateButton : styles.reinstateButton
        ]}
        onPress={() => toggleTeamStatus(index)}
      >
        <Ionicons 
          name={team.status === 'active' ? 'close-circle' : 'refresh-circle'} 
          size={24} 
          color={team.status === 'active' ? '#ff4444' : '#4CAF50'} 
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Teams</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loading} />
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TeamCard team={item} index={index} />
          )}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#666" />
              <Text style={styles.emptyText}>No teams yet</Text>
              <Text style={styles.emptySubtext}>Create your first team</Text>
            </View>
          }
        />
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Team</Text>
              <TouchableOpacity 
                onPress={() => setIsModalVisible(false)}
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
              autoFocus
            />

            <TouchableOpacity 
              style={[
                styles.createButton,
                !newTeamName.trim() && styles.createButtonDisabled
              ]}
              onPress={addTeam}
              disabled={!newTeamName.trim()}
            >
              <Text style={styles.createButtonText}>Create Team</Text>
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
  addButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#1a3320',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  loading: {
    padding: 20,
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
  eliminatedTeam: {
    opacity: 0.7,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    zIndex: 1,
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
    backgroundColor: '#1a3320',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  eliminatedIcon: {
    backgroundColor: '#331a1a',
    borderColor: '#ff4444',
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
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  activeBadge: {
    backgroundColor: '#1a3320',
    color: '#4CAF50',
  },
  eliminatedBadge: {
    backgroundColor: '#331a1a',
    color: '#ff4444',
  },
  playerCount: {
    color: '#666',
    fontSize: 14,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  eliminateButton: {
    backgroundColor: '#331a1a',
  },
  reinstateButton: {
    backgroundColor: '#1a3320',
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
  createButton: {
    backgroundColor: '#4CAF50',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#1a3320',
    opacity: 0.5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
});

export default TeamsTab;