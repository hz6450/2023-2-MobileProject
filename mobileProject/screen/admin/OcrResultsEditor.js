import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { db, doc, getDoc, setDoc } from "../../firebaseConfig";

const OcrResultsEditor = ({ semesters }) => {
    const [selectedSemester, setSelectedSemester] = useState(semesters[0]);
    const [ocrData, setOcrData] = useState({});
    const [editedText, setEditedText] = useState({});
    const [editMode, setEditMode] = useState({});

    useEffect(() => {
        fetchOcrData(selectedSemester);
        // editMode 상태 초기화 로직을 제거
    }, [selectedSemester]);

    const toggleEditMode = (group) => {
        setEditMode(prev => ({ ...prev, [group]: !prev[group] }));
    };

    const moveText = (group, direction) => {
        const groupNumbers = Object.keys(editedText).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        const index = groupNumbers.indexOf(group);
        if (direction === 'up' && index > 0) {
            swapText(groupNumbers[index], groupNumbers[index - 1]);
        } else if (direction === 'down' && index < groupNumbers.length - 1) {
            swapText(groupNumbers[index], groupNumbers[index + 1]);
        }
    };

    const swapText = (group1, group2) => {
        setEditedText(prev => ({
            ...prev,
            [group1]: prev[group2],
            [group2]: prev[group1]
        }));
    };

    const deleteText = (group) => {
        // 삭제 전에 사용자에게 확인을 요청합니다.
        Alert.alert(
          "삭제 확인",
          "정말로 이 텍스트를 삭제하시겠습니까?",
          [
            {
              text: "아니오",
              style: "cancel"
            },
            {
              text: "예",
              onPress: () => {
                setEditedText(prev => {
                  const newGroups = { ...prev };
                  const groupNumbers = Object.keys(newGroups).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
                  const index = groupNumbers.indexOf(group);
      
                  // 삭제할 그룹 이후의 그룹을 앞으로 당깁니다.
                  for (let i = index; i < groupNumbers.length - 1; i++) {
                    newGroups[groupNumbers[i]] = newGroups[groupNumbers[i + 1]];
                  }
      
                  // 마지막 그룹을 삭제합니다.
                  delete newGroups[groupNumbers[groupNumbers.length - 1]];
                  return newGroups;
                });
              }
            }
          ],
          { cancelable: false }
        );
      };

    const fetchOcrData = async (semester) => {
        const ocrDocRef = doc(db, 'ocr', semester);
        const docSnap = await getDoc(ocrDocRef);

        if (docSnap.exists()) {
            setOcrData(docSnap.data());
            setEditedText(mapOcrDataToEditableText(docSnap.data()));
        }
    };

    const mapOcrDataToEditableText = (data) => {
        let editTextMap = {};
        Object.keys(data.groups).forEach(group => {
            editTextMap[group] = data.groups[group].join('\n');
        });
        return editTextMap;
    };

    const handleTextChange = (group, text) => {
        setEditedText(prev => ({ ...prev, [group]: text }));
    };

    const saveChanges = async () => {
        // Firebase 문서에서 기존의 모든 groups를 삭제합니다.
        const ocrDocRef = doc(db, 'ocr', selectedSemester);
        await setDoc(ocrDocRef, { groups: {} }, { merge: true });
        //await deleteField
      
        // 새로운 데이터로 groups 맵을 채웁니다.
        const newGroups = Object.keys(editedText)
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
          .reduce((acc, group, index) => {
            if (editedText[group].trim() !== '') {
              acc[`group${index + 1}`] = editedText[group].split('\n').filter(line => line.trim() !== '');
            }
            return acc;
          }, {});
      
        // 새로운 groups로 덮어씁니다.
        await setDoc(ocrDocRef, { groups: newGroups }, { merge: true });
      
        alert('변경 사항이 저장되었습니다.');
      };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.semesterSelector}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {semesters.map(semester => (
                        <TouchableOpacity
                            key={semester}
                            onPress={() => setSelectedSemester(semester)}
                            style={[styles.semesterButton, selectedSemester === semester && styles.activeButton]}
                        >
                            <Text style={styles.semesterText}>{semester}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <View style={styles.editor}>
                {Object.keys(editedText).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).map(group => (
                    <View key={group} style={styles.groupContainer}>
                        <TextInput
                            multiline
                            editable={editMode[group]}
                            onChangeText={text => handleTextChange(group, text)}
                            value={editedText[group]}
                            style={[styles.textInput, !editMode[group] && styles.textInputNotEditable]}
                        />
                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={() => toggleEditMode(group)} style={styles.button}>
                                <Text style={styles.buttonText}>{editMode[group] ? '완료' : '수정'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => moveText(group, 'up')} style={styles.button}>
                                <Text style={styles.buttonText}>위</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => moveText(group, 'down')} style={styles.button}>
                                <Text style={styles.buttonText}>아래</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteText(group)} style={styles.button}>
                                <Text style={styles.buttonText}>삭제</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
            <TouchableOpacity onPress={saveChanges} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>변경 사항 저장</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    semesterSelector: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    semesterButton: {
        marginRight: 10,
        padding: 10,
        backgroundColor: '#DDDDDD',
    },
    activeButton: {
        backgroundColor: '#AAAAAA',
    },
    semesterText: {
        fontSize: 16,
    },
    editor: {
        marginBottom: 20,
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        minHeight: 100,
    },
    saveButton: {
        backgroundColor: '#00CC00',
        padding: 15,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#DDDDDD',
        padding: 10,
        margin: 2,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    groupContainer: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        marginBottom: 10,
    },
    textInputNotEditable: {
        backgroundColor: '#f0f0f0', // 텍스트 입력란이 수정 불가능할 때의 배경색
    },
});

export default OcrResultsEditor;
