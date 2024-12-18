import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

import AuthScreen from './AuthScreen';
import AuthenticatedScreen from './AuthenticatedScreen';
import CreateGameScreen from './CreateGameScreen';
import JoinGameScreen from './JoinGameScreen';
import PlayersScreen from './PlayersScreen';
import TeamsScreen from './TeamsScreen';
import AboutScreen from './AboutScreen';
import GameManagementScreen from './GameManagementScreen';
import LocationTab from './LocationTab';
import GameScreen from './GameScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      if (authenticatedUser) {
        setUser(authenticatedUser);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // Screens accessible when authenticated
          <>
            <Stack.Screen
              name="AuthenticatedScreen"
              component={AuthenticatedScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AboutScreen"
              component={AboutScreen}
              options={{ title: 'AboutPage' }}
            />
            <Stack.Screen
              name="CreateGameScreen"
              component={CreateGameScreen}
              options={{ title: 'Create Game' }}
            />
            <Stack.Screen
              name="JoinGameScreen"
              component={JoinGameScreen}
              options={{ title: 'Join Game' }}
            />
            <Stack.Screen
              name="PlayersScreen"
              component={PlayersScreen}
              options={{ title: 'Players' }}
            />
            <Stack.Screen
              name="TeamsScreen"
              component={TeamsScreen}
              options={{ title: 'Teams' }}
            />
            <Stack.Screen
              name="GameManagementScreen"
              component={GameManagementScreen}
              options={{ title: 'Manage Game', headerShown: false }}
            />
            <Stack.Screen
              name="GameScreen"
              component={GameScreen}
              options={{ headerShown: false }}
            />            
            <Stack.Screen
              name="LocationTab"
              component={LocationTab}
              options={{ 
                title: 'Game Location',
                headerStyle: { backgroundColor: '#000' },
                headerTintColor: '#fff',
                headerTitleStyle: { color: '#fff' }
              }}
            />
          </>
        ) : (
          // Screens accessible when not authenticated
          <>
            <Stack.Screen
              name="AuthScreen"
              component={AuthScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}