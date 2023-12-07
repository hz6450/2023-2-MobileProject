// OCR 결과를 보여주는 화면
// DisplayResultsComponents의 결과로 1회 출력되거나, adminHome에서 버튼을 통해 접근할 수 있음

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db, doc, getDoc, setDoc } from "../../../firebaseConfig";

const OcrResultsEditor = ({ navigation }) => {
    const route = useRoute();
    const { selectedSchool, selectedDepartment, selectedYear, semesters, desiredTexts, specialSubjects } = route.params;

    const [selectedSemester, setSelectedSemester] = useState(semesters[0]);
    const [ocrData, setOcrData] = useState({});
    const [editedText, setEditedText] = useState({});
    const [validSemesters, setValidSemesters] = useState([]);

    // 버튼 및 텍스트 블록 생성
    useEffect(() => {
        fetchOcrData(selectedSemester);
        filterValidSemesters();
    }, [selectedSemester, semesters]);

    // semesters 값 중 firebase 그룹 값이 비어있는 곳의 경우 버튼을 생성하지 않음
    const filterValidSemesters = async () => {
        const validSems = [];
        for (const semester of semesters) {
            const ocrDocRef = doc(db, selectedSchool, selectedDepartment, selectedYear, semester);
            const docSnap = await getDoc(ocrDocRef);
            if (docSnap.exists() && hasNonEmptyGroups(docSnap.data())) {
                validSems.push(semester);
            }
        }
        setValidSemesters(validSems);
    };

    // 이 네 곳 값이 모두 비어있을 경우를 계산함
    const hasNonEmptyGroups = (data) => {
        const groups = data.groups || {};
        return ['group1', 'group2', 'group3', 'group4'].some(group => groups[group] && groups[group].length > 0);
    };

    // 문자 삭제
    const deleteText = (group) => {
        // 삭제 전에 사용자에게 확인을 요청
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

    // firebase에서 값 가져옴
    const fetchOcrData = async (semester) => {
        const ocrDocRef = doc(db, selectedSchool, selectedDepartment, selectedYear, semester);
        const docSnap = await getDoc(ocrDocRef);

        if (docSnap.exists() && docSnap.data() && Object.keys(docSnap.data()).length > 0) {
            // 문서가 존재하고 데이터가 비어있지 않은 경우
            setOcrData(docSnap.data());
            setEditedText(mapOcrDataToEditableText(docSnap.data()));

        } else {
            // 문서가 존재하지 않거나 데이터가 비어있는 경우
            Alert.alert(
                "데이터 없음",
                "선택한 학기에 대한 데이터가 없습니다.",
                [{ text: "OK", onPress: () => navigation.goBack() }],
                { cancelable: false }
            );
        }
    };

    // 그룹에서 값 나누기
    const mapOcrDataToEditableText = (data) => {
        let editTextMap = {};
        Object.keys(data.groups).forEach(group => {
            editTextMap[group] = data.groups[group].join('\n');
        });
        return editTextMap;
    };

    // 전체 완료했을 때 저장하는 함수. semesters 전체를 저장해야 하므로 firebase에 새로 접근합니다.
    const saveChanges = async () => {
        // semester 전체에 한 번씩 접근합니다.
        await Promise.all(semesters.map(async (semester) => {
            const ocrDocRef = doc(db, selectedSchool, selectedDepartment, selectedYear, semester);
            const docSnap = await getDoc(ocrDocRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                let updateData = { '전공 필수': [] };

                Object.keys(data.groups).forEach(groupKey => {
                    const groupData = data.groups[groupKey].filter(line => line.trim() !== '');

                    // 'group1'은 '교양'으로, 그 외 그룹은 desiredTexts에 따라 이름 변경
                    if (groupKey === 'group1') {
                        updateData['교양'] = groupData;
                    } else {
                        const desiredTextIndex = parseInt(groupKey.replace('group', '')) - 2;
                        const groupName = desiredTexts[desiredTextIndex] || groupKey; // desiredTexts 배열의 범위를 벗어난 경우 원래의 groupKey를 사용, group1, group2... 등
                        groupData.forEach(line => {
                            const isSpecialSubject = specialSubjects.some(subject => line.includes(subject));
                            if (isSpecialSubject) {
                                updateData['전공 필수'].push(line);
                            } else {
                                if (!updateData[groupName]) {
                                    updateData[groupName] = [];
                                }
                                updateData[groupName].push(line);
                            }
                        });
                    }
                });

                await setDoc(ocrDocRef, updateData, { merge: true });
            }
        }));
    };




    // semesters 버튼끼리 값을 이동할 때, 이전 변경사항을 저장하는 함수
    const saveChangebutton = async () => {
        // Firebase 문서에서 기존의 모든 groups를 삭제
        const ocrDocRef = doc(db, selectedSchool, selectedDepartment, selectedYear, selectedSemester);
        await setDoc(ocrDocRef, { groups: {} }, { merge: true });

        // 새로운 데이터로 groups 맵을 채움
        const newGroups = Object.keys(editedText)
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
            .reduce((acc, group, index) => {
                if (editedText[group].trim() !== '') {
                    acc[`group${index + 1}`] = editedText[group].split('\n').filter(line => line.trim() !== '');
                }
                return acc;
            }, {});

        // 새로운 groups로 덮어씀
        await setDoc(ocrDocRef, { groups: newGroups }, { merge: true });
    };

    // 텍스트 라인을 이동시키기 위한 함수
    const moveLine = (group, index, direction) => {
        setEditedText(prev => {
            const groupKeys = Object.keys(prev).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
            const groupIndex = groupKeys.indexOf(group);
            const lines = prev[group].split('\n');

            // 위로 이동
            if (direction === 'up') {
                if (index > 0) {
                    // 같은 그룹 내에서 라인 이동
                    [lines[index], lines[index - 1]] = [lines[index - 1], lines[index]];
                } else if (groupIndex > 0) {
                    // 이전 그룹으로 라인 이동
                    const prevGroup = groupKeys[groupIndex - 1];
                    const prevLines = prev[prevGroup].split('\n');
                    prevLines.push(lines.shift());
                    return { ...prev, [prevGroup]: prevLines.join('\n'), [group]: lines.join('\n') };
                }
            }
            // 아래로 이동
            else if (direction === 'down') {
                if (index < lines.length - 1) {
                    // 같은 그룹 내에서 라인 이동
                    [lines[index], lines[index + 1]] = [lines[index + 1], lines[index]];
                } else if (groupIndex < groupKeys.length - 1) {
                    // 다음 그룹으로 라인 이동
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

    // 텍스트 라인을 간략화하기 위한 함수
    const simplifyText = (group, index) => {
        setEditedText(prev => {
            const lines = prev[group].split('\n');
            lines[index] = removeTextAfterParentheses(lines[index]);
            return { ...prev, [group]: lines.join('\n') };
        });
    };

    // 괄호 이후의 텍스트를 제거하는 함수
    const removeTextAfterParentheses = (text) => {
        const indexOfParentheses = text.indexOf('(');
        if (indexOfParentheses !== -1) {
            return text.substring(0, indexOfParentheses);
        }
        return text;
    };

    const changeSemesterAndSaveChanges = async (semester) => {
        await saveChangebutton();  // 현재 학기의 변경 사항 저장
        setSelectedSemester(semester);  // 새 학기 선택
    };

    // 저장 버튼을 누르면 돌아가는 함수
    const saveChangesAndNavigateBack = async () => {
        await saveChanges();
        alert('변경 사항이 저장되었습니다.');
        navigation.goBack();
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.semesterSelector}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {validSemesters.map(semester => (
                        <TouchableOpacity
                            key={semester}
                            onPress={() => changeSemesterAndSaveChanges(semester)}
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
                                />
                                <View style={styles.lineButtonRow}>
                                    {/* "간략" 버튼 */}
                                    <TouchableOpacity onPress={() => simplifyText(group, index)} style={styles.lineButton}>
                                        <Text style={styles.buttonText}>간략</Text>
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
        paddingHorizontal: 20,
        paddingTop: 20,
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
        marginBottom: 40,
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
