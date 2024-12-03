// AboutScreen.js

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AboutScreen = () => {
    const { width } = useWindowDimensions();
    const imageSize = Math.min(width * 0.7, 300);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Ionicons name="game-controller" size={40} color="#fff" style={styles.icon} />
                    <Text style={styles.header}>About Senior Assassin</Text>
                    <View style={styles.divider} />
                </View>

                {/* Main Content Card */}
                <View style={styles.card}>
                    <Text style={styles.subtitle}>Our Mission</Text>
                    <Text style={styles.textField}>
                        We created this app to revolutionize how Senior Assassin is played everywhere.
                        We began working on this project when we noticed that there was no good way to organize and manage Senior Assassin games with our friends and were stuck using inferior alternatives.
                    </Text>

                    <View style={styles.separator} />

                    <Text style={styles.subtitle}>Why Choose Us?</Text>
                    <Text style={styles.textField}>
                        We wanted an easy, convenient way to play and track Senior Assassin matches.
                        This app allows you to take control and create your own games or join an existing Senior Assassin match to play with your classmates, friends, or other people in your area using only a few clicks.
                    </Text>
                </View>

                {/* Image Section */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require('./assets/favicon.png')}
                        style={[styles.image, { width: imageSize, height: imageSize }]}
                    />
                    <View style={styles.imageOverlay} />
                </View>

                {/* Features Section */}
                <View style={styles.featuresContainer}>
                    <Feature 
                        icon="people-outline" 
                        title="Community Driven"
                        description="Connect with classmates and track targets easily"
                    />
                    <Feature 
                        icon="game-controller-outline" 
                        title="Easy to Play"
                        description="Start or join Senior Assassin games instantly"
                    />
                    <Feature 
                        icon="shield-checkmark-outline" 
                        title="Safe & Fair"
                        description="Built-in rules and moderation"
                    />
                </View>
            </ScrollView>
        </View>
    );
};

// Feature Component
const Feature = ({ icon, title, description }) => (
    <View style={styles.featureCard}>
        <Ionicons name={icon} size={30} color="#4CAF50" />
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContainer: {
        alignItems: 'center',
    },
    heroSection: {
        width: '100%',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    icon: {
        marginBottom: 20,
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    divider: {
        width: 40,
        height: 4,
        backgroundColor: '#4CAF50',
        borderRadius: 2,
    },
    card: {
        backgroundColor: '#161616',
        borderRadius: 16,
        padding: 24,
        margin: 20,
        width: '90%',
        borderWidth: 1,
        borderColor: '#333',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    textField: {
        fontSize: 16,
        color: '#999',
        lineHeight: 24,
    },
    separator: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 20,
    },
    imageContainer: {
        position: 'relative',
        marginVertical: 30,
        borderRadius: 20,
        overflow: 'hidden',
    },
    image: {
        resizeMode: 'contain',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 10,
        gap: 16,
        marginBottom: 40,
    },
    featureCard: {
        backgroundColor: '#161616',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        width: '45%',
        minWidth: 150,
        borderWidth: 1,
        borderColor: '#333',
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 12,
        marginBottom: 8,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default AboutScreen;