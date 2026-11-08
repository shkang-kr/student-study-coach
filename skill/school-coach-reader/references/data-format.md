# 데이터 형식 (형식 v3, 프로그램 v3.0.2)

이 문서는 프로그램(index.html) 안의 SCHEMA에서 자동으로 만든 거예요. 프로그램이 데이터 파일을 불러올 때 이 형식을 그대로 검사해요.
표에 없는 항목이 파일에 있으면 불러오기를 막아요(개인정보가 섞이지 않도록 정해진 항목만 받아요).

## 데이터 파일

| 항목 | 형식 | 필수 | 설명·규칙 |
|---|---|---|---|
| `format` | 선택값 | 필수 | 파일 종류. 항상 "school-coach-data" (`school-coach-data`) |
| `schemaVersion` | 정수 | 필수 | 형식 버전. 지금은 3 (`1~3`) |
| `meta` | 객체 | 필수 | 데이터 정보 |
| `meta.dataset` | 글자 | 필수 | 데이터 이름(영문·숫자). 사람 이름 금지 (`^[A-Za-z0-9._-]{1,40}$`) |
| `meta.synthetic` | 참/거짓 | 필수 | 가상(합성) 데이터이면 true |
| `meta.createdAt` | 글자 | 선택 | 만든 날짜(YYYY-MM-DD) (`^\d{4}-\d{2}-\d{2}$`) |
| `school` | 객체 | 선택 | 학교(별칭만) |
| `school.alias` | 글자 | 필수 | 예: "A학교". 실제 학교 이름 금지 (`^[A-Z]{1,2}(중\|고)?학교$`) |
| `student` | 객체 | 필수 | 학생(가명만) |
| `student.pid` | 글자 | 필수 | 가명 코드. 예: S001. 실제 학번 금지 (`^S\d{3,6}$`) |
| `student.alias` | 글자 | 필수 | 예: "학생 A". 실제 이름 금지 (`^학생 [A-Z]{1,2}$`) |
| `student.grade` | 정수 | 필수 | 현재 학년(숫자) (`1~12`) |
| `exams` | 목록 | 필수 | 시험 목록(시간 순서) (`0~40개`) |
| `exams[]` | 객체 | 필수 |  |
| `exams[].id` | 글자 | 필수 | 시험 코드(영문 소문자로 시작, 숫자·_ 가능) (`^[a-z][a-z0-9_]{0,15}$`) |
| `exams[].label` | 글자 | 필수 | 시험 이름. 예: "3-2 기말" (`최대 16자`) |
| `exams[].gradeLevel` | 정수 | 선택 | 시험을 본 학년 (`1~12`) |
| `exams[].semester` | 정수 | 선택 | 학기(1 또는 2) (`1~2`) |
| `exams[].kind` | 선택값 | 필수 | 시험 종류: midterm·final·quiz·mock·other (`midterm \| final \| quiz \| mock \| other`) |
| `exams[].reported` | 객체 | 선택 | 성적표에 인쇄된 합계·평균(읽기 검산용) |
| `exams[].reported.sum` | 숫자 | 선택 | 총점 합계 (`0~2000`) |
| `exams[].reported.average` | 숫자 | 선택 | 평균 (`0~100`) |
| `subjects` | 목록 | 필수 | 과목 목록 (`1~20개`) |
| `subjects[]` | 객체 | 필수 |  |
| `subjects[].id` | 글자 | 필수 | 과목 코드(이 프로그램 안에서의 코드) (`^[a-z][a-z0-9_]{0,15}$`) |
| `subjects[].name` | 글자 | 필수 | 과목 이름 (`최대 10자`) |
| `subjects[].type` | 선택값 | 필수 | 과목 유형: math·sci·lang·memo (`math \| sci \| lang \| memo`) |
| `subjects[].code` | 글자 | 선택 | 성적표에 인쇄된 과목 코드(예: 04) (`^[0-9A-Za-z]{1,4}$`) |
| `results` | 목록 | 필수 | 시험·과목별 점수(응시한 것만) (`0~800개`) |
| `results[]` | 객체 | 필수 |  |
| `results[].exam` | 글자 | 필수 | 시험 코드(exams의 id) (`^[a-z][a-z0-9_]{0,15}$`) |
| `results[].subject` | 글자 | 필수 | 과목 코드(subjects의 id) (`^[a-z][a-z0-9_]{0,15}$`) |
| `results[].objective` | 정수 | 필수 | 객관식 득점 (`0~100`) |
| `results[].written` | 정수 | 필수 | 서술형(주관식) 득점 (`0~100`) |
| `results[].performance` | 정수 | 선택 | 실기(수행평가) 득점. 없으면 생략 (`0~100`) |
| `results[].reportedTotal` | 정수 | 선택 | 성적표에 인쇄된 과목 총점(읽기 검산용) (`0~100`) |
| `items` | 목록 | 선택 | 문항별 오답 표기(성적표의 문항 표). 맞은 문항은 적지 않아요 (`0~400개`) |
| `items[]` | 객체 | 필수 |  |
| `items[].exam` | 글자 | 필수 | 시험 코드 (`^[a-z][a-z0-9_]{0,15}$`) |
| `items[].subject` | 글자 | 필수 | 과목 코드 (`^[a-z][a-z0-9_]{0,15}$`) |
| `items[].count` | 정수 | 선택 | 전체 문항 수 (`1~100`) |
| `items[].wrong` | 목록 | 필수 | 틀린 문항 (`0~100개`) |
| `items[].wrong[]` | 객체 | 필수 |  |
| `items[].wrong[].n` | 정수 | 필수 | 문항 번호 (`1~100`) |
| `items[].wrong[].chosen` | 목록 | 필수 | 학생이 고른 보기(복수 표기 가능, 모르면 빈 목록) (`0~5개`) |
| `items[].wrong[].chosen[]` | 정수 | 필수 | 보기 번호 (`1~5`) |
| `items[].blank` | 목록 | 선택 | 비운 문항 번호 (`0~100개`) |
| `items[].blank[]` | 정수 | 필수 | 문항 번호 (`1~100`) |
| `extras` | 목록 | 선택 | 스키마에 아직 없는 항목(다음 개정의 근거). 이름·학번 같은 식별 정보는 넣지 않아요 (`0~200개`) |
| `extras[]` | 객체 | 필수 |  |
| `extras[].exam` | 글자 | 선택 | 관련 시험 코드 (`^[a-z][a-z0-9_]{0,15}$`) |
| `extras[].subject` | 글자 | 선택 | 관련 과목 코드 (`^[a-z][a-z0-9_]{0,15}$`) |
| `extras[].label` | 글자 | 필수 | 항목 이름 (`최대 20자`) |
| `extras[].value` | 글자 | 필수 | 값 (`최대 40자`) |
| `schedule` | 목록 | 선택 | 학사 일정(주요 일정). 학교 이름·홈페이지 주소는 넣지 않아요 (`0~200개`) |
| `schedule[]` | 객체 | 필수 |  |
| `schedule[].date` | 글자 | 필수 | 시작 날짜(YYYY-MM-DD) (`^\d{4}-\d{2}-\d{2}$`) |
| `schedule[].endDate` | 글자 | 선택 | 끝 날짜(하루짜리는 생략) (`^\d{4}-\d{2}-\d{2}$`) |
| `schedule[].title` | 글자 | 필수 | 일정 이름 (`최대 40자`) |
| `schedule[].category` | 선택값 | 필수 | 종류: exam·event·holiday·vacation·other (`exam \| event \| holiday \| vacation \| other`) |
| `schedule[].confirmed` | 참/거짓 | 선택 | 학생이 확인했으면 true |
| `profile` | 객체 | 선택 | 학습 성향(선택) |
| `profile.traits` | 목록 | 선택 | 성향 목록 (`0~8개`) |
| `profile.traits[]` | 객체 | 필수 |  |
| `profile.traits[].label` | 글자 | 필수 | 항목 이름 (`최대 12자`) |
| `profile.traits[].value` | 글자 | 필수 | 내용 (`최대 16자`) |
| `class` | 객체 | 선택 | 학급 비교(교사 화면용, 선택) |
| `class.alias` | 글자 | 필수 | 예: "3학년 3반" (`^\d학년 \d{1,2}반$`) |
| `class.examIds` | 목록 | 필수 | 비교할 시험 코드(시간 순서) (`2~6개`) |
| `class.examIds[]` | 글자 | 필수 |  (`^[a-z][a-z0-9_]{0,15}$`) |
| `class.students` | 목록 | 필수 | 학급 학생(가명만) (`1~60개`) |
| `class.students[]` | 객체 | 필수 |  |
| `class.students[].alias` | 글자 | 필수 | 예: "학생 B" (`^학생 [A-Z]{1,2}$`) |
| `class.students[].scores` | 맵 | 필수 | 과목 코드별 점수 목록(examIds와 같은 길이) |
| `class.students[].scores{코드}` | 목록 | 필수 |  (`2~6개`) |
| `class.students[].scores{코드}[]` | 정수 | 필수 |  (`0~100`) |
| `examAnalyses` | 목록 | 선택 | 시험지 분석 예시(선택) (`0~20개`) |
| `examAnalyses[]` | 객체 | 필수 |  |
| `examAnalyses[].id` | 글자 | 필수 |  (`^[a-z][a-z0-9_]{0,15}$`) |
| `examAnalyses[].title` | 글자 | 필수 | 분석 제목 (`최대 40자`) |
| `examAnalyses[].questions` | 목록 | 필수 | 문항 목록 (`1~100개`) |
| `examAnalyses[].questions[]` | 객체 | 필수 |  |
| `examAnalyses[].questions[].no` | 정수 | 필수 | 문항 번호 (`1~100`) |
| `examAnalyses[].questions[].points` | 숫자 | 필수 | 배점 (`0~100`) |
| `examAnalyses[].questions[].topic` | 글자 | 선택 | 문항 주제 (`최대 40자`) |
| `examAnalyses[].questions[].studentAnswer` | 정수(null 가능) | 선택 | 학생이 고른 답. 읽지 못하면 null (`1~5`) |
| `examAnalyses[].questions[].studentAnswerConfidence` | 선택값 | 선택 | 학생 답을 읽은 확신 (`높음 \| 보통 \| 낮음 \| 읽기 어려움`) |
| `examAnalyses[].questions[].key` | 정수 | 필수 | 정답(임시 정답 포함) (`1~5`) |
| `examAnalyses[].questions[].keyConfidence` | 선택값 | 선택 | 정답의 확신 (`높음 \| 보통 \| 낮음 \| 읽기 어려움`) |
| `examAnalyses[].questions[].trace` | 글자 | 선택 | 풀이 흔적 설명 (`최대 160자`) |
| `examAnalyses[].questions[].why` | 글자 | 선택 | 틀렸을 때 설명 (`최대 200자`) |
| `examAnalyses[].tasks` | 목록 | 선택 | 보강 과제 (`0~30개`) |
| `examAnalyses[].tasks[]` | 객체 | 필수 |  |
| `examAnalyses[].tasks[].q` | 정수 | 필수 | 연결된 문항 번호. 0이면 공통 과제 (`0~100`) |
| `examAnalyses[].tasks[].text` | 글자 | 필수 | 과제 내용 (`최대 100자`) |
| `examAnalyses[].tasks[].minutes` | 정수 | 필수 | 소요 시간(분) (`5~60`) |
| `examAnalyses[].tasks[].onlyWrongAtLeast` | 정수 | 선택 | 틀린 문항이 이 개수 이상일 때만 표시 (`1~100`) |
| `examAnalyses[].coaching` | 객체 | 선택 | 코칭 문구 |
| `examAnalyses[].coaching.strength` | 글자 | 선택 | 잘한 점 (`최대 120자`) |
| `examAnalyses[].coaching.pattern` | 글자 | 선택 | 틀린 문항이 2개 이상일 때의 공통점 (`최대 200자`) |

