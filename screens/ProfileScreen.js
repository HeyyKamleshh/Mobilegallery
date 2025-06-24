import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Profile',
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.openDrawer} style={{ marginLeft: 15 }}>
          <Icon name="menu" size={26} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem('profile');
      if (saved) {
        const data = JSON.parse(saved);
        setProfile(data);
        setIsEditing(false);
      }
    } catch (e) {
      console.error('Error loading profile:', e);
    }
  };

  const handleSave = async () => {
    const newProfile = { name, email, bio };
    try {
      await AsyncStorage.setItem('profile', JSON.stringify(newProfile));
      setProfile(newProfile);
      setIsEditing(false);
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  };

  const startEditing = () => {
    setName(profile?.name || '');
    setEmail(profile?.email || '');
    setBio(profile?.bio || '');
    setIsEditing(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Profile</Text>

      <Image
        source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
        style={styles.avatar}
      />

      {isEditing ? (
        <>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
            style={styles.input}
          />
          <Button title="Save Profile" onPress={handleSave} />
        </>
      ) : profile ? (
        <>
          <Text style={styles.label}><Text style={{ fontWeight: 'bold' }}>Name: </Text>{profile.name}</Text>

          <Text style={styles.label}><Text style={{ fontWeight: 'bold' }}>Email: </Text>{profile.email}</Text>

          <Text style={styles.label}><Text style={{ fontWeight: 'bold' }}>Bio: </Text>{profile.bio}</Text>
          
          <Button title="Edit Profile" onPress={startEditing} />
        </>
      ) : null}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 8,
    borderRadius: 6,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
});
