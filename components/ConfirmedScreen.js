import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const ConfirmedScreen = ({ route, navigation }) => {
  const { photo, predictedClass, remediation } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo }} style={styles.image} />

      <Text style={styles.label}>Predicted Class:{predictedClass}</Text>     
        
        <Text style={styles.label}>Remediation</Text>
      <View style={styles.resultContainer}>
        <Text style={styles.remediation}>{remediation}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')} // Adjust 'Home' to match your home screen name
        >
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Ensures button is at the bottom
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '50%',
    marginBottom: 5, // Space between the image and the label
  },
  resultContainer: {
    alignItems: 'center',
    padding: 15, // Space around the result container
    backgroundColor: '#ffffff', // White background for contrast
    borderRadius: 10, // Rounded corners for the result container
    shadowColor: '#000', // Shadow for elevation
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Elevation for Android
    marginBottom: 0, // Space below the result container
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  prediction: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
  },
  remediation: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#2f4f4f',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20, // Adds space at the bottom
    marginBottom:10,
  },
  button: {
    backgroundColor: '#60a383',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ConfirmedScreen;
