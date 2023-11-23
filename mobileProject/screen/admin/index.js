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

  // semesters의 경우 고정값 사용
  const semesters = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2', '41'];

  // desiredTexts의 경우 과마다 값이 달라져야 함. 지금은 고정값
  const desiredTexts = ["공통 전공", "컴퓨터 공학 전공", "빅 데이터 전공", "게임 소프트웨어 전공"];
  

  return (
    <>
      <ImagePickerComponent 
        onImagePicked={setImageUri} 
        setProcessing={setProcessing}
        setOcrComplete={setOcrComplete} 
        semesters={semesters}
        desiredTexts={desiredTexts}
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
        semesters={semesters}
        desiredTexts={desiredTexts}
      />
    </>
  );
};

export default Ocr;
