import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, TouchableOpacity} from 'react-native';
import { fetchUserData } from './data'; // data.js에서 fetchUserData 함수를 가져옵니다.

const Profile = ({ route, navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const studentId = route.params?.studentId || '기본값';

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const userData = await fetchUserData(studentId);
      if (userData) {
        setUserInfo(userData);
      } else {
        console.log('No such document!');
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [studentId]);

  const handleLogout = () => {
    // 로그아웃 로직 구현
    // 예: 사용자 세션 종료, 인증 토큰 제거 등  

    // 로그인 화면으로 이동
    navigation.navigate('Login');
  };

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  const renderMajorClassification = (classification) => {
    switch (classification) {
      case 1:
        return '전공심화';
      case 2:
        return '복수전공';
      case 3:
        return '부전공';
      case 4:
        return 'e-special';
      default:
        return '분류 없음'; // 만약 해당하지 않는 값이 들어올 경우
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>프로필</Text>
      <View style={styles.card}>
        {userInfo && (
          <>
            <Text style={styles.info}>이름: {userInfo.name}</Text>
            <Text style={styles.info}>전공: {userInfo.major}</Text>
            <Text style={styles.info}>전공 분류: {renderMajorClassification(userInfo.MajorClassification)}</Text>
            <Text style={styles.info}>학년: {userInfo.grade}</Text>
          </>
        )}
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.homeButton} onPress={navigateToHome}>
        <Text style={styles.homeButtonText}>홈으로</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0', // 배경색 변경
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // 제목 색상 변경
    marginBottom: 30,
  },
  info: {
    fontSize: 18,
    color: '#555', // 정보 텍스트 색상 변경
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff', // 카드 배경색
    width: '90%', // 카드 너비
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000", // 그림자 색상
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: '#d9534f', // 버튼 배경색 변경
    padding: 15,
    borderRadius: 8,
    width: '90%',
  },
  logoutButtonText: {
    color: '#fff', // 버튼 텍스트 색상 변경
    textAlign: 'center',
    fontSize: 16,
  },
  homeButton: {
    backgroundColor: '#4CAF50', // 버튼 배경색
    padding: 15,
    borderRadius: 8,
    width: '90%',
    marginTop: 10, // 로그아웃 버튼과의 간격
  },
  homeButtonText: {
    color: '#fff', // 버튼 텍스트 색상
    textAlign: 'center',
    fontSize: 16,
  },
});



export default Profile;
