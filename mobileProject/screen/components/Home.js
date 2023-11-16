  // screens/Home.js
  import React from 'react';
  import { View, Text, Button, StyleSheet } from 'react-native';
  import { LineChart } from 'react-native-chart-kit';
  import { Dimensions } from 'react-native';


  const HomeScreen = ({ route, navigation }) => {
    const studentId = route.params?.studentId;
    const screenWidth = Dimensions.get('window').width;
    const data = {
      labels: ["1학기", "2학기", "3학기", "4학기"],
      datasets: [
        {
          data: [20, 45, 28, 80],
          strokeWidth: 2, // optional
        },
      ],
    };

    const chartConfig = {
      backgroundGradientFrom: "#fff",
      backgroundGradientTo: "#fff",
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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


    return (
      <View style={styles.container}>

      <LineChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
      />

        <Text style={styles.title}>홈 화면에 오신 것을 환영합니다!</Text>
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
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 20,
      marginBottom: 20,
    },
  });

  export default HomeScreen;
