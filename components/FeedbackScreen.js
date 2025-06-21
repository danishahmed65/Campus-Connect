import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from './ThemeContext';

const emojis = ['👍', '😍', '🔥', '😐', '👎'];

export default function FeedbackScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { event } = route.params || {};

  const { darkMode = false } = useContext(ThemeContext) || {};

  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (!selectedEmoji) {
      Alert.alert('Please select an emoji for feedback.');
      return;
    }

    const feedbackEntry = {
      id: event?.id || 'unknown', // ✅ Ensure this matches event.id consistently
      emoji: selectedEmoji,
      comment: comment.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      const stored = await AsyncStorage.getItem('feedback');
      const parsed = stored ? JSON.parse(stored) : [];

      // ✅ Remove any previous feedback for the same event ID
      const updated = parsed.filter(f => f.id !== feedbackEntry.id);
      updated.push(feedbackEntry);

      await AsyncStorage.setItem('feedback', JSON.stringify(updated));

      Alert.alert('✅ Feedback submitted. Thank you!');
      navigation.navigate('BookedEvents'); // ✅ More appropriate than Home
    } catch (err) {
      console.error('Error saving feedback:', err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111' : '#fff' }]}>
      <Text style={[styles.heading, { color: darkMode ? '#fff' : '#111' }]}>
        Give Your Feedback
      </Text>

      <View style={styles.emojiRow}>
        {emojis.map((emoji) => (
          <TouchableOpacity key={emoji} onPress={() => setSelectedEmoji(emoji)}>
            <Text style={[
              styles.emoji,
              selectedEmoji === emoji && styles.selectedEmoji
            ]}>
              {emoji}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Write a comment (optional)"
        placeholderTextColor={darkMode ? '#aaa' : '#888'}
        style={[
          styles.input,
          { backgroundColor: darkMode ? '#333' : '#f0f0f0', color: darkMode ? '#fff' : '#000' }
        ]}
        multiline
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity onPress={handleSubmit}>
        <LinearGradient colors={['#3b82f6', '#60a5fa']} style={styles.button}>
          <Text style={styles.buttonText}>Submit Feedback</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  heading: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  emojiRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  emoji: { fontSize: 30, opacity: 0.6 },
  selectedEmoji: { opacity: 1, transform: [{ scale: 1.3 }] },
  input: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top'
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
