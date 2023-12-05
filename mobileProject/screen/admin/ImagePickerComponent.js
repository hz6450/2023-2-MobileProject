import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { db, doc, setDoc } from '../../firebaseConfig';

const ImagePickerComponent = ({ onImagePicked, setProcessing, semesters, desiredTexts, selectedSchool, selectedDepartment, selectedYear }) => {

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        onImagePicked(result.assets[0].uri);
        await processImageForOcr(result.assets[0].uri);
      }
    } catch (error) {
      console.error('이미지 picking 에러: ', error);
    }
  };

  const processImageForOcr = async (imageUri) => {
    setProcessing(true);
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
    const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.EXPO_PUBLIC_apiKey}`;

    try {
      const response = await axios.post(apiURL, requestData);
      const blocks = response.data.responses[0].fullTextAnnotation.pages[0].blocks;

      let foundSemesterText = false;
      for (const block of blocks) {
        const blockText = block.paragraphs.map(paragraph =>
          paragraph.words.map(word => word.symbols.map(symbol => symbol.text).join('')).join(' ')
        ).join('\n');

        const matchedSemester = semesters.find(semester => blockText.includes(semester));

        const matchedText = desiredTexts.find(text => blockText.includes(text));


        if (matchedSemester || matchedText) {
          const vertices = block.boundingBox.vertices;
          const textCoordinates = {
            minX: Math.min(...vertices.map(v => v.x)),
            maxX: Math.max(...vertices.map(v => v.x)),
            minY: Math.min(...vertices.map(v => v.y)),
            maxY: Math.max(...vertices.map(v => v.y)),
          };

          if (matchedSemester) {
            const semesterDocRef = doc(db, selectedSchool, selectedDepartment, selectedYear, matchedSemester);
            await setDoc(semesterDocRef, textCoordinates, { merge: true });
            foundSemesterText = true;
          }
          if (matchedText) {
            const textDocRef = doc(db, selectedSchool, selectedDepartment, selectedYear, matchedText);
            await setDoc(textDocRef, textCoordinates, { merge: true });
            foundDesiredText = true; // 상태 업데이트
          }
        }
      }

      if (!foundSemesterText) {
        Alert.alert("올바른 사진을 업로드해주세요.");
        onImagePicked(null);
      }
    } catch (error) {
      console.error("OCR 처리 중 에러 발생: ", error);
      Alert.alert("OCR 처리 중 에러 발생.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.text}>이미지를 선택하세요</Text>
      </TouchableOpacity>
    </View>
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
