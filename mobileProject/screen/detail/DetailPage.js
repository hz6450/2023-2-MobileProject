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
    const [typeState, setTypeState] = useState(types[0]);
    const majorTypes = ['전공', '교양'] //전공 교양
    const [majorState, setMajorState] = useState(majorTypes[0]);

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
      
    
    const data = {
        major: '컴퓨터공학과',
        major_sub: 4, //복수전공:1 , 부전공:2, 전공심화:3, 모듈화:4
        grade: '3학년',  
        
    }
    
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
    const renderButton = (type, currentState, setStateFunction) => {
        const isSelected = currentState === type;
        const isState = type === typeState;
        const backgroundColor = isSelected ? (isState ? COLORS.plum : COLORS.eggplant) : (isState ? COLORS.lilac : COLORS.lavender);
        const textColor = isSelected ? 'white' : 'black';
        const fontWeight = isSelected ? 'bold' : 'normal';
    
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
    

    return (
        <SafeAreaView>
        <View style={styles.userInfoContainer}>
            <Image source={icons.user} style={{ width: "30%", height: "100%" }}/>
            <View style={styles.userInfoTextContainer}>
                <Text style={[styles.userInfoText, styles.majorInfo]}>전공: {data.major}</Text>
                <Text style={styles.userInfoText}>전공 분류: {renderMajorClassification(data.major_sub)}</Text>
                <Text style={styles.userInfoText}>학년: {data.grade}</Text>
            </View>
        </View>
            
            <View style={{flexDirection: 'row', }}>
                <View style={styles.typeContainer}>
                    {renderButton(majorTypes[0], majorState, setMajorState)}
                    {renderButton(majorTypes[1], majorState, setMajorState)}
                </View>
                <View style={styles.majortypeContainer}>
                    {renderButton(types[0], typeState, setTypeState)}
                    {renderButton(types[1], typeState, setTypeState)}
                    {renderButton(types[2], typeState, setTypeState)}
                </View>
            </View>


            <Major 
            type = {typeState}
            state = {majorState}
            />
            
        </SafeAreaView>
    );
}
export default DetailPage;