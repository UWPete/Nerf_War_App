import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Platform,
  Dimensions
} from 'react-native';
import { db } from './firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Circle } from 'react-native-maps';

const LocationTab = ({ route }) => {
  const { gameId, location } = route.params;
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerLocations, setPlayerLocations] = useState([]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    fetchGameData();
    fetchPlayerLocations();
    // Set up real-time updates for player locations
    const interval = setInterval(fetchPlayerLocations, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [gameId]);

  const fetchGameData = async () => {
    try {
      setLoading(true);
      const gameDoc = await getDoc(doc(db, 'games', gameId));
      if (gameDoc.exists()) {
        setGameData(gameDoc.data());
      } else {
        setError('Game data not found');
      }
    } catch (error) {
      console.error('Error fetching game data:', error);
      setError('Failed to load game data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayerLocations = async () => {
    try {
      const playersRef = collection(db, 'games', gameId, 'players');
      const playersSnapshot = await getDocs(playersRef);
      const locations = [];
      
      playersSnapshot.forEach(doc => {
        const playerData = doc.data();
        if (playerData.location) {
          locations.push({
            id: doc.id,
            ...playerData
          });
        }
      });
      
      setPlayerLocations(locations);
    } catch (error) {
      console.error('Error fetching player locations:', error);
    }
  };

  const onMapReady = () => {
    setMapReady(true);
  };

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
      </View>
    );
  }

  // Custom map style for dark theme
  const mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#242f3e" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#746855" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#242f3e" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#38414e" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#212a37" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#17263c" }]
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="location" size={24} color="#4CAF50" />
          <Text style={styles.cardTitle}>Game Location</Text>
        </View>

        <View style={styles.statusBar}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Players Online</Text>
            <Text style={styles.statusValue}>{playerLocations.length}</Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Active Players</Text>
            <Text style={styles.statusValue}>
              {playerLocations.filter(p => p.status === 'active').length}
            </Text>
          </View>
        </View>
        
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location?.latitude || 37.78825,
              longitude: location?.longitude || -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            customMapStyle={mapStyle}
            onMapReady={onMapReady}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
          >
            {mapReady && location && (
              <>
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude
                  }}
                  title="Game Center"
                >
                  <View style={styles.centerMarker}>
                    <Ionicons name="flag" size={30} color="#4CAF50" />
                  </View>
                </Marker>
                <Circle
                  center={{
                    latitude: location.latitude,
                    longitude: location.longitude
                  }}
                  radius={1000}
                  fillColor="rgba(76, 175, 80, 0.2)"
                  strokeColor="rgba(76, 175, 80, 0.5)"
                  strokeWidth={2}
                />
                {playerLocations.map((player) => (
                  <Marker
                    key={player.id}
                    coordinate={{
                      latitude: player.location.latitude,
                      longitude: player.location.longitude
                    }}
                    title={player.name || player.email?.split('@')[0]}
                    description={`Status: ${player.status}`}
                  >
                    <View style={[
                      styles.playerMarker,
                      { backgroundColor: player.status === 'active' ? '#4CAF50' : '#ff4444' }
                    ]}>
                      <Ionicons name="person" size={20} color="#fff" />
                    </View>
                  </Marker>
                ))}
              </>
            )}
          </MapView>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="information-circle" size={24} color="#4CAF50" />
          <Text style={styles.cardTitle}>Location Rules</Text>
        </View>

        <View style={styles.ruleItem}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.ruleText}>No gameplay inside buildings or private property</Text>
        </View>
        
        <View style={styles.ruleItem}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.ruleText}>Respect all local laws and regulations</Text>
        </View>

        <View style={styles.ruleItem}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.ruleText}>Stay within designated game boundaries</Text>
        </View>

        <View style={styles.ruleItem}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.ruleText}>No gameplay during school/work hours</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
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
  card: {
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBar: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusDivider: {
    width: 1,
    backgroundColor: '#333',
    marginHorizontal: 12,
  },
  statusLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  statusValue: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapContainer: {
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  map: {
    flex: 1,
  },
  centerMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  ruleText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
});

export default LocationTab;