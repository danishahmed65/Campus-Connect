import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, Switch, TextInput, FlatList,
  StyleSheet, TouchableOpacity, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from './ThemeContext';

const API_URL = 'https://683abb3e43bb370a86738f82.mockapi.io/events';

export default function HomeScreen() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const navigation = useNavigation();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [search, category, events]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEvents(data);
      setFilteredEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filterEvents = () => {
    const filtered = events.filter(event => {
      const matchesSearch = event.name?.toLowerCase().includes(search.toLowerCase()) ||
        event.venue?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || event.category === category;
      return matchesSearch && matchesCategory;
    });
    setFilteredEvents(filtered);
  };

  const getImageUrl = (eventId) => `https://picsum.photos/400/200?random=${eventId}`;

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('EventDetail', { event: item })}>
      <LinearGradient colors={['#3b82f6', '#60a5fa']} style={styles.card}>
        <Image
          source={{ uri: getImageUrl(item.id) }}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardText}>{new Date(item.time).toLocaleString()}</Text>
          <Text style={styles.cardText}>{item.venue}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111' : '#fff' }]}>
      <Text style={styles.logoTitle}>
        Welcome to, <Text style={styles.logoHighlight}>CampusConnect</Text>
      </Text>

      <View style={styles.toggleContainer}>
        <Text style={{ color: darkMode ? '#fff' : '#000' }}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={() => setDarkMode(!darkMode)}
        />
      </View>

      <TextInput
        style={[styles.input, { backgroundColor: darkMode ? '#333' : '#eee', color: darkMode ? '#fff' : '#000' }]}
        placeholder="Search by name or venue"
        placeholderTextColor={darkMode ? '#aaa' : '#555'}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.dropdownContainer}>
        {['All', 'Tech', 'Sports', 'Seminar', 'Workshop'].map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.dropdownItem, category === cat && styles.selectedDropdownItem]}
            onPress={() => setCategory(cat)}
          >
            <Text style={{ color: category === cat ? '#fff' : '#000' }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 📅 View Booked Events Button */}
      <TouchableOpacity onPress={() => navigation.navigate('BookedEvents')} style={{ marginBottom: 16 }}>
        <LinearGradient colors={['#3b82f6', '#60a5fa']} style={styles.bookedButton}>
          <Text style={styles.bookedButtonText}>📅 View Booked Events</Text>
        </LinearGradient>
      </TouchableOpacity>

      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={{ color: darkMode ? '#aaa' : '#444', textAlign: 'center', marginTop: 40 }}>
            No events found in this category.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 30
  },
  logoHighlight: {
    fontSize: 18,
    color: '#60a5fa',
    fontWeight: '600'
  },
  container: {
    flex: 1,
    padding: 18,
    paddingTop: 45
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  input: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },
  dropdownContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10
  },
  dropdownItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginRight: 8,
    marginBottom: 8
  },
  selectedDropdownItem: {
    backgroundColor: '#3b82f6'
  },
  bookedButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 2
  },
  bookedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 3
  },
  cardImage: {
    height: 120,
    width: '100%'
  },
  cardContent: {
    padding: 12
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  cardText: {
    color: '#fff',
    fontSize: 14
  },
  list: {
    paddingBottom: 20
  }
});
