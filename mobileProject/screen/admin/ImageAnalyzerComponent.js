import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const ImageAnalzerComponent = ({ imageUri }) => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        {imageUri && (
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: 300, height: 300 }}
              onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                setImageSize({ width, height });
              }}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
  },
});

export default ImageAnalzerComponent;
