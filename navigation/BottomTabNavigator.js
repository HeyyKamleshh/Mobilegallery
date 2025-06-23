import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';


import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';


const Tab = createBottomTabNavigator();

const getTabIconName = (routeName) => {
  if (routeName === 'Home') {
    return 'home-outline';
  } 
  else if (routeName === 'Search') {
    return 'search-outline';
  }
   else if (routeName === 'Favorites') {
    return 'heart-outline';
  } 
  else if (routeName === 'Profile') {
    return 'person-outline';
  }
};


export default function BottomTabNavigator({ initialRouteName = 'Home' }) {
  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={getTabIconName(route.name)}
            size={size}
            color={color}
          />
        )
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}
