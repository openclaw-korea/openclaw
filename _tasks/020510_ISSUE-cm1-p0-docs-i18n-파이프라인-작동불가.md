---
title: docs-i18n 번역 파이프라인 작동 불가 이슈
created_date: 2026-02-05 10:05
AI Model Name: Claude Sonnet 4.5
사용자 요청사항: docs-i18n 파이프라인 이슈 기록 및 수동 번역 전환
내용 요약: pi-coding-agent 기반 번역 파이프라인이 실행 시간 초과로 작동하지 않아 수동 번역으로 전환
---

# docs-i18n 번역 파이프라인 작동 불가

Ref. : [[020411_PLAN-cm2-p1-ko-KR-i18n-setup]]
#status/issue #i18n #ko-KR #docs

## TL;DR

scripts/docs-i18n 파이프라인 실행 시 타임아웃 발생 → 수동 번역으로 전환

## 문제 상황

### 시도한 방법

1. **단일 파일 번역**
   ```bash
   go run . -lang ko-KR -mode doc docs/gateway/configuration.md
   ```
   - 결과: 120초 이상 실행 중, 완료 안 됨

2. **병렬 처리 (4 workers)**
   ```bash
   go run . -lang ko-KR -mode doc -parallel 4 [13개 파일]
   ```
   - 결과: 4개 파일 시작 후 멈춤

### 원인 분석

- `@mariozechner/pi-coding-agent` 의존성 설치 완료
- PATH 설정 완료 (`/Users/dkmin/.nvm/versions/node/v22.14.0/bin`)
- 파이프라인 실행은 되나 번역 완료까지 시간 과다 소요
- API 호출 또는 모델 응답 지연 추정

## 해결 방안

### 선택: 수동 번역

**우선순위 3 게이트웨이 문서 13개 수동 번역**

1. gateway/configuration.md
2. gateway/configuration-examples.md
3. gateway/security/index.md
4. gateway/sandboxing.md
5. gateway/remote.md
6. gateway/tailscale.md
7. gateway/troubleshooting.md
8. gateway/background-process.md
9. gateway/discovery.md
10. gateway/heartbeat.md
11. gateway/pairing.md
12. gateway/protocol.md
13. gateway/multiple-gateways.md

### 번역 원칙

- 기존 번역 문서 참조: docs/ko-KR/gateway/index.md
- 용어집 준수: docs/.i18n/glossary.ko-KR.json
- 경어체 유지 (합니다/입니다)
- 코드블록/인라인 코드 번역 제외

## 향후 조치

- [ ] zh-CN 파이프라인 실행 환경 조사
- [ ] pi-coding-agent 타임아웃 설정 검토
- [ ] 파이프라인 개선 후 재시도
