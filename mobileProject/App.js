import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screen/Auth/Login';
import HomeScreen from './screen/components/Home';
import Profile from './screen/components/Profile';
import DetailCredit from './screen/components/DetailCredit';
import Ocr from './screen/Admin'

// 스택 네비게이터 생성
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: '로그인' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '메인페이지' }} />
        <Stack.Screen name="Profile" component={Profile} options={{ title: '프로필 페이지' }} />
        <Stack.Screen name="DetailCredit" component={DetailCredit} options={{ title: '세부이수학점 페이지' }} />
        <Stack.Screen name="Ocr" component={Ocr} options={{ title: 'Ocr 페이지' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
