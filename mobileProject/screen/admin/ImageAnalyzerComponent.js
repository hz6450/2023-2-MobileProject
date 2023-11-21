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
              style={{ width: 400, height: 400 }}
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
