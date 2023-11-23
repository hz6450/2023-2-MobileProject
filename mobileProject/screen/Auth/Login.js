import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db, doc, getDoc } from '../../firebaseConfig';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('로그인 시도 중...');  // 로그인 시도 로그 추가
    try {
      // Firestore에서 학번에 해당하는 문서를 조회합니다.
      const userDocRef = doc(db, 'users', email);
      const userDocSnap = await getDoc(userDocRef);
  
      console.log('문서 조회 완료', userDocSnap.exists());  // 문서 조회 성공 로그 추가
  
      if (userDocSnap.exists()) {
        // 문서에서 패스워드를 가져옵니다.
        const userPassword = userDocSnap.data().PW;
        if (password === userPassword) {
          // 패스워드가 일치하면 로그인 성공 처리를 합니다.
          Alert.alert('로그인 성공', '로그인에 성공했습니다!');
          
          navigation.navigate('MainTab', { screen: 'Home', params: { studentId: email } }, { screen: 'MainTab', params: { studentId: email } });
        } else {
          // 패스워드가 일치하지 않으면 사용자에게 알립니다.
          Alert.alert('로그인 실패', '패스워드가 정확하지 않습니다.');
        }
      } else {
        // 사용자 학번이 Firestore에 없는 경우
        console.log('해당 학번 없음');  // 해당 학번 없음 로그 추가
        Alert.alert('로그인 실패', '해당 학번의 사용자를 찾을 수 없습니다.');
      }
    } catch (error) {
      // 오류 처리
      console.error('로그인 중 오류 발생', error);  // 오류 로그 추가
      Alert.alert('로그인 오류', '로그인 처리 중 오류가 발생했습니다. 오류 메시지: ' + error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="학번"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="패스워드"
        secureTextEntry
      />
      <Button title="로그인" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default Login;
