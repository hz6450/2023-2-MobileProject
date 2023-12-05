  import React from 'react';
  import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
  import { LineChart } from 'react-native-chart-kit';
  import { Dimensions } from 'react-native';

  const screenWidth = Dimensions.get('window').width;

  const AdminHomeScreen = ({ route, navigation }) => {
    const studentId = route.params?.studentId;
    const data = {
      labels: ["1학년", "2학년", "3학년", "4학년"],
      datasets: [
        {
          data: [3.2, 3.7, 3.3, 4.1],
          strokeWidth: 2, // optional
        },
      ],
    };

    const chartConfig = {
      backgroundGradientFrom: "#ffffff",
      backgroundGradientTo: "#ffffff",
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      strokeWidth: 5,
      barPercentage: 0.5,
      useShadowColorFromDataset: false,
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      },
    };



    const navigateToOCR= () => {
      navigation.navigate('Ocr');
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
        <Text style={styles.title}>관리자 페이지입니다</Text>

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
          <Text style={getInfoTextStyle(creditsCurrent, creditsTotal)}>
            이수 학점: {creditsCurrent}학점 / {creditsTotal}학점
          </Text>
          <Text style={getInfoTextStyle(serviceHoursCurrent, serviceHoursTotal)}>
            봉사 시간: {serviceHoursCurrent}시간 / {serviceHoursTotal}시간
          </Text>
          {/* 기타 필요한 정보 추가 */}
        </View>
        </View>

      <TouchableOpacity style={styles.button} onPress={navigateToOCR}>
        <Text style={styles.buttonText}>OCR</Text>
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

    
    export default AdminHomeScreen;
