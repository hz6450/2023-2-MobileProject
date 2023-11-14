import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../firebaseConfig';  // 경로는 실제 firebaseConfig가 위치한 곳에 맞춰야 합니다.

// Firebase 앱 초기화 (이미 다른 곳에서 초기화가 되었다면 여기서는 생략 가능)
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const Profile = ({ route, navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const studentId = route.params?.studentId || '기본값';

  const handleLogout = () => {
    // 로그아웃 로직 구현
    // 예: 사용자 세션 종료, 인증 토큰 제거 등

    // 로그인 화면으로 이동
    navigation.navigate('Login');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Firestore에서 학번에 해당하는 문서를 조회합니다.
        const docRef = doc(firestore, 'users', studentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // 문서에서 데이터를 가져와서 상태에 저장합니다.
          setUserInfo(docSnap.data());
        } else {
          // 문서가 없을 때 처리 로직
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [studentId]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>프로필</Text>
      {userInfo && (
        <>
          <Text style={styles.info}>이름: {userInfo.name}</Text>
          <Text style={styles.info}>전공: {userInfo.major}</Text>
          <Text style={styles.info}>전공 분류: {userInfo.MajorClassification}</Text>
          <Text style={styles.info}>학년: {userInfo.grade}</Text>
          {/* 필요하다면 추가적인 사용자 정보를 여기에 표시할 수 있습니다. */}
        </>
      )}
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
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  // 추가적인 스타일을 여기에 정의할 수 있습니다.
});


export default Profile;
