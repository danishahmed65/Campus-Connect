import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from './ThemeContext';

export default function BookedEventDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { event, feedback } = route.params || {};
  const { darkMode } = useContext(ThemeContext);

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel your booking for this event?',
      [
        { text: 'No' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const stored = await AsyncStorage.getItem('registeredEvents');
              const events = stored ? JSON.parse(stored) : [];
              const updated = events.filter((e) => e.id !== event.id);
              await AsyncStorage.setItem(
                'registeredEvents',
                JSON.stringify(updated)
              );
              Alert.alert('✅ Booking cancelled');
              navigation.goBack(); // go back to BookedEvents screen
            } catch (err) {
              console.error('Error cancelling booking:', err);
            }
          },
        },
      ]
    );
  };

  const imageUrl = event.image?.startsWith('http')
    ? event.image
    : `https://picsum.photos/400/200?random=${event.id}`;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: darkMode ? '#111' : '#fff' },
      ]}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <View style={styles.content}>
        <Text
          style={[styles.title, { color: darkMode ? '#60a5fa' : '#3b82f6' }]}>
          {event.name}
        </Text>
        <Text style={[styles.detail, { color: darkMode ? '#ccc' : '#444' }]}>
          🕒 {new Date(event.time).toLocaleString()}
        </Text>
        <Text style={[styles.detail, { color: darkMode ? '#ccc' : '#444' }]}>
          📍 {event.venue}
        </Text>
        <Text
          style={[styles.description, { color: darkMode ? '#aaa' : '#555' }]}>
          {event.description || 'This event does not have a description yet.'}
        </Text>

        {feedback ? (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackLabel}>Your Feedback</Text>
            <Text style={styles.feedbackEmoji}>{feedback.emoji}</Text>
            {feedback.comment ? (
              <Text style={styles.feedbackComment}>"{feedback.comment}"</Text>
            ) : (
              <Text style={styles.feedbackComment}>No additional comment.</Text>
            )}
          </View>
        ) : (
          <Text
            style={[styles.noFeedback, { color: darkMode ? '#888' : '#666' }]}>
            No feedback submitted for this event.
          </Text>
        )}

        <TouchableOpacity onPress={handleCancel} style={{ marginTop: 20 }}>
          <LinearGradient colors={['#ef4444', '#f87171']} style={styles.button}>
            <Text style={styles.buttonText}>Cancel Booking</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', flexGrow: 1 },
  image: { width: '100%', height: 200, borderRadius: 16, marginBottom: 16 },
  content: { width: '100%', maxWidth: 450 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  detail: { fontSize: 16, marginBottom: 4 },
  description: {
    fontSize: 14,
    marginTop: 12,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  feedbackBox: {
    marginTop: 10,
    backgroundColor: '#ffffff22',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#fff',
  },
  feedbackEmoji: { fontSize: 30 },
  feedbackComment: {
    marginTop: 6,
    fontStyle: 'italic',
    fontSize: 14,
    color: '#f0f9ff',
    textAlign: 'center',
  },
  noFeedback: {
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
