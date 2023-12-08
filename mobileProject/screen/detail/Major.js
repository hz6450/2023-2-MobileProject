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

   //선택 필수 버튼을 눌렀을 때 적용되는 필터링 함수
    const renderFilteredCourseList = (courseList) => {
        //필수버튼 이 눌렀을때 필수만 출력
        if (type === types[1]) {
          return printcreditsByStateType(courseList.filter(item => esTypes.includes(item.types)));
          
        } 
        //선택버튼이 눌렀을때 선택만 출력
        else if (type === types[2]) {
          return printcreditsByStateType(courseList.filter(item => chTypes.includes(item.types)));
        } 
        //전체버튼이 눌렀을때 전체 출력
        else {
          return printcreditsByStateType(courseList);
        }
    };

    // 수업 리스트 나오는 함수 
    const printcreditsByStateType = (courseList) => {
        // 수업 리스트 출력하는 부분 FlatList사용
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
                {/* 리스트 상단 탭 출력하는곳  */}
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
                    height={400}
                    style={{marginBottom: 40}}
                />
            </View>
        );
    };

    return (
        <SafeAreaView>
            {// 전공 교양 선택에 대한 로직
            state === states[0] ?
                renderFilteredCourseList(MajorList):
                renderFilteredCourseList(RefinementList)
            }
        </SafeAreaView>
    );
}
export default Major;