// 해야할 것 
// 전체 리스트 볼수 있게 해야함
// 각 텍스트 눌러서 세부 정보를 볼 수 있게 해야함
// 
// css작업

import {SafeAreaView, Text, View} from 'react-native';
import { useState, useEffect } from 'react';
const Major = ({type, state, majorCreditsByType, refinementCreditsByType}) => {
    //type: 전공 교양
    //state: 필수 선택
    //creditsByType: 각 학점

    const major_types = ['Major', 'Refinement'] //전공 교양
    const printcreditsByType = (types) => (
        Object.entries(types).map(([key, index]) => (
            <Text key={key}>{`${key}: ${index}`}</Text>
        ))
    )

    return (
        <SafeAreaView>
            <Text>{type} \ {state} </Text>
            {type === major_types[0] ?
                // 전공에 대한 로직   
                printcreditsByType(majorCreditsByType):printcreditsByType(refinementCreditsByType)
            }
            {(type === major_types[0]) ?<Text>asd</Text>:<Text>asdasd</Text>}
            
        </SafeAreaView>
    );
}
export default Major;