import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const AdminHomeScreen = ({ navigation }) => {
  const [selectedSchool, setSelectedSchool] = useState('선문대');
  const [selectedDepartment, setSelectedDepartment] = useState('컴퓨터공학');
  const [selectedYear, setSelectedYear] = useState('2023');

  const semesters = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2', '41'];

  const navigateToOCR = () => {
    navigation.navigate('Ocr', {
      selectedSchool,
      selectedDepartment,
      selectedYear,
    });
  };

  const navigateManage = () => {
    navigation.navigate('OcrResultsStack', {
      screen: 'OcrResultsEditor',
      params: {
        selectedSchool: selectedSchool,
        selectedDepartment: selectedDepartment,
        selectedYear: selectedYear,
        semesters: semesters
      },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>관리자 페이지입니다</Text>
      <Picker
        selectedValue={selectedSchool}
        onValueChange={(itemValue) => setSelectedSchool(itemValue)}>
        <Picker.Item label="선문대" value="선문대" />
        <Picker.Item label="호서대" value="호서대" />
      </Picker>
      <Picker
        selectedValue={selectedDepartment}
        onValueChange={(itemValue) => setSelectedDepartment(itemValue)}>
        <Picker.Item label="컴퓨터공학" value="컴퓨터공학" />
        <Picker.Item label="사회복지학" value="사회복지학" />
      </Picker>
      <Picker
        selectedValue={selectedYear}
        onValueChange={(itemValue) => setSelectedYear(itemValue)}>
        <Picker.Item label="2019" value="2019" />
        <Picker.Item label="2020" value="2020" />
        <Picker.Item label="2021" value="2021" />
        <Picker.Item label="2022" value="2022" />
        <Picker.Item label="2023" value="2023" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={navigateToOCR}>
        <Text style={styles.buttonText}>OCR</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateManage}>
        <Text style={styles.buttonText}>상세 설정</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#f0f0f0', // 전체 배경색 변경
  },
  dashboard: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#ffffff', // 대시보드 배경색 변경
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartContainer: {
    width: screenWidth - 40,
    borderWidth: 1,
    borderColor: '#e0e0e0', // 테두리 색상 변경
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  infoContainer: {
    width: screenWidth - 40,
    borderWidth: 1,
    borderColor: '#e0e0e0', // 테두리 색상 변경
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  infoText: {
    fontSize: 18,
    marginVertical: 5,
    color: '#333', // 기본 텍스트 색상 변경
  },
  infoTextRed: {
    fontSize: 18,
    marginVertical: 5,
    color: '#d32f2f', // 강조 텍스트 색상 변경
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333', // 제목 텍스트 색상 변경
  },
  button: {
    backgroundColor: '#4caf50', // 버튼 배경색 변경
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center', // 추가: 버튼 내부 텍스트를 중앙 정렬
    marginVertical: 10,
    width: 200, // 버튼 너비
    height: 50, // 버튼 높이
  },
  buttonText: {
    color: '#fff', // 버튼 텍스트 색상 변경
    fontSize: 16,
    fontWeight: 'bold',
  },
  // 기타 필요한 스타일 정의
});


export default AdminHomeScreen;
