import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import axios from 'axios';
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

  const fetchImages = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

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

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for images..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={fetchImages}
      />

      <Button
        title={isLoading ? 'Searching...' : 'Search'}
        onPress={fetchImages}
        disabled={isLoading}
      />

      {isLoading && <ActivityIndicator size="large" style={styles.loader} />}

      {!isLoading && hasSearched && imageUrls.length === 0 && (
        <Text style={styles.emptyText}>No images found for “{searchQuery}”.</Text>
      )}

      <FlatList
        data={imageUrls}
        keyExtractor={(uri, index) => uri + index}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
        )}
        contentContainerStyle={styles.list}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Retry',
          onPress: fetchImages,
        }}
      >
        Unable to load images. Please check your connection.
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  loader: {
    marginVertical: 16,
  },
  image: {
    height: 200,
    marginBottom: 12,
    borderRadius: 8,
  },
  list: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    marginTop: 20,
  },
});
