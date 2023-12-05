// 해야할 것 
// 전체 리스트 볼수 있게 해야함
// 각 텍스트 눌러서 세부 정보를 볼 수 있게 해야함
// 
// css작업

import {SafeAreaView, FlatList, Text, View, } from 'react-native';
import {MajorList, RefinementList} from './List/List';
import styles from './Major.style';
const Major = ({type, state}) => {
    //state: 전공 교양
    //type: 전체 필수 선택
    //creditsByType: 각 학점
    const types = ['전체', '필수', '선택']// 전체 필수 선택
    const states = ['전공', '교양'] //전공 교양
    //선택
    const chTypes = ['선택', '균형교양']
    //필수
    const esTypes = [ '필수', '사고와표현', '상담지도', '외국어', '인성교양', '자기개발', '정보화', '학문기초', '핵심교양', '현통']

   
    const renderFilteredCourseList = (courseList) => {
        if (type === types[1]) {
          return printcreditsByStateType(courseList.filter(item => esTypes.includes(item.types)));
          
        } else if (type === types[2]) {
          return printcreditsByStateType(courseList.filter(item => chTypes.includes(item.types)));
        } else {
          return printcreditsByStateType(courseList);
        }
      };
    const printcreditsByStateType = (courseList) => {
        const renderItem = ({ item }) => (
            <View style={styles.printbody}>
                <Text style={styles.typebody}>{item.types}</Text>
                <Text style={styles.titlebody}>{item.title}</Text>
                <Text style={styles.creditbody}>{item.credit}</Text>
                <Text style={styles.scorebody}>{item.score}</Text>
            </View>
        );
        
        return (
            <View> 
                {/* 평균 구하는 부분 추가 할 것 */}
                

                <View style={styles.printhead}>
                    <Text style={styles.typehead}>분류</Text>
                    <Text style={styles.titlehead}>과목 명</Text>
                    <Text style={styles.credithead}>학점</Text>
                    <Text style={styles.scorehead}>성적</Text>
                </View>
                <FlatList
                    data={courseList}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()} 
                    scrollEnabled={true}
                    height={500}
                    style={{marginBottom: 25}}
                />
            </View>
        );
    };

    return (
        <SafeAreaView>
            {/* <Text>{type} \ {state} </Text>
            {type === states[0] ?
                   
                printcreditsByType(majorCreditsByType):
                printcreditsByType(refinementCreditsByType)
            } */}
            {state === states[0] ?
                // 전공에 대한 로직   
                renderFilteredCourseList(MajorList):
                renderFilteredCourseList(RefinementList)
            }
        </SafeAreaView>
    );
}
export default Major;