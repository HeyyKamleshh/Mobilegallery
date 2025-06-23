import React, { useEffect, useState, useLayoutEffect } from 'react';

import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Text,
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
  const [images, setImages] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasMore, setHasMore] = useState(true);

 useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Home',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 15 }}>
          <Icon name="menu" size={26} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    fetchRecentImages(1, true);
    loadFavoriteImages();
  }, []);

  // Builds the Flickr API
  const buildFlickrApiUrl = (pageNumber) =>
    `${BASE_URL}?method=flickr.photos.getRecent&per_page=${IMAGES_PER_PAGE}&page=${pageNumber}&api_key=${API_KEY}&format=json&nojsoncallback=1&extras=url_s`;

  // Fetch recent images
  const fetchRecentImages = async (pageNumber = 1, isInitial = false) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.get(buildFlickrApiUrl(pageNumber));
      const fetched = response?.data?.photos?.photo
        ?.map(photo => photo.url_s)
        .filter(Boolean) || [];

      if (fetched.length === 0) {
        setHasMore(false);
      }

      const updatedImages = pageNumber === 1
        ? fetched
        : [...images, ...fetched];

      setImages(updatedImages);

      // Cache only the first page
      if (pageNumber === 1) {
        await AsyncStorage.setItem('cachedImages', JSON.stringify(fetched));
      }

      setPage(pageNumber);
      setHasError(false);
    } catch (error) {
      setHasError(true);
      console.warn('Failed to fetch images:', error.message);

      if (pageNumber === 1) {
        const cached = await AsyncStorage.getItem('cachedImages');
        if (cached) {
          setImages(JSON.parse(cached));
        }
      }
    } finally {
      setIsLoading(false);
      if (isInitial) setInitialLoading(false);
    }
  };

  // Load favorite URLs from AsyncStorage
  const loadFavoriteImages = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      if (stored) setFavorites(JSON.parse(stored));
    } catch (error) {
      console.warn('Failed to load favorites:', error.message);
    }
  };

  // Toggle favorite/unfavorite
  const toggleFavorite = async (url) => {
    const updated =
      favorites.includes(url)
        ? favorites.filter(item => item !== url)
        : [...favorites, url];

    setFavorites(updated);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  };

  const isFavorite = (url) => favorites.includes(url);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchRecentImages(page + 1);
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

  const renderFooter = () =>
    isLoading ? <ActivityIndicator size="large" style={styles.loader} /> : null;

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      {/* <View style={styles.navBar}>
        <Text style={styles.navTitle}>Home</Text>
        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Text style={styles.navLink}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
            <Text style={styles.navLink}>Favorites</Text>
          </TouchableOpacity>
        </View>
      </View> */}

      {/* Main Content */}
      {initialLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : images.length === 0 ? (
        <Text style={styles.emptyText}>No images found.</Text>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item, index) => `${item}_${index}`}
          renderItem={renderImageItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.list}
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
    paddingTop: 5,
    backgroundColor: '#fff',
  },
  // navBar: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   paddingHorizontal: 16,
  //   paddingVertical: 10,
  //   backgroundColor: '#f0f0f0',
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#ccc',
  // },
  // navTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  // },
  // navLinks: {
  //   flexDirection: 'row',
  // },
  // navLink: {
  //   marginLeft: 20,
  //   fontSize: 16,
  //   color: '#007BFF',
  //   fontWeight: '600',
  // },
  imageWrapper: {
    position: 'relative',
    margin: 10,
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
    marginVertical: 20,
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
  list: {
    paddingBottom: 20,
  },
});
