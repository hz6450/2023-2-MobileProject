import React, { useState } from 'react';
import ImagePickerComponent from './ImagePickerComponent';
import ImageAnalyzerComponent from './ImageAnalyzerComponent';
import DisplayResultsComponent from './DisplayResultsComponent';

const Ocr = () => {
  const [imageUri, setImageUri] = useState(null);

  return (
    <>
      <ImagePickerComponent onImagePicked={setImageUri} />
      <ImageAnalyzerComponent
        imageUri={imageUri}
        setImageUri={setImageUri}
      />
      <DisplayResultsComponent
        imageUri={imageUri}
      />
    </>
  );
};

export default Ocr;
