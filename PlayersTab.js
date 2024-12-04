// PlayersTab.js

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
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PlayersTab = ({ teams, setTeams }) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isTeamSelectorVisible, setIsTeamSelectorVisible] = useState(false);

  const addPlayer = () => {
    if (!playerName || !selectedTeam) {
      Alert.alert('Error', 'Please enter a player name and select a team.');
      return;
    }

    const updatedTeams = teams.map((team) => {
      if (team.name === selectedTeam) {
        return {
          ...team,
          players: [...team.players, { name: playerName, status: 'active' }],
        };
      }
      return team;
    });

    setTeams(updatedTeams);
    setPlayerName('');
    setSelectedTeam('');
  };

  const togglePlayerStatus = (teamIndex, playerIndex) => {
    Alert.alert(
      'Confirm Status Change',
      'Are you sure you want to change this player\'s status?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => {
            setTeams(prevTeams => {
              return prevTeams.map((team, tIndex) => {
                if (tIndex === teamIndex) {
                  return {
                    ...team,
                    players: team.players.map((player, pIndex) => {
                      if (pIndex === playerIndex) {
                        return {
                          ...player,
                          status: player.status === 'active' ? 'eliminated' : 'active',
                        };
                      }
                      return player;
                    }),
                  };
                }
                return team;
              });
            });
          }
        }
      ]
    );
  };

  const PlayerCard = ({ player, teamIndex, playerIndex }) => (
    <View style={styles.playerCard}>
      <View style={styles.playerInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {player.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.playerDetails}>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={[
            styles.statusText,
            { color: player.status === 'active' ? '#4CAF50' : '#ff4444' }
          ]}>
            {player.status === 'active' ? 'Active' : 'Eliminated'}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.actionButton,
          { backgroundColor: player.status === 'active' ? '#331a1a' : '#1a3320' }
        ]}
        onPress={() => togglePlayerStatus(teamIndex, playerIndex)}
      >
        <Ionicons 
          name={player.status === 'active' ? 'close-circle' : 'checkmark-circle'} 
          size={24} 
          color={player.status === 'active' ? '#ff4444' : '#4CAF50'} 
        />
      </TouchableOpacity>
    </View>
  );

  const TeamSection = ({ team, teamIndex }) => (
    <View style={styles.teamSection}>
      <Text style={styles.teamName}>{team.name}</Text>
      {team.players.map((player, playerIndex) => (
        <PlayerCard 
          key={`${teamIndex}-${playerIndex}`}
          player={player}
          teamIndex={teamIndex}
          playerIndex={playerIndex}
        />
      ))}
    </View>
  );

  const TeamSelectorModal = () => (
    <Modal
      visible={isTeamSelectorVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsTeamSelectorVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Team</Text>
            <TouchableOpacity 
              onPress={() => setIsTeamSelectorVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.teamList}>
            {teams.map((team, index) => (
              <TouchableOpacity
                key={index}
                style={styles.teamOption}
                onPress={() => {
                  setSelectedTeam(team.name);
                  setIsTeamSelectorVisible(false);
                }}
              >
                <Text style={styles.teamOptionText}>{team.name}</Text>
                {selectedTeam === team.name && (
                  <Ionicons name="checkmark" size={24} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Players</Text>
      </View>

      <View style={styles.addPlayerSection}>
        <TextInput
          placeholder="Player Name"
          placeholderTextColor="#666"
          value={playerName}
          onChangeText={setPlayerName}
          style={styles.input}
        />

        <TouchableOpacity 
          style={styles.teamSelector}
          onPress={() => setIsTeamSelectorVisible(true)}
        >
          <Text style={[
            styles.teamSelectorText,
            !selectedTeam && { color: '#666' }
          ]}>
            {selectedTeam || 'Select Team'}
          </Text>
          <Ionicons name="chevron-down" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.addButton, !playerName || !selectedTeam ? styles.addButtonDisabled : null]}
          onPress={addPlayer}
          disabled={!playerName || !selectedTeam}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Player</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={teams}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TeamSection team={item} teamIndex={index} />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color="#666" />
            <Text style={styles.emptyText}>No teams available</Text>
            <Text style={styles.emptySubtext}>Please add teams to manage players.</Text>
          </View>
        }
      />

      <TeamSelectorModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    backgroundColor: '#161616',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addPlayerSection: {
    padding: 16,
    backgroundColor: '#161616',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  input: {
    height: 50,
    backgroundColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  teamSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  teamSelectorText: {
    color: '#fff',
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    height: 50,
    borderRadius: 8,
    gap: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#1a3320',
    opacity: 0.5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  teamSection: {
    marginBottom: 24,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  playerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '600',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 12,
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
    padding: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  teamList: {
    marginBottom: 16,
  },
  teamOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  teamOptionText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    padding: 8,
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
    textAlign: 'center',
  },
});

export default PlayersTab;
