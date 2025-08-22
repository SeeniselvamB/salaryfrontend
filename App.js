import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import HomeScreen from './screens/HomeScreen';
import DailyScreen from './screens/DailyScreen';
import WeeklyScreen from './screens/WeeklyScreen';
import MonthlyScreen from './screens/MonthlyScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Daily" component={DailyScreen} />
        <Stack.Screen name="Weekly" component={WeeklyScreen} />
        <Stack.Screen name="Monthly" component={MonthlyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
