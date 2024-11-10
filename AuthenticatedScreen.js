// AuthenticatedScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AuthenticatedScreen = ({ user, handleAuthentication }) => {

    const showRulesNotification = () => {
        Alert.alert(
          "Game Rules",
          "Here are the rules for the game:\n\n1. Rule One\n2. Rule Two\n3. Rule Three",
          [{ text: "OK", onPress: () => console.log("Rules acknowledged") }]
        );
      };

  return (
    <View style={styles.container}>
      {/* Image at the top */}
      <Image
        source={{ uri: 'https://example.com/your-image-url.jpg' }} // Replace with your image URL or local image
        style={styles.topImage}
      />
      <Text style={styles.headerText}>Palm Beach High</Text>

      <View style={styles.purgeBanner}>
        <Text style={styles.purgeText}>Purge starts Wed, Jan 10 at 3:50pm</Text>
      </View>

      <View style={styles.roundInfo}>
        <Text style={styles.roundTitle}>Round 5</Text>
        <Text style={styles.roundDates}>Tue, Jan 9 ➔ Wed, Jan 10</Text>
        <Text style={styles.playerCount}>11 Players Remain</Text>
      </View>

      <View style={styles.iconRow}>
         <TouchableOpacity style={styles.iconButton} onPress={showRulesNotification}>
          <Text style={styles.iconLabel}>Rules</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconLabel}>Players</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconLabel}>Admins</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconLabel}>Leave</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.teamInfo}>
        <Text style={styles.teamLabel}>My Team</Text>
        <Text style={styles.teamName}>Super Splash Bros</Text>
        <Text style={styles.teamStatus}>4/4 Remain</Text>
      </View>

      <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  topImage: {
    width: '100%',
    height: 150, // Adjust the height as needed
    resizeMode: 'cover', // Adjust to 'contain' or 'center' if preferred
    marginBottom: 16, // Adds space between image and header text
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  purgeBanner: {
    width: '100%',
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  purgeText: {
    color: '#fff',
    fontSize: 16,
  },
  roundInfo: {
    width: '90%',
    backgroundColor: '#3498db',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  roundTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  roundDates: {
    color: '#d4eaf7',
    fontSize: 16,
    marginVertical: 4,
  },
  playerCount: {
    color: '#d4eaf7',
    fontSize: 16,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 16,
  },
  iconButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  iconLabel: {
    color: '#3498db',
    fontSize: 16,
  },
  teamInfo: {
    width: '90%',
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  teamLabel: {
    color: '#fff',
    fontSize: 14,
  },
  teamName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  teamStatus: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
});

export default AuthenticatedScreen;
