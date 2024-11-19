// GameManagementScreen.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import the tab screens
import PlayersTab from './PlayersTab';
import TeamsTab from './TeamsTab';
import LocationTab from './LocationTab';

const Tab = createBottomTabNavigator();

const GameManagementScreen = ({ route }) => {
  const { gameId } = route.params;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Players"
        component={PlayersTab}
        initialParams={{ gameId }}
      />
      <Tab.Screen
        name="Teams"
        component={TeamsTab}
        initialParams={{ gameId }}
      />
      <Tab.Screen
        name="Location"
        component={LocationTab}
        initialParams={{ gameId }}
      />
    </Tab.Navigator>
  );
};

export default GameManagementScreen;
