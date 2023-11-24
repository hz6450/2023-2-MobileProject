import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { db, doc, getDoc, setDoc } from "../../../firebaseConfig";

const OcrResultsEditor = ({ navigation  }) => {
    const semesters = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2', '41'];

    const [selectedSemester, setSelectedSemester] = useState(semesters[0]);
    const [ocrData, setOcrData] = useState({});
    const [editedText, setEditedText] = useState({});
    const [editMode, setEditMode] = useState({});

    useEffect(() => {
        fetchOcrData(selectedSemester);
        // editMode 상태 초기화 로직을 제거
    }, [selectedSemester]);

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

    // 텍스트 라인을 이동시키기 위한 함수
    const moveLine = (group, index, direction) => {
        setEditedText(prev => {
            const groupKeys = Object.keys(prev).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
            const groupIndex = groupKeys.indexOf(group);
            const lines = prev[group].split('\n');

            if (direction === 'up') {
                if (index > 0) {
                    [lines[index], lines[index - 1]] = [lines[index - 1], lines[index]];
                } else if (groupIndex > 0) {
                    const prevGroup = groupKeys[groupIndex - 1];
                    const prevLines = prev[group].split('\n');
                    prevLines.push(lines.shift());
                    return { ...prev, [prevGroup]: prevLines.join('\n'), [group]: lines.join('\n') };
                }
            } else if (direction === 'down') {
                if (index < lines.length - 1) {
                    [lines[index], lines[index + 1]] = [lines[index + 1], lines[index]];
                } else if (groupIndex < groupKeys.length - 1) {
                    const nextGroup = groupKeys[groupIndex + 1];
                    const nextLines = prev[nextGroup].split('\n');
                    nextLines.unshift(lines.pop());
                    return { ...prev, [group]: lines.join('\n'), [nextGroup]: nextLines.join('\n') };
                }
            }

            return { ...prev, [group]: lines.join('\n') };
        });
    };

    // 텍스트 라인을 편집하기 위한 함수
    const editLine = (group, index, newLine) => {
        setEditedText(prev => {
            const lines = prev[group].split('\n');
            lines[index] = newLine;
            return { ...prev, [group]: lines.join('\n') };
        });
    };

    // 각 텍스트 라인의 편집 모드를 전환하는 함수
    const toggleEditMode = (group, index) => {
        const key = `${group}-${index}`;
        setEditMode(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // 저장 버튼을 누르면 돌아가는 함수
    const saveChangesAndNavigateBack = async () => {
        await saveChanges();
        navigation.goBack();
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
                        {editedText[group].split('\n').map((line, index) => (
                            <View key={`${group}-${index}`} style={styles.lineContainer}>
                                <TextInput
                                    style={styles.lineTextInput}
                                    value={line}
                                    onChangeText={(newLine) => editLine(group, index, newLine)}
                                    editable={editMode[`${group}-${index}`]}
                                />
                                <View style={styles.lineButtonRow}>
                                    <TouchableOpacity onPress={() => toggleEditMode(group, index)} style={styles.lineButton}>
                                        <Text style={styles.buttonText}>{editMode[`${group}-${index}`] ? '완료' : '수정'}</Text>
                                    </TouchableOpacity>
                                    {/* 위로 이동 버튼 */}
                                    <TouchableOpacity onPress={() => moveLine(group, index, 'up')} style={styles.lineButton}>
                                        <Text style={styles.buttonText}>↑</Text>
                                    </TouchableOpacity>
                                    {/* 아래로 이동 버튼 */}
                                    <TouchableOpacity onPress={() => moveLine(group, index, 'down')} style={styles.lineButton}>
                                        <Text style={styles.buttonText}>↓</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                        {/* 그룹 삭제 버튼 */}
                        <TouchableOpacity onPress={() => deleteText(group)} style={styles.deleteButton}>
                            <Text style={styles.buttonText}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <TouchableOpacity onPress={saveChangesAndNavigateBack} style={styles.saveButton}>
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
    lineText: {
        flex: 1, // 텍스트가 버튼을 제외한 공간을 모두 차지하도록 합니다.
    },
    lineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        marginVertical: 5,
    },
    lineTextInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'lightgrey',
        padding: 8,
        marginRight: 10,
    },
    lineButtonRow: {
        flexDirection: 'row',
    },
    lineButton: {
        backgroundColor: '#DDDDDD',
        padding: 6,
        marginLeft: 4,
    },
});

export default OcrResultsEditor;
