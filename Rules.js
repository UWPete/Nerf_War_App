// Rules.js

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Rules = () => {
  const navigation = useNavigation();

  const RuleSection = ({ title, rules }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {rules.map((rule, index) => (
        <View key={index} style={styles.ruleContainer}>
          <View style={styles.bulletPoint}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          </View>
          <Text style={styles.ruleText}>{rule}</Text>
        </View>
      ))}
    </View>
  );

  const gameRules = {
    safety: [
      "Always wear protective eyewear during gameplay",
      "No shooting within 15 feet of another player",
      "No shooting at the head or face",
      "No physical contact or physical confrontations",
    ],
    gameplay: [
      "Games are only active outside of school/work hours",
      "No playing on school/work property",
      "Players must record eliminations in the app immediately",
      "No camping outside players' homes or workplaces",
    ],
    equipment: [
      "Only unmodified Nerf guns are allowed",
      "No modified or tampered ammunition",
      "Players must use approved dart types only",
      "No borrowed or shared equipment during matches",
    ],
    boundaries: [
      "Respect private property and no-play zones",
      "Public spaces must be used responsibly",
      "No gameplay in or around vehicles",
      "Maintain distance from non-participants",
    ]
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.title}>Official Rules</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.introText}>
          These rules are designed to ensure fair play and safety for all participants. 
          Violation of these rules may result in elimination or game ban.
        </Text>

        {Object.entries(gameRules).map(([section, rules]) => (
          <RuleSection 
            key={section} 
            title={section.charAt(0).toUpperCase() + section.slice(1)} 
            rules={rules} 
          />
        ))}

        <View style={styles.disclaimer}>
          <Ionicons name="information-circle" size={24} color="#666" />
          <Text style={styles.disclaimerText}>
            By participating in the game, you agree to follow all rules and accept responsibility 
            for your actions during gameplay.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#161616',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  introText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ruleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    marginRight: 12,
    marginTop: 2,
  },
  ruleText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  disclaimer: {
    flexDirection: 'row',
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
    gap: 12,
  },
  disclaimerText: {
    flex: 1,
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default Rules;