### 프로젝트 소개
이 프로젝트는 과학기술정보통신부 ICT 멘토링과 연계된 2023년도 덕성여자대학교 컴퓨터공학전공 졸업프로젝트의 일환으로 진행되었습니다.

### 프로젝트 요약
- 제목: 실시간 GPS 탐지 및 GPT-4 모델 활용 대중교통 알림 서비스 모바일 어플리케이션 (어댄고)
- 주요기능
  1. GPS 기반 사용자가 탑승한 버스 탐지/QR코드 스캔을 통해 사용자가 탑승한 지하철 탐지
  2. 탑승 차량을 추적하여 실제 버스 또는 지하철 내에 설치된 전광판/안내방송과 동일한 정보를 어플리케이션 UI를 통해 제공 및 업데이트
  3. 서울시 공공데이터 및 AccuWeather API를 이용하여 도로 현황 (도로 속도 및 날씨 정보), 지하철 출구 정보, 접근성 정보 (엘레베이터 위치 등) 부가 정보 제공
- 사용기술
    - 프레임워크: React Native, Django
    - 플랫폼: Google Cloud Platform
- 참고: 시스템 구조도

### 프로젝트 성과 및 의의
1. 2023 이브와 ICT 멘토링 참여 및 공모전 사전심의 통과
2. Google Cloud Platform을 통한 서버 어플리케이션 배포
3. 모바일 기기를 통한 하차 버튼 시스템 제안

### 로컬 환경에서의 실행
### IP 설정
1. `/react-app/api/config.js BASE_URL`
2. `/django_server/django_server/setting.py ALLOWED_HOSTS`

### 환경설정
`pip install -r requirements.txt`

### 지하철 역 모델 및 필드 생성 커맨드
1. 지하철 역 모델 생성: `manage.py populate_subway_stations`
2. `accessibility_info` & `POI_locator` 필드 생성: `manage.py update_subway_station_facilities`
3. `accessibility_info_text` & `POI_locator_text` 필드 생성:`manage.py update_subway_information_texts`

### 실행
- 서버 어플리케이션  
  `uvicorn django_server.asgi:application --host 0.0.0.0 --port 8000`
- 클라이언트 어플리케이션  
  `npm start`