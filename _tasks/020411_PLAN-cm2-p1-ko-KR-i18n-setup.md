---
title: OpenClaw ko-KR i18n 셋업 계획서
created_date: 2026-02-04 11:30
AI Model Name: Claude Opus 4.5
사용자 요청사항: ko-KR 번역 기여를 위한 셋업 계획 작성
내용 요약: 기존 zh-CN 파이프라인 분석 기반 한국어 문서 번역 인프라 구축 계획
---

# OpenClaw ko-KR i18n 셋업 계획서

Ref. : [[020411_ISSUE-3460-i18n-tracking]]
#status/plan #i18n #ko-KR #docs

## TL;DR

zh-CN 파이프라인 복제 + 한국어 용어집 작성 → docs/ko-KR 생성 → docs.json 등록

## 현황 분석

### 기존 zh-CN 인프라 구조

```
scripts/docs-i18n/           # Go 기반 번역 파이프라인
├── main.go                  # -lang 플래그로 언어 지정 가능!
├── translator.go            # 번역 프롬프트 규칙
├── tm.go                    # Translation Memory 관리
└── ...

docs/.i18n/
├── glossary.zh-CN.json      # 용어집 (190 entries)
├── zh-CN.tm.jsonl           # 번역 메모리 캐시 (564KB)
└── README.md

docs/zh-CN/                  # 번역 결과물 (300+ md files)
docs/docs.json               # Mintlify 네비게이션 설정
```

### 파이프라인 실행 방식

```bash
# 이미 -lang 플래그 지원
go run scripts/docs-i18n/main.go -lang ko-KR -mode doc docs/**/*.md
```

## 셋업 단계

### Phase 1: 인프라 준비

| # | 작업 | 파일 |
|---|------|------|
| 1 | 한국어 용어집 생성 | `docs/.i18n/glossary.ko-KR.json` |
| 2 | ko-KR 문서 디렉토리 | `docs/ko-KR/` |
| 3 | translator.go 한국어 규칙 추가 | `scripts/docs-i18n/translator.go` |

### Phase 2: 핵심 문서 번역 (우선순위순)

1. `docs/index.md` - 랜딩
2. `docs/install/*.md` - 설치 가이드
3. `docs/start/*.md` - 시작하기
4. `docs/concepts/*.md` - 핵심 개념
5. `docs/channels/*.md` - 채널 연동

### Phase 3: 등록 및 검증

| # | 작업 |
|---|------|
| 1 | `docs/docs.json`에 ko-KR 탭 추가 |
| 2 | `docs/ko-KR/AGENTS.md` 작성 (유지보수 가이드) |
| 3 | CI 워크플로우 가드 추가 (선택) |

## 한국어 용어집 초안 (glossary.ko-KR.json)

```json
[
  { "source": "OpenClaw", "target": "OpenClaw" },
  { "source": "Gateway", "target": "게이트웨이" },
  { "source": "agent", "target": "에이전트" },
  { "source": "channel", "target": "채널" },
  { "source": "session", "target": "세션" },
  { "source": "provider", "target": "프로바이더" },
  { "source": "model", "target": "모델" },
  { "source": "tool", "target": "도구" },
  { "source": "Skills", "target": "스킬" },
  { "source": "sandbox", "target": "샌드박스" },
  { "source": "onboarding", "target": "온보딩" },
  { "source": "pairing", "target": "페어링" },
  { "source": "Getting Started", "target": "시작하기" },
  { "source": "troubleshooting", "target": "문제 해결" },
  { "source": "FAQ", "target": "FAQ" },
  { "source": "CLI", "target": "CLI" }
]
```

## 한국어 스타일 가이드

- **외래어 표기**: 기술 용어는 원어 유지 (Gateway, Skills, CLI)
- **띄어쓰기**: 영문-한글 사이 공백 없음 (`Gateway를`, `Skills를`)
- **문체**: 경어체 (합니다, 입니다)
- **코드블록**: 원문 유지, 번역 X
- **인라인 코드**: 원문 유지

## 리스크 및 대응

| 리스크 | 대응 |
|--------|------|
| Issue #3460 정책 (PR 거절) | maintainer 승인 후 진행 또는 fork 작업 |
| 번역 품질 | 네이티브 리뷰어 확보 |
| 유지보수 부담 | 자동화 파이프라인 활용 |

## 완료된 작업 (2026-02-04)

1. [x] `glossary.ko-KR.json` 생성 (90+ entries)
2. [x] `docs/ko-KR/` 디렉토리 생성
3. [x] `docs/ko-KR/AGENTS.md` 유지보수 가이드 작성
4. [x] `docs/ko-KR/index.md` 랜딩 페이지 생성
5. [x] `translator.go` 한국어 규칙 추가
6. [x] `docs/docs.json` ko-KR 탭 추가

## 완료된 작업 (2026-02-05)

1. [x] 번역 파이프라인 테스트 → **작동 불가** 확인 (타임아웃)
   - 참조: [[020510_ISSUE-cm1-p0-docs-i18n-파이프라인-작동불가]]
2. [x] 수동 번역으로 전환 결정
3. [x] 우선순위 3 게이트웨이 문서 9개 번역 완료
   - background-process, pairing, multiple-gateways, discovery
   - remote, tailscale, sandboxing, protocol, heartbeat
4. [x] 번역 현황: 30개 → 39개 (13.1%)
5. [x] 커밋: 21f4ed7dd

## 생성된 파일

```
docs/.i18n/glossary.ko-KR.json     # 한국어 용어집
docs/ko-KR/AGENTS.md               # 유지보수 가이드
docs/ko-KR/index.md                # 랜딩 페이지
scripts/docs-i18n/translator.go   # 한국어 번역 규칙 추가
docs/docs.json                     # ko-KR 탭 추가

# 2026-02-05 추가
docs/ko-KR/gateway/background-process.md
docs/ko-KR/gateway/pairing.md
docs/ko-KR/gateway/multiple-gateways.md
docs/ko-KR/gateway/discovery.md
docs/ko-KR/gateway/remote.md
docs/ko-KR/gateway/tailscale.md
docs/ko-KR/gateway/sandboxing.md
docs/ko-KR/gateway/protocol.md
docs/ko-KR/gateway/heartbeat.md
```

## 다음 단계

1. [ ] Issue #3460에서 ko-KR 공식 승인 대기
2. [x] ~~`@mariozechner/pi-coding-agent` 설치 후 번역 파이프라인 테스트~~ → 작동 불가 (수동 번역으로 전환)
3. [진행 중] 핵심 문서 번역
   - [x] 우선순위 1, 2 완료
   - [진행 중] 우선순위 3 게이트웨이 (9/13 완료, 4개 남음)
4. [ ] 우선순위 3 게이트웨이 나머지 4개 완료
5. [ ] PR 제출
