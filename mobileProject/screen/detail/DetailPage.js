//전공페이지
import {SafeAreaView,TouchableOpacity, Text, View, Image, Pressable} from 'react-native';
import { useEffect, useState } from 'react';
import {icons, COLORS} from '../../styles';
import Major from './Major';
import Refinement from './Refinement';
import styles from './DetailPage.style';

const DetailPage = () => {
    const types = ['전체', '필수', '선택']// 필수, 선택
    const major_types = ['전공', '교양'] //전공 교양
    const [state, setState] = useState(types[0]);
    const [majorState, setMajorState] = useState(major_types[0]);
    
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
        return (
            <TouchableOpacity 
                onPress={() => setStateFunction(type)}
                style={[{ backgroundColor: currentState === type ? (currentState === state ? COLORS.plum:COLORS.eggplant) : '' }, styles.typeBtn]}
            >
                <Text 
                    style={[{
                        color: currentState === type ? 'white' : 'black', 
                        fontWeight: currentState === type ? 'bold' : 'normal',    
                    }, styles.typeText]}
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
                    {Object.entries(data).map(([key, value]) => (
                        <View key={key}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                padding: 10,
                            }}
                        >
                            <Text>{key+": "}</Text>
                            <Text>{key === 'major_sub' ? `${getMajorSubDescription(value)}` : value}</Text>
                        </View>
                    ))}
                </View>
            </View>
            
            {/*
                프로필 아래 버튼들이며 각 버튼을 누르면 해당하는 전공/교양/필수/선택에 대한 정보를 보여줍니다.
                클릭이 된곳은 배경이 COLORS.eggplant색으로 지정을 해놓으며, 가독성을 위해 흰색으로 Text색을 지정, bold사용 
            */}
            <View style={{flexDirection: 'row', }}>
                <View style={styles.typeContainer}>
                    {renderButton(major_types[0], majorState, setMajorState)}
                    {renderButton(major_types[1], majorState, setMajorState)}
                </View>
                <View style={styles.majortypeContainer}>
                    {renderButton(types[0], state, setState)}
                    {renderButton(types[1], state, setState)}
                    {renderButton(types[2], state, setState)}
                </View>
            </View>


            <Major 
            type = {majorState}
            state = {state}
            />
            
        </SafeAreaView>
    );
}
export default DetailPage;