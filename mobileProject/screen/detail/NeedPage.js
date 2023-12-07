import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { MajorList } from './List.js';
import firebase from './firebaseConfig';

const NeedPage = () => {
  const [neededCourses, setNeededCourses] = useState([]);
    const selectedYear = ['2019', '2023']
    const selectedSemester = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2']
    const department = ['컴퓨터공학']
    // firebase에서 값 가져옴
    const fetchList = async (semester) => {
        const ocrDocRef = doc(db, selectedSchool, selectedDepartment, selectedYear, semester);
        const docSnap = await getDoc(ocrDocRef);

        if (docSnap.exists() && docSnap.data() && Object.keys(docSnap.data()).length > 0) {
            // 문서가 존재하고 데이터가 비어있지 않은 경우
            setOcrData(docSnap.data());
            setEditedText(mapOcrDataToEditableText(docSnap.data()));

        } else {
            // 문서가 존재하지 않거나 데이터가 비어있는 경우
            Alert.alert(
                "데이터 없음",
                "선택한 학기에 대한 데이터가 없습니다.",
                [{ text: "OK", onPress: () => navigation.goBack() }],
                { cancelable: false }
            );
        }
    };
    useEffect(() => {
        const fetchFirebaseData = async () => {
        // Firebase에서 데이터 가져오기
        const firebaseData = await firebase.database().ref('/yourPath').once('value');
        
        // 비교 로직
        const missingCourses = firebaseData.filter(course => 
            !MajorList.some(majorCourse => majorCourse.title === course.title)
        );

        setNeededCourses(missingCourses);
        };

        fetchFirebaseData();
    }, []);

    return (
        <View>
        {neededCourses.map(course => (
            <Text key={course.id}>{course.title}</Text>
        ))}
        </View>
    );
};

export default NeedPage;
