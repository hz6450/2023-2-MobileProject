import React from 'react';
import { View, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';

const ImageAnalzerComponent = ({ imageUri }) => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
    shadowColor: '#000', // 그림자 효과
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: Dimensions.get('window').width - 40, // 여백 추가
    height: Dimensions.get('window').width - 40,
    borderWidth: 1, // 테두리
    borderColor: '#ddd', // 테두리 색상
  },
});


export default ImageAnalzerComponent;
