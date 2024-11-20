import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const AboutScreen = () => {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.header}>About Nerf War</Text>
                <Text style={styles.textField}>
                    We created this app so that people everywhere could enjoy the fun of playing Senior Assassin.
                    We began working on this project when we noticed that there was no good way to play this game with our friends and were stuck using inferior alternatives.
                    We wanted an easy, convenient way to play and connect with our classmates.
                    This app allows you to take control and create your own games or join an existing game to play with your friends, coworkers, or other people in your area using only a few clicks.
                </Text>
                <Image source={require('./assets/favicon.png')} style={styles.image} />
            </ScrollView>
        </View>
    );
};

export default AboutScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f8ff',
    },
    scrollContainer: {
        padding: 20,
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#34495e',
        marginBottom: 20,
        textAlign: 'center',
    },
    textField: {
        fontSize: 18,
        color: '#34495e',
        textAlign: 'justify',
        lineHeight: 28,
    },
});
