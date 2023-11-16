import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({ route, navigation }) => {
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

  const handleLogout = () => {
    // 로그아웃 로직을 구현하세요.
    // 예를 들어, 사용자의 세션을 종료하거나 토큰을 제거합니다.

    // 로그인 화면으로 돌아가기
    
    // 대시보드 형태로 졸업요건, 이수학점, 필요학점, 봉사시간 등을 표시
    // 세부이수학점 페이지를 만들어 교양 및 전공선택, 전공필수의 세부정보 확인
    navigation.navigate('Login');
  };

  const navigateToProfile = () => {
    navigation.navigate('Ocr',  { studentId: studentId });
  }

  const navigateToDetailCredit = () => {
    navigation.navigate('DetailCredit');
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
        <Text style={getInfoTextStyle(creditsCurrent, creditsTotal)}>
          이수 학점: {creditsCurrent}학점 / {creditsTotal}학점
        </Text>
        <Text style={getInfoTextStyle(serviceHoursCurrent, serviceHoursTotal)}>
          봉사 시간: {serviceHoursCurrent}시간 / {serviceHoursTotal}시간
        </Text>
        {/* 기타 필요한 정보 추가 */}
      </View>
      </View>

      <Button title="프로필 페이지" onPress={navigateToProfile} />
      <Button title="세부이수학점 페이지" onPress={navigateToDetailCredit} />
      <Button title="로그아웃" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
    dashboard: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    chartContainer: {
      width: screenWidth - 40,
      borderWidth: 2,
      borderColor: '#000',
      borderRadius: 10,
      padding: 10,
      marginBottom: 20,
    },
    infoContainer: {
      width: screenWidth - 40,
      borderWidth: 2,
      borderColor: '#000',
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
    },
    infoText: {
      fontSize: 16,
      marginVertical: 5,
      // 추가적인 텍스트 스타일링
    },
    infoTextRed: {
      fontSize: 16,
      marginVertical: 5,
      color: 'red', // 빨간색으로 표시
      // 기타 스타일링...
    },
    title: {
      fontSize: 20,
      marginBottom: 20,
    },
    // 기존의 buttonContainer 및 기타 필요한 스타일 정의
  });
  
  export default HomeScreen;
