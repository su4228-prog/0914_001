# 🏙️ 동네픽
**공공데이터 기반 서울 주거 의사결정 지원 서비스**

서울 25개 자치구의 민원·주거·인구·상권·의료·교육·주차 데이터를 통합하고,  
사용자의 주거 조건과 생활 성향에 따라 **맞춤형 TOP3 지역을 추천**합니다.

사이트 바로가기: https://su4228-prog.github.io/0914_001/

https://github.com/user-attachments/assets/16f29f6a-8336-40f0-bced-ef0a9ac96def

---

## 💡 프로젝트 목표

주거지 선택에 필요한 정보는 여러 데이터셋에 흩어져 있고,  
주거비만으로는 실제 생활환경을 충분히 설명하기 어렵습니다.

동네픽은 서로 다른 데이터를 **자치구 단위로 통합·보정·정규화**하고,  
사용자의 우선순위를 가중치로 반영해 **지역 선택을 돕는 추천 서비스**로 구현했습니다.

---

## 📊 데이터 규모와 가공

| 데이터 | 원본 규모 | 분석 사용 기준 |
|---|---:|---|
| 생활민원 | 168행 × 28열 | 2026년 1~7월, 서울 25개 구 기준 집계 |
| 전월세 | 416,016건 | 2026년 계약 397,601건 사용 |
| 인구·상권 | 각 550행 | 2026년 2분기, 25개 구 기준 |
| 의료 | 79,772행 | 서울 소재 의료기관 추출 후 자치구 집계 |
| 교육 | 5,421행 | 자치구 기준 교육지표 집계 |
| 주차 | 28행 | 서울 25개 구 주차 확보율 매핑 |

전월세 데이터는 계약·주택 유형별로 나누어  
**25개 구 × 3개 계약유형 × 5개 주택유형 = 375개 세그먼트**로 구성했습니다.

---

## 🔎 핵심 분석

### 1. 민원 인구 보정
단순 민원 건수 대신  
**인구 1만 명당 민원 건수**로 변환해 자치구 규모 차이를 보정했습니다.

### 2. 주거비 중앙값 적용
일부 고가 계약의 영향을 줄이기 위해  
보증금·월세·임대면적은 **평균 대신 중앙값**을 사용했습니다.

### 3. 지표 정규화
금액·건수·비율처럼 단위가 다른 값을  
서울 25개 구 기준 **0~100 상대점수**로 변환했습니다.

### 4. 사용자 가중치 추천
사용자가 선택한 성향에 따라 필요한 지표에 가중치를 적용해

**최종 적합도 = Σ(지표점수 × 가중치) ÷ Σ가중치**

방식으로 TOP3를 산출합니다.

---

## ⚙️ 추천 구조

성향 선택  
→ 계약·주택 유형 선택  
→ 예산 및 생활조건 설정  
→ 지표별 가중치 적용  
→ 자치구별 적합도 계산  
→ TOP3 추천

예시 조건:

**월세 · 오피스텔 · 보증금 3,000만 원 · 월세 100만 원**

선택한 성향에 따라 추천 순위와 추천 이유가 달라지도록 설계했습니다.

---

## ✨ 주요 기능

- 생활 성향 카드 최대 3개 선택
- 전세·월세 및 주택 유형 선택
- 보증금·월세 예산 반영
- 주차·의료·민원·상권·교육 조건 설정
- 서울 25개 자치구 TOP3 추천
- 추천 점수와 추천 이유 제공
- 지도 기반 자치구 비교
- ABOUT DATA를 통한 분석 기준 공개
- 모바일 반응형 UI

---

## 🛠 Tech Stack

**Data Analysis**  
Python · Pandas · NumPy · Matplotlib · Seaborn

**Frontend**  
HTML · CSS · JavaScript · D3.js

**Deployment**  
GitHub Pages

---

## 🎨 서비스 구현

분석 결과를 그대로 노출하지 않고  
사용자가 이해하기 쉬운 생활 언어로 변환했습니다.

- `민원율` → **조용하고 안정적인 곳**
- `임대면적 중앙값` → **넓은 집이 많은 곳**
- `의료·주차 지표` → **생활이 편리한 곳**

또한 많은 조건을 한 번에 입력하지 않도록  
**성향 → 세부조건** 순서의 단계형 UI로 구성했습니다.

---

## ⚠️ 한계

- 현재 분석 단위는 서울 25개 자치구
- 교육·주차 등 일부 데이터는 수집 시점이 다름
- 규칙 기반 가중치를 사용해 사용자 행동 데이터는 아직 미반영
- 대기질처럼 변동성이 큰 지표는 추천 점수에서 제외

---

## 🚀 향후 확장

- 자치구 → 행정동·생활권 단위 세분화
- 전국 시군구 단위 추천 확대
- 민원 Open API 연동 및 주기적 갱신
- 클릭·관심지역 데이터를 활용한 가중치 개선
- 지역 비교 리포트 형태의 B2B 활용

