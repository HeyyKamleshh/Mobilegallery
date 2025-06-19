import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const API_KEY = '6f102c62f41998d151e5a1b48713cf13';
const BASE_URL = 'https://api.flickr.com/services/rest/';
const IMAGES_PER_PAGE = 20;

const HomeScreen = ({ navigation }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasMoreImages, setHasMoreImages] = useState(true);

  useEffect(() => {
    fetchImages(1, true);
    loadFavorites();
  }, []);

  const buildApiUrl = (page) =>
    `${BASE_URL}?method=flickr.photos.getRecent&per_page=${IMAGES_PER_PAGE}&page=${page}&api_key=${API_KEY}&format=json&nojsoncallback=1&extras=url_s`;

  const fetchImages = async (page = 1, isInitialLoad = false) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await axios.get(buildApiUrl(page));
      const fetchedImages = response?.data?.photos?.photo
        ?.map(photo => photo.url_s)
        .filter(Boolean) || [];

      if (fetchedImages.length === 0) {
        setHasMoreImages(false);
      }

      const updatedImages = page === 1
        ? fetchedImages
        : [...imageUrls, ...fetchedImages];

      setImageUrls(updatedImages);

      if (page === 1) {
        await AsyncStorage.setItem('cachedImages', JSON.stringify(fetchedImages));
      }

      setCurrentPage(page);
      setHasError(false);
    } catch (error) {
      setHasError(true);
      console.warn('Error fetching images:', error.message);

      // Try to load cached images
      if (page === 1) {
        const cachedImages = await AsyncStorage.getItem('cachedImages');
        if (cachedImages) {
          setImageUrls(JSON.parse(cachedImages));
        }
      }
    } finally {
      setIsLoading(false);
      if (isInitialLoad) setInitialLoading(false);
    }
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

  const loadMoreImages = () => {
    if (!isLoading && hasMoreImages) {
      fetchImages(currentPage + 1);
    }
  };

  const renderImageItem = ({ item }) => (
    <View style={styles.imageWrapper}>
      <Image source={{ uri: item }} style={styles.image} />
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

  const renderListFooter = () => (
    isLoading ? <ActivityIndicator size="large" style={styles.loader} /> : null
  );

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
  <Text style={styles.navTitle}>Home</Text>
  <View style={styles.navLinks}>
    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
      <Text style={styles.navLink}>Search</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
      <Text style={styles.navLink}>Favorites</Text>
    </TouchableOpacity>
  </View>
</View>


      {initialLoading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : imageUrls.length === 0 ? (
        <Text style={styles.emptyText}>No images found.</Text>
      ) : (
        <FlatList
          data={imageUrls}
          keyExtractor={(item, index) => `${item}_${index}`}
          renderItem={renderImageItem}
          onEndReached={loadMoreImages}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderListFooter}
        />
      )}

      {hasError && !initialLoading && (
        <Text style={styles.errorText}>Offline Mode – Showing Cached Images</Text>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    margin: 10,
    position: 'relative',
  },
  image: {
    height: 200,
    borderRadius: 10,
  },
  favoriteIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 4,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 14,
    marginVertical: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    padding: 20,
  },
  navBar: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 10,
  backgroundColor: '#f0f0f0',
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
},
navTitle: {
  fontSize: 18,
  fontWeight: 'bold',
},
navLinks: {
  flexDirection: 'row',
},
navLink: {
  marginLeft: 20,
  fontSize: 16,
  color: '#007BFF',
  fontWeight: '600',
},

});
