import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function FavoritesScreen() {
  const [favoriteImages, setFavoriteImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load fav images
  const fetchFavoriteImages = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavoriteImages(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove image from fav
  const handleRemoveFavorite = async (imageUrl) => {
    const updatedFavorites = favoriteImages.filter(url => url !== imageUrl);
    setFavoriteImages(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  // Renders each image  with a remove icon
  const renderFavoriteItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
      <TouchableOpacity
        style={styles.removeIcon}
        onPress={() => handleRemoveFavorite(item)}
      >
        <Icon name="heart-off" size={26} color="red" />
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    fetchFavoriteImages();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : favoriteImages.length === 0 ? (
        <Text style={styles.emptyMessage}>No favorite images yet.</Text>
      ) : (
        <FlatList
          data={favoriteImages}
          keyExtractor={(item, index) => `${item}_${index}`}
          renderItem={renderFavoriteItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  image: {
    height: 200,
    borderRadius: 8,
  },
  removeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 4,
  },
  loader: {
    marginVertical: 20,
  },
  list: {
    paddingBottom: 20,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    marginTop: 20,
  },
});