## 📎 Portfolio

프로젝트의 데이터 분석 과정, 추천 로직, 서비스 설계 과정은 포트폴리오 PPT에서 자세히 확인할 수 있습니다.
<img width="1280" height="720" alt="슬라이드1" src="https://github.com/user-attachments/assets/0e510931-c3c1-4501-bc89-4aaf46990494" />

목차
<img width="1280" height="720" alt="슬라이드2" src="https://github.com/user-attachments/assets/e3e0942e-2c48-4b5d-83d7-c8f4fb09f9c2" />

01 문제 정의
<img width="1280" height="720" alt="슬라이드3" src="https://github.com/user-attachments/assets/c317cf19-488b-4922-af88-80bc232be2dc" />
<img width="1280" height="720" alt="슬라이드4" src="https://github.com/user-attachments/assets/b178b1ef-9017-4080-9b34-30170caf2f6d" />

02 서비스 기획
<img width="1280" height="720" alt="슬라이드5" src="https://github.com/user-attachments/assets/58984e9c-ff59-49ae-916c-bc48c10df876" />
<img width="1280" height="720" alt="슬라이드6" src="https://github.com/user-attachments/assets/168e36a3-98ca-4f39-8b9a-a8c0fb3f32d8" />

03 데이터 분석
<img width="1280" height="720" alt="슬라이드7" src="https://github.com/user-attachments/assets/2acb17db-5b89-41b6-8d88-52a1c7a82c51" />
<img width="1280" height="720" alt="슬라이드8" src="https://github.com/user-attachments/assets/04b648b3-2dd4-4ed1-9859-1cd57984101d" />
<img width="1280" height="720" alt="슬라이드9" src="https://github.com/user-attachments/assets/33d0685d-602b-490b-9973-dd22404351a5" />
<img width="1280" height="720" alt="슬라이드10" src="https://github.com/user-attachments/assets/c60c0f5c-a784-4fa0-a077-d68913533bd3" />
<img width="1280" height="720" alt="슬라이드11" src="https://github.com/user-attachments/assets/c54c159f-cf15-4252-aeab-c365d01d7b73" />
<img width="1280" height="720" alt="슬라이드12" src="https://github.com/user-attachments/assets/3e4eefdf-d204-443f-898b-93919dc5953f" />
<img width="1280" height="720" alt="슬라이드13" src="https://github.com/user-attachments/assets/086108c3-4104-40e1-bf10-157629bb7ce8" />
<img width="1280" height="720" alt="슬라이드14" src="https://github.com/user-attachments/assets/b19f191d-93ed-42fe-9019-206ec20b3f4a" />
<img width="1280" height="720" alt="슬라이드15" src="https://github.com/user-attachments/assets/243f2eca-32a2-4426-81af-82896b843a9b" />
<img width="1280" height="720" alt="슬라이드16" src="https://github.com/user-attachments/assets/7f56f436-0883-4a7b-b0dd-53c7f7acb537" />
<img width="1280" height="720" alt="슬라이드17" src="https://github.com/user-attachments/assets/d4eb86e6-e182-4744-a4be-cfe02bdb1fba" />
<img width="1280" height="720" alt="슬라이드18" src="https://github.com/user-attachments/assets/42b33e6d-6d98-4e64-b5b5-8fc95322d84b" />
<img width="1280" height="720" alt="슬라이드19" src="https://github.com/user-attachments/assets/70bf3084-550f-46fa-9ef3-8de60b68fc09" />

04 서비스 구현
<img width="1280" height="720" alt="슬라이드20" src="https://github.com/user-attachments/assets/f17022a2-db40-4507-a231-f13656b5368e" />
<img width="1280" height="720" alt="슬라이드21" src="https://github.com/user-attachments/assets/f9f58d42-f4c2-45d2-b4d1-85d377056fee" />
<img width="1280" height="720" alt="슬라이드22" src="https://github.com/user-attachments/assets/b896e409-3f53-455f-9075-7ab6ea943d0a" />
<img width="1280" height="720" alt="슬라이드23" src="https://github.com/user-attachments/assets/0d433f32-6ec8-451b-807d-ffa8af9af723" />
<img width="1280" height="720" alt="슬라이드24" src="https://github.com/user-attachments/assets/1d82c5fc-ee9f-44ad-a4d0-8d9605cc7b58" />
<img width="1280" height="720" alt="슬라이드25" src="https://github.com/user-attachments/assets/60e2cfb1-e794-4868-b961-ce62da42b1d8" />
<img width="1280" height="720" alt="슬라이드26" src="https://github.com/user-attachments/assets/1db82ec8-a380-49b7-8909-8bf32356112a" />
<img width="1280" height="720" alt="슬라이드27" src="https://github.com/user-attachments/assets/203ce4ba-9b24-4217-a873-e0a67c6704ae" />



