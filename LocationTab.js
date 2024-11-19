// LocationTab.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const LocationTab = ({ route }) => {
  const { gameId } = route.params;
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const gameDoc = await getDoc(doc(db, 'games', gameId));
        if (gameDoc.exists()) {
          const gameData = gameDoc.data();
          setLocation(gameData.location);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation();
  }, [gameId]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Game Location:</Text>
      <Text style={styles.location}>{location}</Text>
    </View>
  );
};

export default LocationTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 16,
    marginTop: 8,
  },
});
