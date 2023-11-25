import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { db, doc, setDoc, getDoc } from "../../firebaseConfig";

const DisplayResultsComponent = ({ imageUri, semesters, desiredTexts, setUploadComplete, selectedSchool, selectedDepartment, selectedYear }) => {

  // Firebase에서 학기별 좌표를 불러오는 함수
  const fetchSemesterCoordinatesFromFirebase = async () => {
    const semesterCoordinates = {};

    // 각 학기별로 Firestore에서 좌표 데이터를 조회합니다.
    for (const semester of semesters) {
      const semesterDocRef = doc(db, selectedSchool, selectedDepartment, selectedYear, semester);
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

  // Firebase에서 전공별 좌표를 불러오는 함수
  const fetchDesiredTextsCoordinatesFirebase = async () => {
    const desiredTextCoordinates = {};

    // 각 학기별로 Firestore에서 좌표 데이터를 조회합니다.
    for (const desiredText of desiredTexts) {
      const semesterDocRef = doc(db, selectedSchool, selectedDepartment, selectedYear, desiredText);
      const docSnap = await getDoc(semesterDocRef);

      if (docSnap.exists()) {
        const { minY } = docSnap.data();
        // 좌표 값을 조정합니다.
        desiredTextCoordinates[desiredText] = {
          first: 0,
          minY: minY - 50,
          maxY: 980 // maxY는 항상 980으로 고정
        };
      }
    }

    return desiredTextCoordinates;
  };

  const analyzeImage = async () => {
    if (!imageUri) {
      alert("첫 번째 이미지를 선택해주세요!");
      return;
    }
    try {
      setUploadComplete(false);
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

      // 각 텍스트 블록의 위치 정보를 사용하여 areasToHighlight를 설정합니다.
      const textAnnotations = apiResponse.data.responses[0].textAnnotations;

      // 각 학기별 말풍선의 좌표 범위를 정의
      const semesterAreas = await fetchSemesterCoordinatesFromFirebase();
      const desiredTextCoordinates = await fetchDesiredTextsCoordinatesFirebase();

      // 각 학기별로 텍스트 블록을 그룹화하기 위한 초기 구조를 설정합니다.
      let sortedTextsByGroup = {};
      for (const semester of semesters) {
        sortedTextsByGroup[semester] = {};
        for (let i = 0; i <= desiredTexts.length; i++) {
          sortedTextsByGroup[semester][`group${i + 1}`] = [];
        }
      }

      // 각 학기별 말풍선의 좌표 범위에 따라 텍스트 블록을 그룹화합니다.
      textAnnotations.forEach((annotation, index) => {
        if (index === 0) return; // 전체 텍스트는 건너뜁니다.

        const vertices = annotation.boundingPoly.vertices;
        const textBlock = {
          text: annotation.description,
          minX: Math.min(...vertices.map(v => v.x)),
          maxX: Math.max(...vertices.map(v => v.x)),
          minY: Math.min(...vertices.map(v => v.y)),
          maxY: Math.max(...vertices.map(v => v.y)),
        };

        // 각 학기별 좌표 범위에 맞는지 확인하고, 해당하는 그룹에 텍스트 블록을 할당합니다.
        for (const semester in semesterAreas) {
          const area = semesterAreas[semester];
          if (
            textBlock.minX >= area.minX && textBlock.maxX <= area.maxX &&
            textBlock.minY >= area.minY && textBlock.maxY <= area.maxY
          ) {
            // Y 좌표에 따라 해당하는 그룹을 찾습니다.
            let groupIndex = 0;
            while (groupIndex < desiredTexts.length && textBlock.minY > desiredTextCoordinates[desiredTexts[groupIndex]].minY) {
              groupIndex++;
            }

            // 같은 라인에 있는 텍스트 블록을 결합합니다.
            let addedToLine = false;
            for (const existingBlock of sortedTextsByGroup[semester][`group${groupIndex + 1}`]) {
              if (isSameLine(textBlock, existingBlock)) {
                existingBlock.text += ` ${textBlock.text}`;
                addedToLine = true;
                break;
              }
            }

            // 만약 현재 블록이 기존 라인에 추가되지 않았다면 새 라인으로 추가합니다.
            if (!addedToLine) {
              sortedTextsByGroup[semester][`group${groupIndex + 1}`].push(textBlock);
            }
            break;
          }
        }
      });

      // Firestore에 저장하기 전에 각 학기별로 텍스트 블록을 처리합니다.
      for (const semester in sortedTextsByGroup) {
        for (const group in sortedTextsByGroup[semester]) {
          sortedTextsByGroup[semester][group] = processTextBlocks(sortedTextsByGroup[semester][group]);
        }
      }


      // Firestore에 학기별로 그룹화된 텍스트 블록을 저장합니다.
      for (const semester in sortedTextsByGroup) {
        const ocrDocRef = doc(db, selectedSchool, selectedDepartment, selectedYear, semester);
        await setDoc(ocrDocRef, {
          groups: sortedTextsByGroup[semester],
          imageUri,
        }, { merge: true });
      }

      // 이미지 분석이 성공적으로 완료되면, setUploadComplete를 true로 설정합니다.
      setUploadComplete(true);

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