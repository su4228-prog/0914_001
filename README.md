## 🏙️ 동네픽
**데이터 기반 서울 동네 추천 서비스**

서울에서 거주할 지역을 고를 때는 주거비뿐 아니라 생활민원, 의료, 교육, 주차, 상권, 인구 구성 등 여러 조건을 함께 비교해야 합니다. 하지만 이러한 정보는 서로 다른 기관과 데이터셋에 흩어져 있어 사용자가 직접 비교하기 어렵습니다.

동네픽은 서울 25개 자치구의 다양한 생활·주거 데이터를 하나의 기준으로 정리하고, 사용자의 주거 조건과 생활 성향에 따라 적합한 지역 후보를 추천하는 데이터 기반 주거 의사결정 서비스입니다.

---

## 💡 기획 의도

기존의 지역 추천은 특정 지표 하나를 기준으로 순위를 보여주거나, 사용자가 여러 정보를 직접 찾아 비교해야 하는 경우가 많습니다.

동네픽은 단순히 “어디가 좋은 지역인가?”를 정하는 것이 아니라,

> “나의 조건과 우선순위에 맞는 지역은 어디인가?”

를 데이터로 좁혀주는 것을 목표로 했습니다.

이를 위해 서로 단위가 다른 공공데이터를 자치구 단위로 통합하고, 데이터 특성에 맞게 보정·정규화한 뒤 사용자 선택에 따라 지표별 가중치를 달리 적용했습니다.

## ✨ 주요 기능

- 생활 성향 카드 기반 지역 추천
- 전세 / 월세 등 계약 유형 선택
- 아파트 / 오피스텔 / 연립·다세대 / 단독·다가구 등 주택 유형 선택
- 보증금·월세 예산 조건 반영
- 주차·의료·생활민원·상권·교육 등 세부조건 설정
- 서울 25개 자치구 TOP3 추천
- 추천 점수와 추천 이유 제공
- 지도 기반 자치구 비교
- 모바일 반응형 UI

---

## 📊 활용 데이터

| 데이터 | 활용 방식 |
|---|---|
| 생활민원 | 인구 규모 차이를 고려해 인구 1만 명당 민원 건수로 보정 |
| 전월세 실거래 | 평균 대신 중앙값을 사용해 주거비와 임대면적 비교 |
| 인구 | 20·30대 비율 등 연령대별 인구 구성 분석 |
| 상권 | 평균 영업기간과 상권 변화 특성을 활용한 지역 분위기 분석 |
| 의료 | 인구 1만 명당 의료기관 수와 의사 수 반영 |
| 교육 | 학급당 학생 수, 교원 1인당 학생 수 활용 |
| 주차 | 주택가 주차장 확보율 활용 |
| 대기질·보행시설 | 추천 점수에는 포함하지 않고 참고정보로 제공 |

## 🔎 데이터 분석 방식

서로 다른 단위의 데이터를 그대로 비교하지 않고, 지표 특성에 맞게 가공했습니다.

생활민원은 인구가 많은 지역이 단순 건수 때문에 불리해지지 않도록 **인구 1만 명당 민원 건수**로 보정했습니다.

전월세 실거래 데이터는 일부 고가 계약이 평균값을 크게 왜곡할 수 있어 **평균 대신 중앙값**을 사용했습니다.

각 지표는 서울 25개 자치구 안에서 **0~100 상대점수로 정규화**한 뒤, 사용자가 선택한 성향과 세부조건에 따라 가중치를 적용해 최종 적합도를 계산합니다.

## ⚙️ 추천 구조

사용자 성향 선택  
↓  
계약 유형 / 주택 유형 / 예산 설정  
↓  
세부 생활조건 선택  
↓  
지표별 가중치 적용  
↓  
자치구별 적합도 계산  
↓  
TOP3 추천

예를 들어 `생활이 편리한 곳`을 선택하면 의료와 주차 지표의 비중이 커지고, `젊고 활기찬 곳`을 선택하면 20·30대 인구 비율과 상권 변화 관련 지표의 비중이 높아집니다.

---

## 🛠 Tech Stack

**Data Analysis**  
Python · Pandas · NumPy · Matplotlib · Seaborn

**Frontend**  
HTML · CSS · JavaScript · D3.js

**Deployment**  
GitHub · GitHub Pages

## 🎨 서비스 설계

분석 결과를 그대로 보여주기보다 사용자가 이해하기 쉬운 방식으로 바꾸는 데 집중했습니다.

