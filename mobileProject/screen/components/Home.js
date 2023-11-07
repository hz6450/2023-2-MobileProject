// screens/Home.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import OCRPage from '../Admin';

const HomeScreen = ({ navigation }) => {
  const handleLogout = () => {
    // 로그아웃 로직을 구현하세요.
    // 예를 들어, 사용자의 세션을 종료하거나 토큰을 제거합니다.

    // 로그인 화면으로 돌아가기
    
    // 대시보드 형태로 졸업요건, 이수학점, 필요학점, 봉사시간 등을 표시
    // 세부이수학점 페이지를 만들어 교양 및 전공선택, 전공필수의 세부정보 확인
    navigation.navigate('Login');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>홈 화면에 오신 것을 환영합니다!</Text>
      <Button title="로그아웃" onPress={handleLogout} />
      <Button title="OCR 페이지 이동" onPress={() => navigation.navigate('OCR')} />
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
