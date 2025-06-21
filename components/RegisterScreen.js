// components/RegisterScreen.js
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ route, navigation }) {
  const { event } = route.params;

  useEffect(() => {
    const saveAndRedirect = async () => {
      try {
        const stored = await AsyncStorage.getItem('registeredEvents');
        let updated = stored ? JSON.parse(stored) : [];

        // Prevent duplicates
        if (!updated.find(e => e.id === event.id)) {
          updated.push(event);
          await AsyncStorage.setItem('registeredEvents', JSON.stringify(updated));
        }

        navigation.replace('QR', { event }); // Replace instead of push
      } catch (err) {
        console.error('Registration error:', err);
      }
    };

    saveAndRedirect();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'
  }
});
