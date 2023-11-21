import React, { useState } from 'react';
import ImagePickerComponent from './ImagePickerComponent';
import ImageAnalyzerComponent from './ImageAnalyzerComponent';
import DisplayResultsComponent from './DisplayResultsComponent';

const Ocr = () => {
  const [imageUri, setImageUri] = useState(null);
  const [highlightedAreas, setHighlightedAreas] = useState([]);
  const [imageSize, setImageSize] = useState({ width: 1030, height: 1008 });
  const [processing, setProcessing] = useState(false);
  const [ocrComplete, setOcrComplete] = useState(false);

  return (
    <>
      <ImagePickerComponent 
        onImagePicked={setImageUri} 
        setProcessing={setProcessing} 
        setOcrComplete={setOcrComplete} 
      />
      <ImageAnalyzerComponent
        imageUri={imageUri}
        setImageUri={setImageUri}
        setHighlightedAreas={setHighlightedAreas}
        setImageSize={setImageSize}
      />
      <DisplayResultsComponent
        imageUri={imageUri}
        highlightedAreas={highlightedAreas}
        imageSize={imageSize}
      />
    </>
  );
};

export default Ocr;
