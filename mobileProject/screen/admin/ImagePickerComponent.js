import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { db, doc, setDoc } from '../../firebaseConfig';

const ImagePickerComponent = ({ onImagePicked, setProcessing, setOcrComplete }) => {
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
    setProcessing(true); // Indicate processing is ongoing
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

        if (blockText.includes('1-1 학기') || blockText.includes('1-2 학기') ||
            blockText.includes('2-1 학기') || blockText.includes('2-2 학기') ||
            blockText.includes('3-1 학기') || blockText.includes('3-2 학기') ||
            blockText.includes('4-1 학기') || blockText.includes('4-2 학기')) {
              const vertices = block.boundingBox.vertices;
              const textCoordinates = {
                minX: Math.min(...vertices.map(v => v.x)),
                maxX: Math.max(...vertices.map(v => v.x)),
                minY: Math.min(...vertices.map(v => v.y)),
                maxY: Math.max(...vertices.map(v => v.y)),
              };
    
              const semester = blockText.match(/1-1 학기|1-2 학기|2-1 학기|2-2 학기|3-1 학기|3-2 학기|4-1 학기|4-2 학기/)[0];
              const semesterDocRef = doc(db, 'ocr', semester);
              await setDoc(semesterDocRef, textCoordinates, { merge: true });
              foundSemesterText = true;
            }
          }
    
          if (!foundSemesterText) {
            Alert.alert("올바른 사진을 업로드해주세요.");
            onImagePicked(null); // Reset the image URI
          } else {
            setOcrComplete(true); // Indicate that OCR processing is complete
          }
        } catch (error) {
          console.error("OCR 처리 중 에러 발생: ", error);
          Alert.alert("OCR 처리 중 에러 발생.");
        } finally {
          setProcessing(false); // Processing is done
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
    