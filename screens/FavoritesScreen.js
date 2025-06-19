import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const stored = await AsyncStorage.getItem('favorites');
    if (stored) setFavorites(JSON.parse(stored));
  };

  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.image} />
  );

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorite images yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => `${item}_${index}`}
          renderItem={renderImageItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, backgroundColor: '#fff' },
  image: { height: 200, margin: 10, borderRadius: 10 },
  list: { paddingBottom: 20 },
  emptyText: { textAlign: 'center', color: '#777', fontSize: 16, marginTop: 20 },
});
