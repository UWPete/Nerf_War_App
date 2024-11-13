// MainDashboard.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Menu, Divider, Provider, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { signOut } from '@firebase/auth';
import AuthenticatedScreen from './AuthenticatedScreen';

const MainDashboard = () => {
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.navigate(AuthenticatedScreen); // Navigate back to authenticated screen
        } catch (error) {
            Alert.alert('Logout Failed', error.message);
        }
    };

    const handleAbout = () => {
        Alert.alert('About', 'This is an app for managing Nerf games.');
        // TODO Navigate to About screen
    };

    const handleStartGame = () => {
        Alert.alert('Start Game', 'Game starting soon...');
        // TODO Navigate to Start Game screen 
    };

    return (
        <Provider>
            <View style={styles.container}>
                {/* App Title */}
                <Text style={styles.appTitle}>NERF WARS</Text>

                {/* Dropdown Menu */}
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <Button mode="contained" onPress={openMenu}>
                            Menu
                        </Button>
                    }
                >
                    <Menu.Item onPress={handleAbout} title="About" />
                    <Divider />
                    <Menu.Item onPress={handleStartGame} title="Start Game" />
                    <Divider />
                    <Menu.Item onPress={handleLogout} title="Logout" />
                </Menu>
            </View>
        </Provider>
    );
};

export default MainDashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f0f0f0',
    },
    appTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#3498db', // We can change this later 
        marginBottom: 20,
        textAlign: 'center',
    },
});