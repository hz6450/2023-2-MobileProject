import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Svg, { Rect } from "react-native-svg";
import { db, doc, setDoc } from "../../firebaseConfig";

const Ocr = () => {
  const [imageUri, setImageUri] = useState(null);
  const [labels, setLabels] = useState([]);
  const [highlightedAreas, setHighlightedAreas] = useState([]);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const fixedWidth = 1030;
  const fixedHeight = 1008;

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
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

      // 구글 OCR
      const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.EXPO_PUBLIC_apiKey}`;

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

      // 각 학기별 말풍선의 좌표 범위를 정의합니다. (예시 값입니다. 실제 좌표에 맞게 조정해야 합니다)
      const semesterAreas = {
        '1-1학기': { minX: 100, maxX: 200, minY: 60, maxY: 430 },
        '1-2학기': { minX: 210, maxX: 310, minY: 60, maxY: 430 },
        '2-1학기': { minX: 320, maxX: 420, minY: 60, maxY: 980 },
        '2-2학기': { minX: 440, maxX: 540, minY: 60, maxY: 980 },
        '3-1학기': { minX: 560, maxX: 660, minY: 60, maxY: 980 },
        '3-2학기': { minX: 670, maxX: 770, minY: 60, maxY: 980 },
        '4-1학기': { minX: 780, maxX: 880, minY: 60, maxY: 980 },
        '4-2학기': { minX: 890, maxX: 1000, minY: 60, maxY: 980 },
      };

      // 각 텍스트 블록의 위치 정보를 사용하여 areasToHighlight를 설정합니다.
      const textAnnotations = apiResponse.data.responses[0].textAnnotations;

      let areasToHighlight = [];
      let sortedTexts = {};
      for (const semester in semesterAreas) {
        sortedTexts[semester] = [];
      }

      const processTextBlocks = (textBlocks) => {
        const processedTexts = [];

        textBlocks.forEach(block => {
          const currentBlockText = block.text.trim();
          if (currentBlockText.length > 0) {
            processedTexts.push(currentBlockText);
          }
        });

        return processedTexts;
      };

      // 각 학기별 영역에 맞는지 확인하고 텍스트 블록 묶기
      textAnnotations.forEach((annotation, index) => {
        // 첫 번째 항목(전체 텍스트)은 건너뜁니다.
        if (index === 0) return;

        // 각 꼭지점의 좌표를 기반으로 블록의 최소/최대 x, y 좌표를 계산합니다.
        const vertices = annotation.boundingPoly.vertices;
        const textBlock = {
          text: annotation.description,
          minX: Math.min(...vertices.map(v => v.x)),
          maxX: Math.max(...vertices.map(v => v.x)),
          minY: Math.min(...vertices.map(v => v.y)),
          maxY: Math.max(...vertices.map(v => v.y)),
        };

        // 각 학기별 영역에 맞는지 확인합니다.
        for (const semester in semesterAreas) {
          const area = semesterAreas[semester];
          if (
            textBlock.minX >= area.minX && textBlock.maxX <= area.maxX &&
            textBlock.minY >= area.minY && textBlock.maxY <= area.maxY
          ) {
            // 같은 라인에 있는 텍스트 블록을 결합합니다.
            let addedToLine = false;
            for (const existingBlock of sortedTexts[semester]) {
              if (isSameLine(textBlock, existingBlock)) {
                existingBlock.text += ` ${textBlock.text}`;
                addedToLine = true;
                break;
              }
            }
            // 만약 현재 블록이 기존 라인에 추가되지 않았다면 새 라인으로 추가합니다.
            if (!addedToLine) {
              sortedTexts[semester].push(textBlock);
            }
            break;
          }
        }
      });

      setHighlightedAreas(areasToHighlight);

      // Firestore에 저장하기 전에 각 학기별로 텍스트 블록을 처리합니다.
      for (const semester in sortedTexts) {
        sortedTexts[semester] = processTextBlocks(sortedTexts[semester]);
      }

      // Firestore에 학기별로 추출된 텍스트를 저장하는 부분을 수정합니다.
      for (const semester in sortedTexts) {
        const ocrDocRef = doc(db, 'ocr', semester);
        await setDoc(ocrDocRef, {
          detectedText: sortedTexts[semester], // 텍스트 블록을 배열로 저장합니다.
          imageUri,
        }, { merge: true });
      }


      alert(`인식된 텍스트:\n${detectedText}`);
    } catch (error) {
      console.error("이미지 analyzing 에러: ", error);
      alert('이미지 analyzing 에러. 다시 시도해주세요.');
    }
  };

  function isSameLine(block1, block2) {
    const yThreshold = 15; // y 좌표 차이가 이 값 이하이면 같은 라인으로 간주
    return Math.abs(block1.minY - block2.minY) < yThreshold ||
      Math.abs(block1.maxY - block2.maxY) < yThreshold;
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>
          분류할 이미지 업로드
        </Text>
        {imageUri && (
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: 300, height: 300 }}
              onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                setImageSize({ width, height });
              }}
            />
            <Svg height={imageSize.height} width={imageSize.width} style={styles.overlay}>
              {highlightedAreas.map((area, index) => (
                <Rect
                  key={index}
                  x={area.x * (imageSize.width / fixedWidth)} // 이미지와 화면 크기 비율에 따라 조정
                  y={area.y * (imageSize.height / fixedHeight)} // 이미지와 화면 크기 비율에 따라 조정
                  width={area.width * (imageSize.width / fixedWidth)} // 이미지와 화면 크기 비율에 따라 조정
                  height={area.height * (imageSize.height / fixedHeight)} // 이미지와 화면 크기 비율에 따라 조정
                  stroke="blue"
                  strokeWidth="2"
                  fill="none"
                />
              ))}
            </Svg>
          </View>
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
    </ScrollView>

  )
}

export default Ocr;

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