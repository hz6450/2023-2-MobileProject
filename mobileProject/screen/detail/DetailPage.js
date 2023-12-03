//전공페이지
import {SafeAreaView,TouchableOpacity, Text, View, Image} from 'react-native';
import { useEffect, useState } from 'react';
import icons from '../../styles/icons';
import Major from './Major';
import Refinement from './Refinement';
import {MajorList, RefinementList} from './List/List';

const DetailPage = () => {
    const types = ['essential', 'choose']// 필수, 선택
    const major_types = ['Major', 'Refinement'] //전공 교양
    
    const [majorCreditsByType, setMajorCreditsByType] = useState({});
    const [refinementCreditsByType, setRefinementCreditsByType] = useState({});
    
    const [state, setState] = useState(types[0]);
    const [majorState, setMajorState] = useState(major_types[0]);
    
    const data = {
        major: '컴퓨터공학과',
        major_sub: 4, //복수전공:1 , 부전공:2, 전공심화:3, 모듈화:4
        grade: '3학년',  
        
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
    
    const creditInfo = {
        refinement_Choose: 20, // 교양
        refinement_Essential: 15, // 교양
        major_Choose: 15, // 전공선택
        major_Essential: 30, // 전공필수
        // 필요하다면 추가적인 학점 정보를 여기에 넣을 수 있습니다.
    };
    
   
    const getMajorSubDescription = (sub) => {
        const descriptions = {
            1: '전공심화',
            2: '복수전공',
            3: '부전공',
            4: 'e-special',
        };
        return descriptions[sub] || '분류 없음';
    };

    return (
        <SafeAreaView>
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
            



            <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderWidth: 1, borderRadius: 1}}>
                <TouchableOpacity onPress={() => setMajorState(major_types[0])}>
                    <Text>전공</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMajorState(major_types[1])}>
                    <Text>교양</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setState(types[0])}>
                    <Text>필수</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setState(types[1])}>
                    <Text>선택</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text>Major Credits by Type:</Text>
                {Object.entries(majorCreditsByType).map(([type, credits]) => (
                    <Text key={type}>{`${type}: ${credits}`}</Text>
                ))}
                <Text>Refinement Credits by Type:</Text>
                {Object.entries(refinementCreditsByType).map(([type, credits]) => (
                    <Text key={type}>{`${type}: ${credits}`}</Text>
                ))}
            </View>

            {majorState === major_types[0] ? <Major state = {state}/>: <Refinement state = {state} />}


        
        
        
        
        </SafeAreaView>
    );
}
export default DetailPage;