## 파서 출력 형식 (reportCard의 payload)

성적표 이미지를 읽는 쪽(AI 도구 또는 읽기 서버)이 돌려줘야 하는 결과예요. 이름·학번·학교 이름 같은 식별 항목은 이 형식에 없고, 있으면 프로그램이 버려요.

| 항목 | 형식 | 필수 | 설명·규칙 |
|---|---|---|---|
| `parser` | 글자 | 선택 | 파서 이름·버전 (`최대 40자`) |
| `confidence` | 숫자 | 선택 | 전체 확신(0~1) (`0~1`) |
| `exam` | 객체 | 필수 | 시험 정보 |
| `exam.label` | 글자 | 필수 | 시험 이름. 예: "2학기 중간고사" (`최대 16자`) |
| `exam.gradeLevel` | 정수 | 선택 | 학년 (`1~12`) |
| `exam.semester` | 정수 | 선택 | 학기 (`1~2`) |
| `exam.kind` | 선택값 | 선택 | 시험 종류 (`midterm \| final \| quiz \| mock \| other`) |
| `subjects` | 목록 | 필수 | 과목별 결과 (`1~20개`) |
| `subjects[]` | 객체 | 필수 |  |
| `subjects[].name` | 글자 | 필수 | 과목 이름 (`최대 10자`) |
| `subjects[].code` | 글자 | 선택 | 성적표의 과목 코드 (`^[0-9A-Za-z]{1,4}$`) |
| `subjects[].objective` | 정수 | 선택 | 객관식 (`0~100`) |
| `subjects[].written` | 정수 | 선택 | 서술형·주관식 (`0~100`) |
| `subjects[].performance` | 정수 | 선택 | 실기 (`0~100`) |
| `subjects[].reportedTotal` | 정수 | 선택 | 성적표 총점 (`0~100`) |
| `subjects[].itemCount` | 정수 | 선택 | 전체 문항 수 (`1~100`) |
| `subjects[].wrong` | 목록 | 선택 | 틀린 문항 (`0~100개`) |
| `subjects[].wrong[]` | 객체 | 필수 |  |
| `subjects[].wrong[].n` | 정수 | 필수 | 문항 번호 (`1~100`) |
| `subjects[].wrong[].chosen` | 목록 | 필수 | 고른 보기 (`0~5개`) |
| `subjects[].wrong[].chosen[]` | 정수 | 필수 | 보기 번호 (`1~5`) |
| `subjects[].blank` | 목록 | 선택 | 비운 문항 (`0~100개`) |
| `subjects[].blank[]` | 정수 | 필수 | 문항 번호 (`1~100`) |
| `reported` | 객체 | 선택 | 성적표의 합계·평균 |
| `reported.sum` | 숫자 | 선택 | 총점 합계 (`0~2000`) |
| `reported.average` | 숫자 | 선택 | 평균 (`0~100`) |
| `extras` | 목록 | 선택 | 스키마에 없는 항목 (`0~50개`) |
| `extras[]` | 객체 | 필수 |  |
| `extras[].label` | 글자 | 필수 | 항목 이름 (`최대 20자`) |
| `extras[].value` | 글자 | 필수 | 값 (`최대 40자`) |

## AI 결과 봉투

```json
{ "kind": "reportCard | schedule | examJudgement", "schemaVersion": 3, "payload": { } }
```

- `reportCard`: 위 "파서 출력 형식".
- `schedule`: `{ "events": [ ...schedule 항목... ] }` (데이터 파일의 `schedule`과 같은 항목, `confirmed`는 앱이 false로 넣어요).
- `examJudgement`: 데이터 파일의 `examAnalyses[]` 항목 하나.
