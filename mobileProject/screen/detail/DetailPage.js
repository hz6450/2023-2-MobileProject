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
    
    const getMajorSubDescription = (sub) => {
        const descriptions = {
            1: '전공심화',
            2: '복수전공',
            3: '부전공',
            4: 'e-special',
        };
        return descriptions[sub] || '분류 없음';
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
            {/*
            상단 프로플 페이지를 보여주기 위함
            전공, 복수전공, 학년을 보여줍니다.
            */}
                    <View style={{flexDirection:"row", justifyContent:"center", alignItems:'center' }}>
            <Image source={icons.user} style={{width:"30%", height:"100%"}}/>
            <View style={{flexDirection:"column", width:"70%", alignItems:'center', backgroundColor:"#cccccc"}}>
                {userData && ( // userData가 null이 아닐 때만 내부 내용을 렌더링
                    <>
                        <Text>전공: {userData.major}</Text>
                        <Text>전공 분류: {getMajorSubDescription(userData.major_sub)}</Text>
                        <Text>학년: {userData.grade}</Text>
                    </>
                )}
            </View>
        </View>
            
            {/*
                프로필 아래 버튼들이며 각 버튼을 누르면 해당하는 전공/교양/필수/선택에 대한 정보를 보여줍니다.
                클릭이 된곳은 배경이 COLORS.eggplant색으로 지정을 해놓으며, 가독성을 위해 흰색으로 Text색을 지정, bold사용 
            */}
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