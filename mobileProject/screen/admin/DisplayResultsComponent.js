import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { db, doc, setDoc, getDoc } from "../../firebaseConfig";

const DisplayResultsComponent = ({ imageUri }) => {
  // 구글 OCR 응답에서 특정 전공의 텍스트 좌표를 찾고 Firebase에 저장하는 함수
  const saveTextCoordinatesToFirebase = async (textBlocks, desiredTexts) => {
    textBlocks.forEach(block => {
      const text = block.text;
      Object.keys(desiredTexts).forEach(desiredText => {
        if (text.includes(desiredText)) {
          const { minX, minY, maxX, maxY } = block.coordinates;
          const textCoordinates = { minX, minY, maxX, maxY };

          const textDocRef = doc(db, 'ocr', desiredText);
          setDoc(textDocRef, textCoordinates, { merge: true });

          delete desiredTexts[desiredText];
        }
      });
    });
  };

  // 1-1학기~ 4-2학기 까지
  const saveSemesterCoordinatesToFirebase = async (textBlocks, semesterAreas) => {
    textBlocks.forEach(block => {
      const text = block.text;
      for (const semester in semesterAreas) {
        if (text.includes(semester)) {
          const { minX, minY, maxX, maxY } = block.coordinates;
          const semesterCoordinates = { minX, minY, maxX, maxY };

          const semesterDocRef = doc(db, 'ocr', semester);
          setDoc(semesterDocRef, semesterCoordinates, { merge: true });
          break; // 일치하는 학기를 찾았으면 더 이상 순회하지 않습니다.
        }
      }
    });
  };

  // Firebase에서 학기별 좌표를 불러오는 함수
  const fetchSemesterCoordinatesFromFirebase = async () => {
    const semesterCoordinates = {};

    // 각 학기별로 Firestore에서 좌표 데이터를 조회합니다.
    for (const semester of ['1-1 학기', '1-2 학기', '2-1 학기', '2-2 학기', '3-1 학기', '3-2 학기', '41 학기', '4-2 학기']) {
      const semesterDocRef = doc(db, 'ocr', semester);
      const docSnap = await getDoc(semesterDocRef);

      if (docSnap.exists()) {
        const { minX, maxX, minY } = docSnap.data();
        // 좌표 값을 조정합니다.
        semesterCoordinates[semester] = {
          minX: minX - 30,
          maxX: maxX + 30,
          minY: minY + 30,
          maxY: 980 // maxY는 항상 980으로 고정합니다.
        };
      }
    }

    return semesterCoordinates;
  };

  const analyzeImage = async () => {
    if (!imageUri) {
      alert("첫 번째 이미지를 선택해주세요!");
      return;
    }
    try {

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

      // 구글 OCR
      const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.EXPO_PUBLIC_apiKey}`;

      const apiResponse = await axios.post(apiURL, requestData);
      const detectedText = apiResponse.data.responses[0].fullTextAnnotation.text;

      const blocks = apiResponse.data.responses[0].fullTextAnnotation.pages[0].blocks;
      const textBlocks = blocks.map(block => {
        const blockText = block.paragraphs.map(paragraph =>
          paragraph.words.map(word =>
            word.symbols.map(symbol => symbol.text).join('')
          ).join(' ')
        ).join('\n');

        const vertices = block.boundingBox.vertices;
        const textCoordinates = {
          minX: Math.min(...vertices.map(v => v.x)),
          maxX: Math.max(...vertices.map(v => v.x)),
          minY: Math.min(...vertices.map(v => v.y)),
          maxY: Math.max(...vertices.map(v => v.y)),
        };

        return { text: blockText, coordinates: textCoordinates };
      });

      // 각 텍스트 블록의 위치 정보를 사용하여 areasToHighlight를 설정합니다.
      const textAnnotations = apiResponse.data.responses[0].textAnnotations;

      // 각 학기별 말풍선의 좌표 범위를 정의
      const semesterAreas = await fetchSemesterCoordinatesFromFirebase();


      const desiredTexts = {
        "공통 전공": true,
        "컴퓨터 공학 전공": true,
        "빅 데이터 전공": true,
        "게임 소프트웨어 전공": true,
      };

      await saveTextCoordinatesToFirebase(textBlocks, desiredTexts);
      await saveSemesterCoordinatesToFirebase(textBlocks, semesterAreas);

      let sortedTexts = {};
      for (const semester in semesterAreas) {
        sortedTexts[semester] = [];
      }

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

  function isSameLine(block1, block2) {
    const yThreshold = 15; // y 좌표 차이가 이 값 이하이면 같은 라인으로 간주
    return Math.abs(block1.minY - block2.minY) < yThreshold ||
      Math.abs(block1.maxY - block2.maxY) < yThreshold;
  }

  return (
    <TouchableOpacity onPress={analyzeImage} style={styles.button}>
      <Text style={styles.text}>이미지 분석</Text>
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

export default DisplayResultsComponent;