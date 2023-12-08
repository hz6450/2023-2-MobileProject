// 이미지 선택 및 OCR을 해서 특정 텍스트의 좌표값을 저장하는 컴포넌트

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { db, doc, setDoc } from '../../firebaseConfig';

// 순서대로 
const ImagePickerComponent = ({ onImagePicked, setProcessing, semesters, desiredTexts, selectedSchool, selectedDepartment, selectedYear }) => {

  // 이미지를 선택. 중간에 오류가 발생 시 에러 메시지 출력
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

  // 이미지를 선택했을 경우 google OCR 기능을 이용해 OCR 기능 수행.
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

    // 값을 block 단위로 받음
    try {
      const response = await axios.post(apiURL, requestData);
      const blocks = response.data.responses[0].fullTextAnnotation.pages[0].blocks;

      let foundSemesterText = false;
      let foundDesiredText = false;
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

      // 만약 인식해야 하는 텍스트를 인식하지 못했을 경우, 올바르지 못한 사진으로 판단.
      if (!foundSemesterText && !foundDesiredText) {
        Alert.alert("올바른 사진을 업로드해주세요.");
        onImagePicked(null);
      }

      // 중간에 오류가 발생했을 경우 에러처리
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
    backgroundColor: '#4CAF50', // 더 선명한 색상
    padding: 15,
    borderRadius: 10, // 모서리 둥글게
    alignItems: 'center',
    margin: 20,
  },
  text: {
    fontSize: 18,
    color: 'white', // 텍스트 색상 변경
    fontWeight: 'bold',
  },
});


export default ImagePickerComponent;
