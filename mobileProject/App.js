import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screen/components/Home';
import Profile from './screen/components/Profile';
import DetailCredit from './screen/components/DetailCredit';
import LoginScreen from './screen/Auth/Login';
import Ocr from './screen/admin/index';
import OcrResultsEditor from './screen/admin/OcrResult/OcrResultsEditor';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DetailPage from './screen/detail/DetailPage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const OcrResultsStack = createNativeStackNavigator();

function TabNavigator({ route }) {

  const studentId = route.params?.studentId.toString();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'DetailCredit') {
            iconName = 'search';
          }
          // ... 다른 탭에 대한 아이콘 설정
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato', // 활성 탭의 색상
        tabBarInactiveTintColor: 'gray',  // 비활성 탭의 색상
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        initialParams={{ studentId: studentId }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        initialParams={{ studentId: studentId }}
      />
      <Tab.Screen name="DetailCredit" component={DetailCredit} options={{ title: '세부이수학점 페이지' }} />
    </Tab.Navigator>
  );
}

function OcrResultsStackScreen() {
  return (
    <OcrResultsStack.Navigator>
      <OcrResultsStack.Screen name="OcrResultsEditor" component={OcrResultsEditor} />
    </OcrResultsStack.Navigator>
  );
}



function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DetailPage">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen 
          name="MainTab" 
          component={TabNavigator} 
          options={{ headerShown: false }}
          initialParams={{ studentId: 1234 }}  // 예시 studentId
        />
        <Stack.Screen name="Ocr" component={Ocr} />
        <Stack.Screen name="DetailPage" component={DetailPage} 
          // options={{ headerShown: false }}
          />
        <Stack.Screen name="OcrResultsStack" component={OcrResultsStackScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;