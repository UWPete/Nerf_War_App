// MainDashboard.js

import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from '@firebase/auth';
import { auth } from './firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const MainDashboard = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('AuthScreen');
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  const MenuItem = ({ icon, title, subtitle, onPress, color = '#4CAF50' }) => (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { borderColor: color }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.menuItemText}>
        <Text style={styles.menuItemTitle}>{title}</Text>
        <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('./assets/favicon.png')} 
          style={styles.logo}
        />
        <Text style={styles.title}>SENIOR ASSASSIN</Text>
        <Text style={styles.subtitle}>Welcome, {auth.currentUser.email?.split('@')[0]}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Game Options</Text>
        
        <MenuItem
          icon="add-circle-outline"
          title="Create New Game"
          subtitle="Start a new Senior Assassin match"
          onPress={() => navigation.navigate('CreateGameScreen')}
        />

        <MenuItem
          icon="enter-outline"
          title="Join Game"
          subtitle="Join an existing match"
          onPress={() => navigation.navigate('JoinGameScreen')}
        />

        <MenuItem
          icon="information-circle-outline"
          title="About"
          subtitle="Learn more about Senior Assassin"
          onPress={() => navigation.navigate('AboutScreen')}
          color="#3498db"
        />

        <MenuItem
          icon="settings-outline"
          title="Settings"
          subtitle="Manage your preferences"
          onPress={() => navigation.navigate('SettingsScreen')}
          color="#9b59b6"
        />
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="#666" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
    alignItems: 'center',
    backgroundColor: '#161616',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#161616',
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 8,
  },
  logoutText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MainDashboard;