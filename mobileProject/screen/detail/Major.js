//전공페이지
import { FlatList, SafeAreaView, Text, View} from 'react-native';

const Major = () => {
    const data = {
        major: '컴퓨터공학과',
        major_sub: 4, //복수전공:1 , 부전공:2, 전공심화:3, 모듈화:4
        grade: '3학년',
        
    }
    return (
        <SafeAreaView>
            <View>
                <Text>asd</Text>
            </View>
            {/* <FlatList 
                data={data}
                renderItem={({item}) => <Text>{item}</Text>}
                keyExtractor={item => item.id}
            /> */}
            <View>
                {/*학과데이터, 학생수업들은 데이터*/}
            </View>
        </SafeAreaView>
    );
}
export default Major;