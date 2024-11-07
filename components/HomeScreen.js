// components/HomeScreen.js
import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

// Import your images
const logo = require('../assets/logo.png'); // Replace with your logo path
const cameraIcon = require('../assets/camera.png'); // Replace with your camera icon path
const uploadIcon = require('../assets/upload.png'); // Replace with your upload icon path

export default function HomeScreen() {
  const navigation = useNavigation();

  const openCamera = () => {
    navigation.navigate('Camera');
  };

  const uploadPicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      navigation.navigate('Review', { photo: result.assets[0] });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <TouchableOpacity 
  style={styles.button} 
  onPress={openCamera}
  accessible={true} 
  accessibilityLabel="Open Camera"
>

        <Image source={cameraIcon} style={styles.icon} />
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity 
  style={styles.button} 
  onPress={uploadPicture}
  accessible={true} 
  accessibilityLabel="Upload Picture">
        <Image source={uploadIcon} style={styles.icon} />
        <Text style={styles.buttonText}>Upload Picture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', 
  },
  logo: {
    width: '100%', 
    height: undefined, 
    aspectRatio: 1, // Adjust aspect ratio based on logo dimensions
    marginBottom: 10,
  },
  

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#60a383',
    padding: 15,
    margin: 10,
    borderRadius: 5,
    width: '80%', 
    maxWidth: 300,// Optional: Set a width for buttons
  },
  icon: {
    width: 24, // Adjust size as needed
    height: 24, // Adjust size as needed
    marginRight: 40, // Space between icon and text
    marginLeft: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
