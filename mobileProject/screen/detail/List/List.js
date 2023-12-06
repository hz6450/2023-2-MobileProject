// 임시로 하드코딩한 데이터
const MajorList = [
    {"types":"필수","title":"오픈소스SW프로젝트(PBL)","credit":3,"grade":3,"semester":1,"score":"A+"},
    {"types":"선택","title":"모바일프로그래밍","credit":3,"grade":3,"semester":1,"score":"A+"},
    {"types":"선택","title":"운영체제","credit":3,"grade":3,"semester":1,"score":"A+"},
    {"types":"선택","title":"사이버보안개론","credit":3,"grade":3,"semester":1,"score":"A+"},
    {"types":"선택","title":"컴퓨터네트워크","credit":3,"grade":3,"semester":1,"score":"A+"},
    {"types":"선택","title":"기초프로젝트Ⅱ(PBL AdventureDesign)","credit":3,"grade":2,"semester":2,"score":"A+"},
    {"types":"선택","title":"데이타베이스","credit":3,"grade":2,"semester":2,"score":"B+"},
    {"types":"선택","title":"고급객체지향프로그래밍","credit":3,"grade":2,"semester":2,"score":"A+"},
    {"types":"선택","title":"임베디드프로그래밍","credit":3,"grade":2,"semester":2,"score":"A+"},
    {"types":"필수","title":"컴퓨터구조","credit":3,"grade":2,"semester":2,"score":"A+"},
    {"types":"필수","title":"알고리즘","credit":3,"grade":2,"semester":2,"score":"A+"},
    {"types":"선택","title":"기초프로젝트Ⅰ(PBL)","credit":3,"grade":2,"semester":1,"score":"A+"},
    {"types":"선택","title":"디지털공학(TIPS)","credit":3,"grade":2,"semester":1,"score":"A+"},
    {"types":"선택","title":"객체지향프로그래밍(PBL)","credit":3,"grade":2,"semester":1,"score":"A+"},
    {"types":"선택","title":"사물인터넷","credit":3,"grade":2,"semester":1,"score":"A+"},
    {"types":"필수","title":"데이터구조","credit":3,"grade":2,"semester":1,"score":"A+"},
    {"types":"선택","title":"프로그래밍&응용(PBL)","credit":3,"grade":1,"semester":2,"score":"A+"},
    {"types":"선택","title":"기초설계(TIPS)","credit":3,"grade":1,"semester":1,"score":"A+"}
    ]
    
    const RefinementList = [
    {"types":"인성교양","title":"공동체와세계시민","credit":1,"grade":3,"semester":1,"score":"A+"},
    {"types":"핵심교양","title":"인성채플","credit":1,"grade":3,"semester":1,"score":"P"},
    {"types":"상담지도","title":"상담지도(교수-학생상담)","credit":1,"grade":3,"semester":1,"score":"P"},
    {"types":"상담지도","title":"상담지도(교수-학생상담)","credit":1,"grade":2,"semester":2,"score":"P"},
    {"types":"핵심교양","title":"인성채플","credit":1,"grade":2,"semester":2,"score":"P"},
    {"types":"자기개발","title":"진로탐색및목표설정","credit":1,"grade":2,"semester":2,"score":"P"},
    {"types":"상담지도","title":"상담지도(교수-학생상담)","credit":1,"grade":2,"semester":1,"score":"P"},
    {"types":"핵심교양","title":"인성채플","credit":1,"grade":2,"semester":1,"score":"P"},
    {"types":"정보화","title":"파이썬프로그래밍","credit":3,"grade":3,"semester":2,"score":"A+"},
    {"types":"외국어","title":"English Reading and Writing II","credit":2,"grade":1,"semester":2,"score":"A+"},
    {"types":"현통","title":"현대문화와통일사상 II","credit":2,"grade":1,"semester":2,"score":"A+"},
    {"types":"사고와표현","title":"테크니컬라이팅","credit":2,"grade":1,"semester":2,"score":"A+"},
    {"types":"상담지도","title":"사제동행세미나(4차산업혁명탐색)","credit":1,"grade":1,"semester":2,"score":"P"},
    {"types":"자기개발","title":"대학생활과진로설계","credit":1,"grade":1,"semester":1,"score":"P"},
    {"types":"상담지도","title":"사제동행세미나(4차산업혁명탐색)","credit":1,"grade":1,"semester":1,"score":"P"},
    {"types":"현통","title":"현대문화와통일사상 I","credit":2,"grade":1,"semester":1,"score":"A+"},
    {"types":"정보화","title":"CT와SW의이해","credit":3,"grade":1,"semester":1,"score":"A+"},
    {"types":"외국어","title":"English Listening and Speaking II","credit":2,"grade":1,"semester":1,"score":"A+"},
    {"types":"사고와표현","title":"읽기와토론","credit":2,"grade":1,"semester":1,"score":"A+"},
    {"types":"학문기초","title":"이산수학","credit":3,"grade":1,"semester":2,"score":"A+"},
    {"types":"학문기초","title":"확률및통계","credit":3,"grade":1,"semester":1,"score":"A+"},
    {"types":"균형교양","title":"세상을바꾸는아름다운수학","credit":3,"grade":2,"semester":2,"score":"A+"},
    {"types":"균형교양","title":"기업가정신I(창업)","credit":2,"grade":1,"semester":1,"score":"A+"},
    {"types":"균형교양","title":"인간과심리","credit":3,"grade":3,"semester":1,"score":"A+"},
    {"types":"선택","title":"창의적SW디자인","credit":3,"grade":1,"semester":2,"score":"A+"},
    {"types":"선택","title":"군 리더십","credit":2,"grade":2,"semester":2,"score":"P"},
    
    
    ]

    const scoreToGradePoint = (score) => {
        switch (score) {
            case 'A+': return 4.5;
            case 'A': return 4.0;
            case 'B+': return 3.5;
            case 'B': return 3.0;
            case 'C+': return 2.5;
            case 'C': return 2.0;
            case 'D+': return 1.5;
            case 'D': return 1.0;
            case 'F': return 0.0;
            case 'P': return 0.0; // P/F 과목은 평균 계산에서 제외
            default: return 0.0;
        }
    };
    
    // 평균 학점을 계산하는 함수
    const calculateAverageGrade = (list) => {
        let totalGradePoints = 0;
        let totalCredits = 0;
    
        list.forEach(item => {
            const gradePoint = scoreToGradePoint(item.score);
            if (gradePoint > 0) { // P/F 과목은 제외
                totalGradePoints += gradePoint * item.credit;
                totalCredits += item.credit;
            }
        });
    
        return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 'N/A';
    };

    const calculateTotalCredits = (list) => {
        return list.reduce((total, course) => total + course.credit, 0);
    };

    // 이수한 학점의 총합 계산
    const totalMajorCredits = calculateTotalCredits(MajorList);
    const totalRefinementCredits = calculateTotalCredits(RefinementList);
    const totalCredits = totalMajorCredits + totalRefinementCredits;
    
    // 평균 학점 계산
    const averageMajorGrade = calculateAverageGrade(MajorList);
    const averageRefinementGrade = calculateAverageGrade(RefinementList);
    
    export { MajorList, RefinementList, averageMajorGrade, averageRefinementGrade, totalCredits };
    
    