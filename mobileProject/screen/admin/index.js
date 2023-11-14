import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const DetectObject = () => {
  const [imageUri, setImageUri] = useState(null);
  const [labels, setLabels] = useState([]);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
      console.log(result)
    } catch (error) {
      console.error('이미지 picking 에러: ', error);
    }
  };

  const analyzeImage = async () => {
    try {
      if (!imageUri) {
        alert("첫 번째 이미지를 선택해주세요!");
        return;
      }
  
      // 구글 OCR API KEY
      const apiKey = "AIzaSyBwWnbAHz0KxxgwsON-qPzVmohJ-mU6Emc";
      const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  
      // 이미지 파일을 base64 형태로 전송
      const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const requestData = {
        requests: [
          {
            image: {
              content: base64ImageData,
            },
            features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
          },
        ],
      };
  
      const apiResponse = await axios.post(apiURL, requestData);
      const detectedText = apiResponse.data.responses[0].fullTextAnnotation.text;
   
      alert(`인식된 텍스트:\n${detectedText}`);
    } catch (error) {
      console.error("이미지 analyzing 에러: ", error);
      alert('이미지 analyzing 에러. 다시 시도해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Google Cloud Vision API Demo
      </Text>
      {imageUri && (
        <Image
          source={{uri: imageUri}}
          style={{ width: 300, height: 300}}
        />
      )}
      <TouchableOpacity
        onPress={pickImage}
        style={styles.button}
      >
        <Text style={styles.text}>이미지를 선택하세요</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={analyzeImage}
        style={styles.button}
      >
        <Text style={styles.text}>이미지 분석</Text>
      </TouchableOpacity>
      {
        labels.length > 0 && (
          <View>
            <Text style={styles.label}>
              Labels: 
            </Text>
            {
              labels.map((label) => (
                <Text
                  key={label.mid}
                  style={styles.outputtext}
                  >
                    {label.description}
                  </Text>
              ))
            }
          </View>
        )
      }
    </View>
  )
}

export default DetectObject;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 50,
    marginTop: 100,
  },
  button: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  outputtext: {
    fontSize: 18,
    marginBottom: 10,
  },
});