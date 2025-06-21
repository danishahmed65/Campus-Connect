import React, { useContext } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from './ThemeContext';

export default function EventDetailScreen({ route, navigation }) {
  const { darkMode } = useContext(ThemeContext);
  const { event } = route.params;

  const handleRegister = () => {
    navigation.navigate('Register', { event });
  };

  const imageUrl = event.image?.startsWith('http')
    ? event.image
    : `https://picsum.photos/400/200?random=${event.id}`;

  return (
    <ScrollView contentContainerStyle={[
      styles.container,
      { backgroundColor: darkMode ? '#111' : '#fff' }
    ]}>
      <View style={styles.cardWrapper}>
        <LinearGradient
          colors={darkMode ? ['#1f2937', '#374151'] : ['#f0f4ff', '#e6f0ff']}
          style={styles.card}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.cardContent}>
            <Text style={[styles.title, { color: darkMode ? '#60a5fa' : '#3b82f6' }]}>
              {event.name}
            </Text>
            <Text style={[styles.info, { color: darkMode ? '#ccc' : '#444' }]}>
              🕒 {new Date(event.time).toLocaleString()}
            </Text>
            <Text style={[styles.info, { color: darkMode ? '#ccc' : '#444' }]}>
              📍 {event.venue}
            </Text>
            <Text style={[styles.description, { color: darkMode ? '#aaa' : '#555' }]}>
              {event.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet lectus non erat tincidunt fermentum.'}
            </Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={handleRegister}>
          <LinearGradient colors={['#3b82f6', '#60a5fa']} style={styles.button}>
            <Text style={styles.buttonText}>Register & Get QR</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    flexGrow: 1
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30
  },
  card: {
    borderRadius: 16,
    padding: 16,
    width: '100%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16
  },
  cardContent: {
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15
  },
  info: {
    fontSize: 16,
    marginBottom: 10
  },
  description: {
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 20
  },
  buttonWrapper: {
    marginTop: 10
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  }
});
