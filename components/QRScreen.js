// components/QRScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function QRScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const event = route?.params?.event || {
    name: 'Demo Event',
    id: '000',
    time: new Date().toISOString()
  };

  const qrValue = `${event.id}|${event.name}|${event.time}`;
  const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}`;

  const handleFeedback = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('Feedback', { event });
    } else {
      Alert.alert('Navigation error', 'Navigation not available.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Your QR Code</Text>
        <Image source={{ uri: qrURL }} style={styles.qrImage} />
        <Text style={styles.message}>
          ✅ Successfully registered for{"\n"}
          <Text style={{ fontWeight: 'bold' }}>{event.name}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleFeedback}>
        <Text style={styles.buttonText}>Give Feedback</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  card: {
    backgroundColor: '#f0f4ff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
    maxWidth: 400
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16
  },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
    borderRadius: 8
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
