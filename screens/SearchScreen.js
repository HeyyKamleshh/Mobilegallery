import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Snackbar } from 'react-native-paper';

const API_KEY = '6f102c62f41998d151e5a1b48713cf13';
const BASE_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';
const IMAGES_PER_PAGE = 20;

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadRecentSearches();
    loadFavorites();
  }, []);

  const saveRecentSearch = async (query) => {
    try {
      const existing = await AsyncStorage.getItem('recentSearches');
      let history = existing ? JSON.parse(existing) : [];
      history = [query, ...history.filter(item => item !== query)];
      if (history.length > 5) history = history.slice(0, 5);
      await AsyncStorage.setItem('recentSearches', JSON.stringify(history));
      setRecentSearches(history);
    } catch (err) {
      console.error('Error saving recent search', err);
    }
  };

  const loadRecentSearches = async () => {
    const saved = await AsyncStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
  };

  const loadFavorites = async () => {
    const stored = await AsyncStorage.getItem('favorites');
    if (stored) setFavorites(JSON.parse(stored));
  };

  const toggleFavorite = async (url) => {
    let updated;
    if (favorites.includes(url)) {
      updated = favorites.filter(item => item !== url);
    } else {
      updated = [...favorites, url];
    }
    setFavorites(updated);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  };

  const isFavorite = (url) => favorites.includes(url);

  const fetchImages = async (customQuery = null) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    await saveRecentSearch(searchQuery);;

    try {
      const url = `${BASE_URL}&api_key=${API_KEY}&format=json&nojsoncallback=1&extras=url_s&text=${encodeURIComponent(
        searchQuery
      )}&per_page=${IMAGES_PER_PAGE}`;

      const response = await axios.get(url);
      const photoData = response?.data?.photos?.photo || [];
      const urls = photoData.map(photo => photo.url_s).filter(Boolean);

      setImageUrls(urls);
    } catch (error) {
      console.error('Error fetching images:', error.message);
      setSnackbarVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const renderImageItem = ({ item }) => (
    <View style={styles.imageWrapper}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
      <TouchableOpacity
        style={styles.favoriteIcon}
        onPress={() => toggleFavorite(item)}
      >
        <Icon
          name={isFavorite(item) ? 'heart' : 'heart-outline'}
          size={26}
          color={isFavorite(item) ? 'red' : 'white'}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for images..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={() => fetchImages()}
      />

      <Button title={isLoading ? 'Searching...' : 'Search'} onPress={fetchImages} disabled={isLoading} />

      {recentSearches.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Recent Searches:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentSearches.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => fetchImages(item)} style={styles.historyTag}>
                <Text style={styles.historyText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {isLoading && <ActivityIndicator size="large" style={styles.loader} />}

      {!isLoading && hasSearched && imageUrls.length === 0 && (
        <Text style={styles.emptyText}>No images found for “{searchQuery}”.</Text>
      )}

      <FlatList
        data={imageUrls}
        keyExtractor={(uri, index) => uri + index}
        renderItem={renderImageItem}
        contentContainerStyle={styles.list}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Retry',
          onPress: () => fetchImages(),
        }}
      >
        Unable to load images. Please check your connection.
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10 },
  loader: { marginVertical: 16 },
  imageWrapper: { position: 'relative', marginBottom: 12 },
  image: { height: 200, borderRadius: 8 },
  favoriteIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 4,
  },
  list: { paddingBottom: 20 },
  emptyText: { textAlign: 'center', color: '#777', fontSize: 16, marginTop: 20 },
  historyContainer: { marginBottom: 12 },
  historyTitle: { fontWeight: 'bold', marginBottom: 6, color: '#333' },
  historyTag: {
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  historyText: { color: '#555' },
});
