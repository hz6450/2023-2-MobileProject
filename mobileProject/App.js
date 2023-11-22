import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screen/components/Home';
import Profile from './screen/components/Profile';
import DetailCredit from './screen/components/DetailCredit';
import LoginScreen from './screen/Auth/Login';
import Ocr from './screen/admin/index';

// 스택 네비게이터 생성
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 메인 탭 네비게이터
function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '메인페이지' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: '프로필 페이지' }} />
      <Tab.Screen name="DetailCredit" component={DetailCredit} options={{ title: '세부이수학점 페이지' }} />
    </Tab.Navigator>
  );
}

// 전체 앱 네비게이터
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={MainTabNavigator} />
        <Stack.Screen name="Ocr" component={Ocr} options={{ title: 'OCR 페이지' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
