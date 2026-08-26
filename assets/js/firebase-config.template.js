/* ============================================================
   Firebase 설정 템플릿
   - 실제 값은 저장소에 커밋하지 않는다.
   - 배포: GitHub Actions가 Secret(FIREBASE_CONFIG_JS)의 내용을
     assets/js/firebase-config.js 로 생성한다.
   - 로컬 개발: 이 파일을 firebase-config.js 로 복사해 값을 채운다.

   값이 비어 있으면 사이트는 "로컬 모드"로 동작한다:
   - DEMO 체험 코드만 진입 가능, 집계 전송 없음
   ============================================================ */
window.PE_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
