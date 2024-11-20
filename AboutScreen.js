// AboutScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AboutScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.textField}>Hello World</Text>
        </View>
    );
};

export default AboutScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5', // Light background color
    },
    textField: {
        fontSize: 24,
        color: '#2c3e50', // Dark text color
        fontWeight: 'bold',
    },
});
