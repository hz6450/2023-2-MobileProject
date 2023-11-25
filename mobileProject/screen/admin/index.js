import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import ImagePickerComponent from './ImagePickerComponent';
import ImageAnalyzerComponent from './ImageAnalyzerComponent';
import DisplayResultsComponent from './DisplayResultsComponent';

const Ocr = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [ocrComplete, setOcrComplete] = useState(false);

  // ImagePickerComponent에서 사용될 useState를 여기로 옮깁니다.
  const [selectedSchool, setSelectedSchool] = useState('선문대');
  const [selectedDepartment, setSelectedDepartment] = useState('컴퓨터공학');
  const [selectedYear, setSelectedYear] = useState('2023');
  
  // semesters의 경우 고정값 사용
  const semesters = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2', '41'];

  // desiredTexts의 경우 과마다 값이 달라져야 함. 지금은 고정값
  const desiredTexts = ["공통 전공", "컴퓨터 공학 전공", "빅 데이터 전공", "게임 소프트웨어 전공"];

  // 이미지 분석이 완료되었을 때 호출되는 함수
  const handleOcrComplete = () => {
    setOcrComplete(true);
    navigation.navigate('OcrResultsStack', {
      screen: 'OcrResultsEditor',
      params: {
        selectedSchool: selectedSchool,
        selectedDepartment: selectedDepartment,
        selectedYear: selectedYear,
        semesters: semesters
      },
    });
  };
  
  useEffect(() => {
    if (uploadComplete) {
      handleOcrComplete();
    }
  }, [uploadComplete]);

  return (
    <>
      <ImagePickerComponent
        onImagePicked={setImageUri}
        setProcessing={setProcessing}
        semesters={semesters}
        desiredTexts={desiredTexts}
        selectedSchool={selectedSchool}
        setSelectedSchool={setSelectedSchool}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
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
          style={styles.button}
        >
          <Text style={styles.buttonText}>수정하기</Text>
        </TouchableOpacity>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Ocr;