- 분석 용어보다 생활 언어 중심의 성향 카드 사용
- 많은 조건을 한 번에 보여주지 않고 성향 → 세부조건 순으로 단계화
- 선택 상태가 명확하게 보이는 버튼형 UI
- 지도 영역은 유지하고 조건 패널 내부에서 스크롤 가능하도록 구성
- 추천 점수뿐 아니라 추천 이유도 함께 제공

---

## ⚠️ 프로젝트의 한계

현재는 데이터의 공통 공간 단위에 맞춰 **서울 25개 자치구 단위**로 분석했습니다. 같은 자치구 안에서도 실제 거주환경은 동별로 차이가 있을 수 있습니다.

또한 일부 데이터는 수집 시점이 서로 다르며, 실시간 대기질처럼 특정 시점 영향을 크게 받는 데이터는 추천 점수에서 제외했습니다.

## 🚀 향후 확장

- 서울 25개 자치구 → 전국 시군구 단위 확대
- 자치구 → 행정동 단위 추천 세분화
- 민원 빅데이터 Open API 정상화 시 데이터 자동 갱신
- 관심 지역 저장·비교 기능 추가
- 사용자 선택 데이터를 활용한 추천 가중치 고도화

---

## 📎 Portfolio

프로젝트의 데이터 분석 과정, 추천 로직, 서비스 설계 과정은 포트폴리오 PPT에서 자세히 확인할 수 있습니다.
<img width="1280" height="720" alt="슬라이드1" src="https://github.com/user-attachments/assets/a1e7be4b-8a6c-4d6f-baca-6bd5fbc6c0db" />
<img width="1280" height="720" alt="슬라이드2" src="https://github.com/user-attachments/assets/f7efd1c0-430a-4db7-8677-8ec9c42207a1" />
<img width="1280" height="720" alt="슬라이드3" src="https://github.com/user-attachments/assets/ecb567e9-90a4-471c-811e-7d03ffdb6acb" />
<img width="1280" height="720" alt="슬라이드4" src="https://github.com/user-attachments/assets/c5fd129f-b189-453e-a72e-483a6d45bb4e" />
<img width="1280" height="720" alt="슬라이드5" src="https://github.com/user-attachments/assets/5bb5e31e-a557-4e7b-93f0-4f869feef669" />
<img width="1280" height="720" alt="슬라이드6" src="https://github.com/user-attachments/assets/65199b71-a133-48bb-9bd4-e3c1eef763fa" />
<img width="1280" height="720" alt="슬라이드7" src="https://github.com/user-attachments/assets/37875226-394f-4b26-998b-eab15ff63e62" />
<img width="1280" height="720" alt="슬라이드8" src="https://github.com/user-attachments/assets/45cb4291-b22f-4954-9971-2f0017dd771e" />
<img width="1280" height="720" alt="슬라이드9" src="https://github.com/user-attachments/assets/33fb9322-9fa7-48d4-aaf0-d0e37c7bd578" />
<img width="1280" height="720" alt="슬라이드10" src="https://github.com/user-attachments/assets/6035dd70-5981-4106-b9e1-4a9f6194edec" />
<img width="1280" height="720" alt="슬라이드11" src="https://github.com/user-attachments/assets/06989b74-20db-4d2e-a5c8-986fdf6e8985" />
<img width="1280" height="720" alt="슬라이드12" src="https://github.com/user-attachments/assets/bfb0682b-f199-4b23-aefa-62f2791d8547" />
<img width="1280" height="720" alt="슬라이드13" src="https://github.com/user-attachments/assets/687822d2-3601-4b9f-b030-b1bc5e8b41e8" />
<img width="1280" height="720" alt="슬라이드14" src="https://github.com/user-attachments/assets/8dca5e81-55aa-4a4e-afdc-2ed48f863981" />
<img width="1280" height="720" alt="슬라이드15" src="https://github.com/user-attachments/assets/ba3a9fd2-d142-459b-b722-42564798aadb" />
<img width="1280" height="720" alt="슬라이드16" src="https://github.com/user-attachments/assets/d4988deb-ef5b-43f9-90b8-43c75158e577" />
<img width="1280" height="720" alt="슬라이드17" src="https://github.com/user-attachments/assets/247f8881-7bab-49e8-af9b-b1fdb8f16c5f" />
<img width="1280" height="720" alt="슬라이드18" src="https://github.com/user-attachments/assets/913961ee-9916-4198-9690-661784b5de3e" />
<img width="1280" height="720" alt="슬라이드19" src="https://github.com/user-attachments/assets/45998350-8aa1-454b-921d-d74e8bb0fc72" />
<img width="1280" height="720" alt="슬라이드20" src="https://github.com/user-attachments/assets/a42f4e2b-7745-45ab-9787-209d9b6574f9" />

