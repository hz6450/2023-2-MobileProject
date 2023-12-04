// 임시로 하드코딩한 데이터
const types = ['choose', 'essential', '균형교양', '사고와표현', '상담지도', '외국어', '인성교양', '자기개발', '정보화', '학문기초', '핵심교양', '현통']

const MajorList = [
{"types":"essential","title":"오픈소스SW프로젝트(PBL)","credit":3,"grade":3,"semester":1,"score":"B+"},
{"types":"학문기초","title":"이산수학","credit":3,"grade":1,"semester":2,"score":"A"},
{"types":"choose","title":"모바일프로그래밍","credit":3,"grade":3,"semester":1,"score":"B+"},
{"types":"choose","title":"운영체제","credit":3,"grade":3,"semester":1,"score":"B+"},
{"types":"choose","title":"사이버보안개론","credit":3,"grade":3,"semester":1,"score":"B+"},
{"types":"choose","title":"컴퓨터네트워크","credit":3,"grade":3,"semester":1,"score":"A+"},
{"types":"choose","title":"기초프로젝트Ⅱ(PBL AdventureDesign)","credit":3,"grade":2,"semester":2,"score":"A+"},
{"types":"choose","title":"데이타베이스","credit":3,"grade":2,"semester":2,"score":"A"},
{"types":"choose","title":"고급객체지향프로그래밍","credit":3,"grade":2,"semester":2,"score":"A"},
{"types":"choose","title":"임베디드프로그래밍","credit":3,"grade":2,"semester":2,"score":"C+"},
{"types":"essential","title":"컴퓨터구조","credit":3,"grade":2,"semester":2,"score":"A"},
{"types":"essential","title":"알고리즘","credit":3,"grade":2,"semester":2,"score":"B+"},
{"types":"choose","title":"기초프로젝트Ⅰ(PBL)","credit":3,"grade":2,"semester":1,"score":"A+"},
{"types":"choose","title":"디지털공학(TIPS)","credit":3,"grade":2,"semester":1,"score":"A"},
{"types":"choose","title":"객체지향프로그래밍(PBL)","credit":3,"grade":2,"semester":1,"score":"B+"},
{"types":"choose","title":"사물인터넷","credit":3,"grade":2,"semester":1,"score":"A"},
{"types":"essential","title":"데이터구조","credit":3,"grade":2,"semester":1,"score":"A+"},
{"types":"choose","title":"프로그래밍&응용(PBL)","credit":3,"grade":1,"semester":2,"score":"A+"},
{"types":"학문기초","title":"확률및통계","credit":3,"grade":1,"semester":1,"score":"A+"},
{"types":"choose","title":"기초설계(TIPS)","credit":3,"grade":1,"semester":1,"score":"A+"}
]

const RefinementList = [{"types":"균형교양","title":"인간과심리","credit":3,"grade":3,"semester":1,"score":"B+"},
{"types":"인성교양","title":"공동체와세계시민","credit":1,"grade":3,"semester":1,"score":"A"},
{"types":"핵심교양","title":"인성채플","credit":1,"grade":3,"semester":1,"score":"P"},
{"types":"상담지도","title":"상담지도(교수-학생상담)","credit":1,"grade":3,"semester":1,"score":"P"},
{"types":"상담지도","title":"상담지도(교수-학생상담)","credit":1,"grade":2,"semester":2,"score":"P"},
{"types":"균형교양","title":"세상을바꾸는아름다운수학","credit":3,"grade":2,"semester":2,"score":"B+"},
{"types":"핵심교양","title":"인성채플","credit":1,"grade":2,"semester":2,"score":"P"},
{"types":"자기개발","title":"진로탐색및목표설정","credit":1,"grade":2,"semester":2,"score":"P"},
{"types":"상담지도","title":"상담지도(교수-학생상담)","credit":1,"grade":2,"semester":1,"score":"P"},
{"types":"핵심교양","title":"인성채플","credit":1,"grade":2,"semester":1,"score":"P"},
{"types":"정보화","title":"파이썬프로그래밍","credit":3,"grade":3,"semester":2,"score":"A+"},
{"types":"choose","title":"창의적SW디자인","credit":3,"grade":1,"semester":2,"score":"B+"},
{"types":"외국어","title":"English Reading and Writing II","credit":2,"grade":1,"semester":2,"score":"C"},
{"types":"현통","title":"현대문화와통일사상 II","credit":2,"grade":1,"semester":2,"score":"C+"},
{"types":"사고와표현","title":"테크니컬라이팅","credit":2,"grade":1,"semester":2,"score":"B"},
{"types":"상담지도","title":"사제동행세미나(4차산업혁명탐색)","credit":1,"grade":1,"semester":2,"score":"P"},
{"types":"자기개발","title":"대학생활과진로설계","credit":1,"grade":1,"semester":1,"score":"P"},
{"types":"상담지도","title":"사제동행세미나(4차산업혁명탐색)","credit":1,"grade":1,"semester":1,"score":"P"},
{"types":"균형교양","title":"기업가정신I(창업)","credit":2,"grade":1,"semester":1,"score":"D"},
{"types":"현통","title":"현대문화와통일사상 I","credit":2,"grade":1,"semester":1,"score":"C"},
{"types":"정보화","title":"CT와SW의이해","credit":3,"grade":1,"semester":1,"score":"A"},
{"types":"외국어","title":"English Listening and Speaking II","credit":2,"grade":1,"semester":1,"score":"C+"},
{"types":"사고와표현","title":"읽기와토론","credit":2,"grade":1,"semester":1,"score":"C+"}]

export {types, MajorList, RefinementList}

