// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from 'react';

import AIRecommender from './components/AIRecommender';
import BookedEventDetailScreen from './components/BookedEventDetailScreen';
import BookedEventsScreen from './components/BookedEventsScreen';
import EventDetailScreen from './components/EventDetailScreen';
import FeedbackScreen from './components/FeedbackScreen';
import HomeScreen from './components/HomeScreen';
import QRScreen from './components/QRScreen';
import RegisterScreen from './components/RegisterScreen';
import { ThemeContext } from './components/ThemeContext';


const Stack = createStackNavigator();

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="QR" component={QRScreen} />
          <Stack.Screen name="Feedback" component={FeedbackScreen} />
          <Stack.Screen name="AIRecommender" component={AIRecommender} />
          <Stack.Screen name="BookedEvents" component={BookedEventsScreen} />
          <Stack.Screen name="BookedEventDetail" component={BookedEventDetailScreen} options={{ title: 'Event Detail' }}
/>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}
