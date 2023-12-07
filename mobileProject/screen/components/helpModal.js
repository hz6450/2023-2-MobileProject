// adminHome에서 도움말 버튼 누를 시 실행되는 곳

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, FlatList, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const HelpModal = ({ modalVisible, setModalVisible }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  // 1~6번 도움말 칸
  const slides = [
    { image: require('../../assets/help/1.png'), text: '학교, 학과, 학년을 확인 후\n교육과정 사진을 업로드해주세요.' },
    { image: require('../../assets/help/2.png'), text: 'OCR이 자동으로 학기와 전공을 인식합니다.' },
    { image: require('../../assets/help/3.png'), text: '인식한 글자를 좌표삼아 바둑판 모양으로 나눕니다.' },
    { image: require('../../assets/help/4.png'), text: '나뉘어진 값들은 group으로 DB에 저장됩니다.' },
    { image: require('../../assets/help/5.png'), text: 'OCR이 완료되면 값들이 화면에 표시되며\n오타나 잘못된 위치를 수정할 수 있습니다.' },
    { image: require('../../assets/help/6.png'), text: '화면을 나가더라도 상세 설정에 가서\n언제든 확인 및 수정할 수 있습니다.' },
  ];

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          {/* FlatList로 도움말 보여줌 */}
          <FlatList
            ref={flatListRef}
            data={slides}
            renderItem={({ item }) => (
              <View style={styles.slideContainer}>
                <Image style={styles.image} source={item.image} />
                <Text style={styles.slideText}>{item.text}</Text>
              </View>
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            keyExtractor={(_, index) => index.toString()}
          />

          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <Text
                key={index}
                style={[styles.dot, activeIndex === index ? styles.activeDot : styles.inactiveDot]}
              >
                •
              </Text>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  image: {
    width: screenWidth - 90,
    height: 300, // 이미지 크기가 제각각이기에 최대 크기를 정해서 다른 페이지를 침범하지 않도록 함
    resizeMode: 'contain'
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center'
  },
  dot: {
    fontSize: 20,
    color: '#888',
    margin: 3
  },
  activeDot: {
    color: '#FFF'
  },
  inactiveDot: {
    color: '#888'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  slideText: {
    fontSize: 16,
    color: '#000', // 글씨 색상을 검정색으로 변경
    marginTop: 10,
    textAlign: 'center',
  },
  pageNumber: {
    position: 'absolute',
    top: 10,
    left: 20,
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 25,
    color: '#333',
    fontWeight: 'bold',
  },
  slideContainer: {
    width: screenWidth - 80.5,
    height: 400, // 이미지와 텍스트를 모두 포함할 수 있도록 함
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HelpModal;
