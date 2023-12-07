// 선택한 이미지를 화면에 표시하는 컴포넌트

import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';

const ImageAnalzerComponent = ({ imageUri }) => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View>
        {imageUri && (
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: 400, height: 400 }}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// 장식
const styles = StyleSheet.create({
});

export default ImageAnalzerComponent;
