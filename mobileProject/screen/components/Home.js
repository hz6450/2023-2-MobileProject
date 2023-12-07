import React, { useState, useEffect } from 'react';
import { fetchUserData } from './data';
  import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
  import { LineChart } from 'react-native-chart-kit';
  import { Dimensions } from 'react-native';
  import { totalCredits, averageMajorGrade, averageRefinementGrade, averageGradesByYear  } from '../detail/List/List';

  const screenWidth = Dimensions.get('window').width;

  const HomeScreen = ({ route, navigation }) => {
    const [userData, setUserData] = useState(null);
    const email = route.params?.studentId;

    useEffect(() => {
      const loadData = async () => {
        const data = await fetchUserData(email);
        if (data) {
          setUserData(data);
        }
      };
  
      loadData();
    }, [email]);

    useEffect(() => {
      // 가져온 평균 학점과 총 학점을 콘솔에 출력
      console.log("전공 평균 학점:", averageMajorGrade);
      console.log("교양 평균 학점:", averageRefinementGrade);
      console.log("이수 학점:", totalCredits);
      console.log("학년별 평균 학점:", averageGradesByYear);
    }, []);

    const studentId = route.params?.studentId;
    const data = {
        labels: ["1학년", "2학년", "3학년", "4학년"],
        datasets: [
            {
                data: [
                    parseFloat(averageGradesByYear[1]),
                    parseFloat(averageGradesByYear[2]),
                    parseFloat(averageGradesByYear[3]),
                    parseFloat(averageGradesByYear[4])
                ],
                strokeWidth: 2, // optional
            },
        ],
    };

    const chartConfig = {
      backgroundGradientFrom: "#f0f0f0", // 배경 그라데이션 시작 색상
      backgroundGradientTo: "#ffffff", // 배경 그라데이션 종료 색상
      color: (opacity = 1) => `rgba(34, 202, 236, ${opacity})`, // 선 및 텍스트 색상
      labelColor: (opacity = 1) => `rgba(23, 153, 169, ${opacity})`, // 라벨(학년) 텍스트 색상
      strokeWidth: 3, // 선의 두께
      barPercentage: 0.5,
      useShadowColorFromDataset: false, // 데이터셋에서 그림자 색상 사용 여부
      propsForDots: {
          r: "6", // 점의 반지름
          strokeWidth: "2", // 점의 외곽선 두께
          stroke: "#ffa726" // 점의 외곽선 색상
      },
      decimalPlaces: 2, // 소수점 자릿수
      fillShadowGradient: '#4caf50', // 선 아래 그림자 그라데이션 색상
      fillShadowGradientOpacity: 0.3, // 선 아래 그림자 그라데이션 투명도
  };
  


    const navigateToProfile = () => {
      navigation.navigate('Profile' ,  { studentId: studentId });
    }

    const navigateToDetailCredit = () => {
      navigation.navigate('DetailPage' ,  { studentId: studentId });
    }

    const creditsCurrent = 120;
    const creditsTotal = 130;
    const serviceHoursCurrent = 44;
    const serviceHoursTotal = 40;

    const getInfoTextStyle = (current, total) => {
      return current < total ? styles.infoTextRed : styles.infoText;
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>홈 화면에 오신 것을 환영합니다!</Text>

        <View style={styles.dashboard}>
          <View style={styles.chartContainer}>
            <LineChart
              data={data}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
            />
          </View>
          <View style={styles.infoContainer}>
          {/* 조건부 스타일 적용 */}
          <View style={styles.infoContainer}>
                <Text style={styles.infoText}>이수 학점: {totalCredits}학점</Text>
                <Text style={styles.infoText}>전공 평균 학점: {averageMajorGrade}</Text>
                <Text style={styles.infoText}>교양 평균 학점: {averageRefinementGrade}</Text>
            </View>
          {/* 기타 필요한 정보 추가 */}
        </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={navigateToProfile}>
        <Text style={styles.buttonText}>프로필 페이지</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToDetailCredit}>
        <Text style={styles.buttonText}>세부이수학점 페이지</Text>
      </TouchableOpacity>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
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
      padding: 15,
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

    
    export default HomeScreen;