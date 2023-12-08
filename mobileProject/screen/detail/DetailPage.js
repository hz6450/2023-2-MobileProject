import React, { useState, useEffect } from 'react';
import { SafeAreaView, TouchableOpacity, Text, View, Image } from 'react-native';
import { fetchUserData } from '../components/data'; // data.js에서 fetchUserData 함수를 가져옵니다.
import { icons, COLORS } from '../../styles';
import Major from './Major';
import styles from './DetailPage.style';

const DetailPage = ({ route }) => {
  const studentId = route.params?.studentId;
  
  const [userData, setUserData] = useState(null);

  const types = ['전체', '필수', '선택']// 필수, 선택
  const [isTypes, setIsTypes] = useState(types[0]); //types관련 useState

  const states = ['전공', '교양'] //전공 교양
  const [isStates, setIsStates] = useState(states[0]); // states관련 useState

  useEffect(() => {
    console.log('Route parameters:', route.params); // 현재 route.params 로그 출력
  
    const fetchData = async () => {
      if (studentId) {
        const data = await fetchUserData(studentId);
        if (data) {
          setUserData(data);
        } else {
          console.log('No data received for studentId:', studentId);
        }
      } else {
        console.log('studentId is undefined');
      }
    };
  
    fetchData();
  }, [studentId]);
    
  
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
  
  // 버튼 렌더링 함수
  const renderButton = (type, currentState, setStateFunction) => {    
    const isTypeSelected = currentState === type;
    const isStateSelected = type === isStates;
    const backgroundColor = isTypeSelected ? 
    (isStateSelected ? COLORS.graphiteGray : COLORS.milkCoffee) : // 선택된 버튼 false(state):true(type)
    COLORS.lightSilver; // 선택되지 않은 버튼 
    const textColor = isTypeSelected ? 'white' : 'black';
    const fontWeight = isTypeSelected ? 'bold' : 'normal';
  
    return (
      <TouchableOpacity 
        onPress={() => setStateFunction(type)}
        style={[{ backgroundColor: backgroundColor }, styles.typeBtn]}
      >
        <Text 
          style={[{ color: textColor, fontWeight: fontWeight }, styles.typeText]}
        >
          {type}
        </Text>
      </TouchableOpacity>
    );
  };
  
  // 사용자 정보 렌더링 함수
  const renderUserInfo = (label, props) => {
    return (
      <View style={styles.userInfoRow}>
        <Text style={styles.userInfoLabel}>{label}:</Text>
        <Text style={styles.userInfoData}>{props}</Text>
      </View>
    )
  };
  
  return (
    <SafeAreaView style = {{paddingHorizontal:10, }}>
      <View style={styles.userInfoContainer}>
        <Image source={icons.user} style={{ width: "30%", height: "100%" }}/>
        {/*사용자 정보 출력 하는 부분*/}
        <View style={styles.userInfoTextContainer}>
          {renderUserInfo('이름', userData?.name)}
          {renderUserInfo('전공', userData?.major)}
          {renderUserInfo('전공 분류', renderMajorClassification(userData?.MajorClassification))}
          {renderUserInfo('학년', userData?.grade)}
        </View>
      </View>

      {/*전공 교양 / 전체 필수 선택 선택 버튼 출력*/}
      <View style={{flexDirection: 'row', }}>
        <View style={styles.typeContainer}>
          {renderButton(states[0], isStates, setIsStates)}
          {renderButton(states[1], isStates, setIsStates)}
        </View>
        <View style={styles.typeContainer}>
          {renderButton(types[0], isTypes, setIsTypes)}
          {renderButton(types[1], isTypes, setIsTypes)}
          {renderButton(types[2], isTypes, setIsTypes)}
        </View>
      </View>
      
      <Major 
        type = {isTypes}
        state = {isStates}
      />
    </SafeAreaView>
  );
}

export default DetailPage;