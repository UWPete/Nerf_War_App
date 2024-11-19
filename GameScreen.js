// GameScreen.js

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const GameScreen = ({ route, navigation }) => {
  const { gameId } = route.params;

  const navigateToPlayers = () => {
    navigation.navigate('PlayersScreen', { gameId });
  };

  const navigateToTeams = () => {
    navigation.navigate('TeamsScreen', { gameId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game ID: {gameId}</Text>
      <Button title="View Players" onPress={navigateToPlayers} />
      <Button title="View Teams" onPress={navigateToTeams} />
      {/* Add more game-related functionalities here */}
    </View>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});
