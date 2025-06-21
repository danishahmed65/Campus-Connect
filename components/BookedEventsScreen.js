import React, { useState, useContext, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from './ThemeContext';

export default function BookedEventsScreen() {
  const [bookedEvents, setBookedEvents] = useState([]);
  const [feedbackData, setFeedbackData] = useState({});
  const { darkMode } = useContext(ThemeContext);
  const navigation = useNavigation();

  // 🔁 Reload data every time screen becomes active
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const booked = await AsyncStorage.getItem('registeredEvents');
        const feedback = await AsyncStorage.getItem('feedback');

        if (booked) setBookedEvents(JSON.parse(booked));

        if (feedback) {
          const parsed = JSON.parse(feedback);
          const map = {};
          parsed.forEach(f => {
            map[f.id] = f;
          });
          setFeedbackData(map);
        }
      };

      loadData();
    }, [])
  );

  const renderItem = ({ item }) => {
    const feedback = feedbackData[item.id];
    const imageUrl = item.image?.startsWith('http')
      ? item.image
      : `https://picsum.photos/400/200?random=${item.id}`;

    return (
      <LinearGradient colors={['#3b82f6', '#60a5fa']} style={styles.card}>
        <Image source={{ uri: imageUrl }} style={styles.cardImage} />
        <View style={styles.info}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardText}>{new Date(item.time).toLocaleString()}</Text>
          <Text style={styles.cardText}>{item.venue}</Text>

          {feedback && (
            <View style={styles.feedbackBox}>
              <Text style={styles.feedbackEmoji}>{feedback.emoji}</Text>
              {feedback.comment && (
                <Text style={styles.feedbackComment}>"{feedback.comment}"</Text>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => navigation.navigate('BookedEventDetail', { event: item, feedback })}
        >
          <Text style={styles.detailsText}>View Details</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111' : '#fff' }]}>
      <Text style={[styles.header, { color: darkMode ? '#fff' : '#111' }]}>
        Your Booked Events
      </Text>
      <FlatList
        data={bookedEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: darkMode ? '#888' : '#555' }}>
            You have no booked events.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    elevation: 3
  },
  cardImage: {
    height: 120,
    width: '100%',
    borderRadius: 12,
    marginBottom: 10
  },
  info: {
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4
  },
  cardText: {
    fontSize: 14,
    color: '#f0f9ff',
    marginBottom: 2
  },
  feedbackBox: {
    marginTop: 10,
    backgroundColor: '#ffffff20',
    padding: 8,
    borderRadius: 10
  },
  feedbackEmoji: {
    fontSize: 22,
    marginBottom: 4
  },
  feedbackComment: {
    color: '#fff',
    fontStyle: 'italic',
    fontSize: 13
  },
  detailsBtn: {
    marginTop: 12,
    backgroundColor: '#1e40af',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  detailsText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15
  }
});
