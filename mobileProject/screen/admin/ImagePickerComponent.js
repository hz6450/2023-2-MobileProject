import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerComponent = ({ onImagePicked }) => {
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        onImagePicked(result.assets[0].uri);
      }
    } catch (error) {
      console.error('이미지 picking 에러: ', error);
    }
  };

  return (
    <TouchableOpacity onPress={pickImage} style={styles.button}>
      <Text style={styles.text}>이미지를 선택하세요</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default ImagePickerComponent;
