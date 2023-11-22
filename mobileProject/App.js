import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screen/components/Home';
import Profile from './screen/components/Profile';
import DetailCredit from './screen/components/DetailCredit';
import LoginScreen from './screen/Auth/Login';
import Ocr from './screen/admin/index';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
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
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '메인페이지' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: '프로필 페이지' }} />
      <Tab.Screen name="DetailCredit" component={DetailCredit} options={{ title: '세부이수학점 페이지' }} />
    </Tab.Navigator>
  );
}




function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTab" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Ocr" component={Ocr} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
