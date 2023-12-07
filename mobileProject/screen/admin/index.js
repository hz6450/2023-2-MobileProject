// OCR 페이지 화면

import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import ImagePickerComponent from './ImagePickerComponent';
import ImageAnalyzerComponent from './ImageAnalyzerComponent';
import DisplayResultsComponent from './DisplayResultsComponent';

const Ocr = ({ route, navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [ocrComplete, setOcrComplete] = useState(false);

  // 순서대로 학교, 학과, 년도, 전공 목록 배열, 전공 필수 과목 배열
  const selectedSchool = route.params?.selectedSchool;
  const selectedDepartment = route.params?.selectedDepartment;
  const selectedYear = route.params?.selectedYear;
  const desiredTexts = route.params?.desiredTexts || [];
  const specialSubjects = route.params?.specialSubjects || [];
  const semesters = route.params?.semesters || [];

  // 이미지 분석이 완료되었을 때 호출되는 함수
  const handleOcrComplete = () => {
    setOcrComplete(true);
    navigation.navigate('OcrResultsStack', {
      screen: 'OcrResultsEditor',
      params: {
        selectedSchool: selectedSchool,
        selectedDepartment: selectedDepartment,
        selectedYear: selectedYear,
        semesters: semesters,
        desiredTexts: desiredTexts,
        specialSubjects: specialSubjects,
      },
    });
  };
  
  useEffect(() => {
    if (uploadComplete) {
      handleOcrComplete();
    }
  }, [uploadComplete]);

  // setImageUri: 이미지 Uri, setProcessing: 이미지 선택 여부
  // semesters ~ selectedYear: adminHome에서 받은 값을 넘겨줌
  return (
    <>
      <ImagePickerComponent
        onImagePicked={setImageUri}
        setProcessing={setProcessing}
        semesters={semesters}
        desiredTexts={desiredTexts}
        selectedSchool={selectedSchool}
        selectedDepartment={selectedDepartment}
        selectedYear={selectedYear}
      />
      <ImageAnalyzerComponent
        imageUri={imageUri}
      />
      <DisplayResultsComponent
        imageUri={imageUri}
        semesters={semesters}
        desiredTexts={desiredTexts}
        setUploadComplete={setUploadComplete}
        selectedSchool={selectedSchool}
        selectedDepartment={selectedDepartment}
        selectedYear={selectedYear}
      />
      {uploadComplete && (
        <TouchableOpacity
          onPress={handleOcrComplete}
        >
        </TouchableOpacity>
      )}
    </>
  );
};

// 장식
const styles = StyleSheet.create({
  
});

export default Ocr;
