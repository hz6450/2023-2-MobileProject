import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { db, doc, getDoc } from '../../firebaseConfig.js';

const NeedPage = () => {
  const [ocrData, setOcrData] = useState({});
  const selectedSchool = '선문대';
  const selectedDepartment = '컴퓨터공학';
  const selectedYear = '2019';
  const semesters = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'];
  const name = ['교양', '공통 전공', '컴퓨터 공학 전공', '데이터 공학 전공', '전공 필수'];

  // 각 학기에 대한 데이터 가져오기
  const fetchList = async () => {
    let allData = {};

    for (let semester of semesters) {
      const ocrDocRef = doc(db, selectedSchool, selectedDepartment, selectedYear, semester);
      const docSnap = await getDoc(ocrDocRef);

      if (docSnap.exists()) {
        // name 리스트에 일치하는 경우만 데이터에 추가
        const data = docSnap.data();
        allData[semester] = Object.keys(data)
          .filter(key => name.includes(key))
          .reduce((obj, key) => {
            obj[key] = data[key];
            return obj;
          }, {});
      } else {
        allData[semester] = '데이터가 없습니다';
      }
    }

    setOcrData(allData);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <ScrollView>
      <View>
      {Object.entries(ocrData).map(([semester, data]) => (
        <View key={semester}>
          <Text>{semester}</Text>
          <Text>{JSON.stringify(data)}</Text>
        </View>
      ))}
    </View>
    </ScrollView>
    
  );
};

export default NeedPage;
