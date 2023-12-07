// 관리자 페이지 첫 화면

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Dimensions } from 'react-native';
import HelpModal from './helpModal';

const screenWidth = Dimensions.get('window').width;

const AdminHomeScreen = ({ navigation }) => {
  const [selectedSchool, setSelectedSchool] = useState('선문대');
  const [selectedDepartment, setSelectedDepartment] = useState('컴퓨터공학');
  const [selectedYear, setSelectedYear] = useState('2023');
  const [modalVisible, setModalVisible] = useState(false);
  const [majorModalVisible, setMajorModalVisible] = useState(false);

  const semesters = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2', '41'];

  // 전공 구분과 전공 필수 리스트 및 드롭다운 값들을 OCR로 전달
  const navigateToOCR = () => {
    const desiredTexts = getDesiredTexts();
    const specialSubjects = getSpecialSubjects();
    navigation.navigate('Ocr', {
      selectedSchool,
      selectedDepartment,
      selectedYear,
      desiredTexts,
      specialSubjects,
      semesters,
    });
  };

  // 전공 구분과 전공 필수 리스트 및 드롭다운 값들을 OCRResult로 전달
  const navigateManage = () => {
    const desiredTexts = getDesiredTexts();
    const specialSubjects = getSpecialSubjects();
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
  }

  // 드롭다운 메뉴에서 선택값에 따라 desiredTexts를 결정하는 함수
  const getDesiredTexts = () => {
    if (selectedSchool === '선문대' && selectedDepartment === '컴퓨터공학') {
      if (selectedYear === '2023') {
        return ["공통 전공", "컴퓨터 공학 전공", "빅 데이터 전공", "게임 소프트웨어 전공"];
      } else if (selectedYear >= '2019' && selectedYear <= '2022') {
        return ["공통 전공", "컴퓨터 공학 전공", "데이터 공학 전공"];
      }
    } else if (selectedSchool === '선문대' && selectedDepartment === '경영학') {
      if (selectedYear >= '2019' && selectedYear <= '2023') {
        return ["회계", "경영 정보", "마케팅", "인사 조직", "재무", "경영 과학"];
      }
    }
    // 기본값이나 다른 조건에 맞는 값을 반환
    return [];
  };

  // 드롭다운 메뉴에서 선택값에 따라 전공 필수를 결정하는 함수
  const getSpecialSubjects = () => {
    if (selectedSchool === '선문대' && selectedDepartment === '컴퓨터공학') {
      if (selectedYear === '2023') {
        return ["기초 프로젝트", "오픈 소스 SW 프로젝트", "모바일 SW 프로젝트", "종합 프로젝트"];
      } else if (selectedYear >= '2019' && selectedYear <= '2022') {
        return ["데이터 구조", "알고리즘", "컴퓨터 구조", "오픈 소스 SW 프로젝트", "운영체제", "종합 프로젝트"];
      }
    }
    return [];
  };
  
  // 현재 선택된 드롭다운 값을 기반으로 desiredTexts를 가져오는 함수
  const desiredTexts = getDesiredTexts();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>관리자 페이지</Text>
      <Text style={styles.smalltitle}>교육과정 표를 업로드하고 관리할 수 있습니다.</Text>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.helpButton}>
        <Text style={styles.helpButtonText}>?</Text>
      </TouchableOpacity>

      {/* 도움말 */}
      <HelpModal modalVisible={modalVisible} setModalVisible={setModalVisible} />

      {/* 드롭다운 */}
      <Picker
        selectedValue={selectedSchool}
        onValueChange={(itemValue) => setSelectedSchool(itemValue)}>
        <Picker.Item label="선문대" value="선문대" />
      </Picker>
      <Picker
        selectedValue={selectedDepartment}
        onValueChange={(itemValue) => setSelectedDepartment(itemValue)}>
        <Picker.Item label="컴퓨터공학" value="컴퓨터공학" />
        <Picker.Item label="경영학" value="경영학" />
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

      {/* "전공 확인" 버튼 */}
      <TouchableOpacity
        onPress={() => setMajorModalVisible(true)}
        style={styles.majorButton}
      >
        <Text style={styles.majorButtonText}>전공 확인</Text>
      </TouchableOpacity>

      {/* "전공 확인" 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={majorModalVisible}
        onRequestClose={() => {
          setMajorModalVisible(!majorModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {desiredTexts.map((text, index) => (
              <Text key={index} style={styles.modalText}>
                {text}
              </Text>
            ))}
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setMajorModalVisible(!majorModalVisible)}
            >
              <Text style={styles.textStyle}>닫기</Text>
            </TouchableOpacity>
            <Text style={styles.modalSubText}>전공이 맞지 않을 경우 관리자에게 문의바랍니다</Text>
          </View>
        </View>
      </Modal>


      <TouchableOpacity style={styles.button} onPress={navigateToOCR}>
        <Text style={styles.buttonText}>업로드(OCR)</Text>
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
  smalltitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333', // 제목 텍스트 색상 변경
  },
  button: {
    backgroundColor: '#4caf50', // 버튼 배경색 변경
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 80,
    width: 200,
    height: 50,
  },
  buttonText: {
    color: '#fff', // 버튼 텍스트 색상 변경
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpButton: {
    // 물음표 버튼 스타일
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButtonText: {
    // 물음표 버튼 텍스트 스타일
    fontSize: 18,
  },
  centeredView: {
    // 모달 중앙 정렬을 위한 스타일
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    // 모달 뷰 스타일
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textStyle: {
    // 모달 닫기 버튼 텍스트 스타일
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    // 모달 텍스트 스타일
    marginBottom: 15,
    textAlign: "center"
  },
  modalSubText: {
    textAlign: "center",
  },
  desiredTextsContainer: {
    // 선택된 전공 텍스트를 표시하기 위한 컨테이너 스타일
    marginTop: 20,
    alignItems: 'center',
  },
  desiredText: {
    // 전공 텍스트 스타일
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  majorButton: {
    // "전공 확인" 버튼 스타일
    backgroundColor: '#6a51ae', // 버튼 배경색 변경
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 80,
    width: 200, // 버튼 너비 조정
    height: 50, // 버튼 높이 조정
  },
  majorButtonText: {
    // "전공 확인" 버튼 텍스트 스타일
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default AdminHomeScreen;
