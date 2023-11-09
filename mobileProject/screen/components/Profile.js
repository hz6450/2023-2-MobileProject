import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../firebaseConfig';  // 경로는 실제 firebaseConfig가 위치한 곳에 맞춰야 합니다.

// Firebase 앱 초기화 (이미 다른 곳에서 초기화가 되었다면 여기서는 생략 가능)
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const ProfileScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const studentId = '학번을_여기에_입력'; // 실제 학번 값으로 변경해야 합니다.

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

// ... 스타일과 handleLogout 함수 ...

export default ProfileScreen;
