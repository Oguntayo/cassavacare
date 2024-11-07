import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator'; // Import for Expo

export default function ReviewScreen({ route, navigation }) {
  const { photo } = route.params;
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  // Remediation messages for each disease class
  const remediationMessages = {
    "Bacterial Blight": 
      "Bacterial blight, caused by Xanthomonas axonopodis pv. manihotis, is a severe disease that can lead to significant yield loss in cassava. It is characterized by water-soaked lesions on leaves and stems. To effectively control bacterial blight, follow these steps:\n\n" +
      "1. **Fungicide Application**: Apply copper-based fungicides (e.g., Copper oxychloride) every 2-3 weeks during the rainy season to suppress bacterial growth.\n" +
      "2. **Sanitation**: Remove and destroy all infected leaves and stems immediately.\n" +
      "3. **Resistant Varieties**: Consider using resistant cassava varieties if available in your region, as they can significantly reduce the incidence of this disease.\n",

    "Brown Streak Disease": 
      "Brown streak disease is caused by two viruses, Cassava brown streak virus (CBSV) and Cassava brown streak virus 2 (CBSV-2), and is transmitted through infected cuttings and by whiteflies. To manage this disease:\n\n" +
      "1. **Crop Rotation**: Implement a crop rotation strategy, planting cassava only after two or more years in areas previously affected by the disease.\n" +
      "2. **Vector Control**: Monitor and manage whitefly populations using integrated pest management strategies, including insecticides if necessary.\n" +
      "3. **Remove Infected Plants**: Identify and remove any infected plants as soon as symptoms are observed to reduce the risk of spreading the virus.",

    "Green Mite": 
      "Green mite (Mononychellus tanajoa) infestation can severely damage cassava leaves, leading to reduced photosynthesis and ultimately lower yields. Effective management of green mites involves:\n\n" +
      "1. **Miticide Application**: Use appropriate miticides to control green mite populations, following the manufacturer's instructions for safe application.\n" +
      "2. **Cultural Practices**: Increase plant spacing to improve air circulation, which helps reduce the conditions conducive to mite infestation.\n" +
      "3. **Regular Monitoring**: Frequently check your plants for early signs of mite damage, such as stippling on leaves or webbing, and act quickly if they are found.\n",

    "Mosaic Disease": 
      "Mosaic disease, caused by various viruses, results in mottled leaves and stunted growth, significantly affecting cassava yield and quality. Management strategies include:\n\n" +
      "1. **Use Resistant Varieties**: Plant cassava varieties that have been bred for resistance to mosaic viruses.\n" +
      "2. **Vector Control**: Control aphid populations through integrated pest management practices.\n" +
      "3. **Field Sanitation**: Remove and destroy infected plants to prevent the spread of the virus to healthy plants.\n",

    "Healthy": 
      "Congratulations! Your cassava plant appears healthy, which indicates that proper care and management practices were followed. To maintain this status:\n\n" +
      "1. **Regular Monitoring**: Keep an eye on your plants for any signs of stress, pest infestations, or diseases, and address any issues promptly.\n" +
      "2. **Irrigation Management**: Maintain proper moisture levels in the soil to support healthy growth.\n" +
      "3. **Sanitation Practices**: Maintain good field hygiene by removing debris and weeds that can harbor pests and diseases.\n",

    "Unknown": 
      "The specific disease affecting your cassava plant could not be identified:\n\n" +
      "1. **Poor Photograph Quality**: Ensure that the picture of the leaf is clear and well-lit. Blurry or poorly captured images can hinder accurate diagnosis.\n" +
      "2. **Incorrect Specimen**: The image may not be of a cassava leaf. Double-check to confirm that the plant in the photograph is indeed cassava.\n" +
      "3. **Consult an Expert**: If you are unsure, reach out to an agricultural specialist or plant pathologist for a more accurate diagnosis."
  };

  const compressImage = async (uri) => {
    const compressedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 224, height: 224 } }], // Resize to 224x224
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress to 70%
    );
    return compressedImage.uri;
  };

  const sendPhotoToAPI = async () => {
    setLoading(true);
    const url = 'http://51.20.115.169/predict'; // Your actual API URL

    // Compress the image before sending it
    const compressedUri = await compressImage(photo.uri);

    const formData = new FormData();
    formData.append('file', {
      uri: compressedUri,
      type: 'image/jpeg', // Adjust if needed based on image type
      name: 'photo.jpg', // Adjust if needed
    });

    try {
      console.log('Sending request to:', url);
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response status:', response.status);
      if (response.ok) {
        const result = await response.json();
        console.log('Response data:', result);
        setPrediction(result);
      } else {
        console.error('Failed to fetch:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    sendPhotoToAPI();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Image source={{ uri: photo.uri }} style={styles.image} />
          {prediction ? (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>Prediction:</Text>
              <Text style={styles.resultText}>Predicted Class: {prediction.predicted_class}</Text>
              <Text style={styles.resultText}>Confidence Scores:</Text>
              {Object.entries(prediction.confidence_scores).map(([disease, score]) => (
                <View key={disease} style={styles.scoreContainer}>
                  <Text style={styles.diseaseText}>{disease}:</Text>
                  <Text style={styles.scoreText}>{score.toFixed(2)}</Text>
                </View>
              ))}
           
            </View>
          ) : (
            <Text style={styles.noResultText}>No prediction result available.</Text>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Confirmed', {
                photo: photo.uri,
                predictedClass: prediction.predicted_class,
                remediation: remediationMessages[prediction.predicted_class]
              })}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light background for better contrast
  },
  scrollView: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: '100%', 
    height: '50%', 
    aspectRatio: 1, // Maintain aspect ratio
    borderRadius: 0, // Remove rounded corners for full edge
    marginBottom: 20,
  },
  resultContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#ffffff', // White background for results
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4, // For Android shadow
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333', // Darker text for contrast
    marginVertical: 5,
  },
  remediationText: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
    textAlign: 'justify', // Justify for better readability
  },
  noResultText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
  flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#60a383',
    borderRadius: 5,
    maxWidth: 300,
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 2,
    flex: 1, // Allow buttons to flex and take available space
    marginHorizontal: 5, // Add margin between buttons
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    
  },

  diseaseText: {
    fontSize: 16,
    color: '#333',
    width: '90%', // Adjust this value to position text
    textAlign: 'left', // Align left for disease name
  },
  scoreText: {
    fontSize: 14,
    color: '#007bff',
  },
});
