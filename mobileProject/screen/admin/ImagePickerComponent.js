import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { db, doc, setDoc } from '../../firebaseConfig';

const ImagePickerComponent = ({ onImagePicked, setProcessing, semesters, desiredTexts, selectedSchool, setSelectedSchool, selectedDepartment, setSelectedDepartment, selectedYear, setSelectedYear }) => {

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
      {/* 학교 선택 드롭다운 */}
      <Picker
  selectedValue={selectedSchool}
  onValueChange={(itemValue, itemIndex) => setSelectedSchool(itemValue)}
>
        <Picker.Item label="선문대" value="선문대" />
        <Picker.Item label="호서대" value="호서대" />
      </Picker>

      {/* 학과 선택 드롭다운 */}
      <Picker
        selectedValue={selectedDepartment}
        onValueChange={(itemValue, itemIndex) => setSelectedDepartment(itemValue)}>
        <Picker.Item label="컴퓨터공학" value="컴퓨터공학" />
        <Picker.Item label="사회복지학" value="사회복지학" />
      </Picker>

      {/* 년도 선택 드롭다운 */}
      <Picker
        selectedValue={selectedYear}
        onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}>
        <Picker.Item label="2019" value="2019" />
        <Picker.Item label="2020" value="2020" />
        <Picker.Item label="2021" value="2021" />
        <Picker.Item label="2022" value="2022" />
        <Picker.Item label="2023" value="2023" />
      </Picker>

      {/* 이미지 선택 버튼 */}
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
