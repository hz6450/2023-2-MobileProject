// 해야할 것 
// 전체 리스트 볼수 있게 해야함
// 각 텍스트 눌러서 세부 정보를 볼 수 있게 해야함
// 
// css작업

import {SafeAreaView, Text, View} from 'react-native';
import { useState, useEffect } from 'react';
import {MajorList, RefinementList} from './List/List';

const Major = ({type, state }) => {
    //type: 전공 교양
    //state: 전체 필수 선택
    //creditsByType: 각 학점
    const types = ['전체', '필수', '선택']// 필수, 선택
    const states = ['전공', '교양'] //전공 교양
    const [majorCreditsByType, setMajorCreditsByType] = useState({});
    const [refinementCreditsByType, setRefinementCreditsByType] = useState({});
    //선택
    const chTypes = ['선택', '균형교양']
    //필수
    const esTypes = [ '필수', '사고와표현', '상담지도', '외국어', '인성교양', '자기개발', '정보화', '학문기초', '핵심교양', '현통']

    const printcreditsByType = (types) => (
        Object.entries(types).map(([key, index]) => (
            <Text key={key}>{`${key}: ${index}`}</Text>
        ))
    )
    const printcreditsByStateType = (types, state) =>{

    }
    const calculateCreditsByType = (courseList) => {
        return courseList.reduce((acc, course) => {
          const { types, credit } = course;
          acc[types] = (acc[types] || 0) + credit;
          return acc;
        }, {});
    };
    
    useEffect(() => {
        setMajorCreditsByType(calculateCreditsByType(MajorList));
        setRefinementCreditsByType(calculateCreditsByType(RefinementList));
    }, []);
    
    return (
        <SafeAreaView>
            <Text>{type} \ {state} </Text>
            {type === states[0] ?
                // 전공에 대한 로직   
                printcreditsByType(majorCreditsByType):printcreditsByType(refinementCreditsByType)
            }
            
        </SafeAreaView>
    );
}
export default Major;