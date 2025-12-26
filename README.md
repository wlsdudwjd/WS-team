# Itsme Frontend (Vue 3 + Vite)

웹/모바일용 WS 프런트엔드입니다. 이메일/구글 로그인 → 백엔드 JWT 발급 후 보호 API에 Bearer 토큰을 붙여 호출합니다.

## 기능 개요
- 로그인/회원가입: 이메일/비밀번호 또는 Firebase(Google). 성공 시 `accessToken`/`refreshToken` 저장, 보호 API 호출 시 자동으로 `Authorization: Bearer <accessToken>` 헤더 추가. 토큰 만료 시 `/api/auth/refresh`로 재발급 후 1회 재시도.
- 메뉴 추천: `/recommend/:filter?` (전체/학식/카페). 메뉴 이름 검색, 페이지네이션. 필터로 결과가 없으면 한 번 전체로 재조회.
- 홈: 인기 메뉴 Top5 (카페/학식 분리), 추천 바로가기.
- 카페/학식: 최근 주문한 매장 카드, 모든 매장 리스트(행/카드 클릭 이동).
- 마이페이지: 프로필 조회/수정, 로그아웃(토큰/세션 정리).

## 환경 변수
`.env` 루트 폴더에 위치
```
VITE_API_BASE=<백엔드 API 베이스 URL, 예: http://localhost:8080>
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 설치 및 실행
```sh
npm install
npm run build
npm run dev
```

## 이후
/dist 디렉토리에 생성된 파일을 백엔드 프로젝트 src/main/resources/static 에 붙혀 넣습니다.
