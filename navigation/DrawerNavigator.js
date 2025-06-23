import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import { Ionicons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

const getScreenComponent = (initialRouteName) => () =>
  <BottomTabNavigator initialRouteName={initialRouteName} />;

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Drawer.Screen
        name="Home"
        component={getScreenComponent('Home')}
        options={{ drawerIcon: ({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        )}}
      />
      <Drawer.Screen
        name="Search"
        component={getScreenComponent('Search')}
        options={{ drawerIcon: ({ color, size }) => (
          <Ionicons name="search-outline" size={size} color={color} />
        )}}
      />
      <Drawer.Screen
        name="Favorites"
        component={getScreenComponent('Favorites')}
        options={{ drawerIcon: ({ color, size }) => (
          <Ionicons name="heart-outline" size={size} color={color} />
        )}}
      />
    </Drawer.Navigator>
  );
}
