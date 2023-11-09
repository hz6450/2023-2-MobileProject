// screens/DetailCredit.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const DetailCreditScreen = () => {
  // 여기서 학점 데이터를 가져오는 로직을 추가할 수 있습니다.
  // 예를 들어, API 호출을 통해 학점 정보를 조회할 수 있습니다.

  // 임시 하드코딩된 학점 데이터
  const creditInfo = {
    general: 20, // 교양
    majorSelect: 15, // 전공선택
    majorRequired: 30, // 전공필수
    // 필요하다면 추가적인 학점 정보를 여기에 넣을 수 있습니다.
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>세부 이수 학점 정보</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>교양:</Text>
        <Text style={styles.info}>{creditInfo.general} 학점</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>전공선택:</Text>
        <Text style={styles.info}>{creditInfo.majorSelect} 학점</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>전공필수:</Text>
        <Text style={styles.info}>{creditInfo.majorRequired} 학점</Text>
      </View>
      {/* 필요하다면 추가적인 학점 정보를 여기에 표시할 수 있습니다. */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    fontSize: 18,
    color: '#333',
  },
});

export default DetailCreditScreen;
