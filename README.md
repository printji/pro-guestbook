# pro's guest-book

Day 1 워크북 Step 2에서 생성한 프로젝트입니다. Figma의 두 화면(목록 · 작성)을 그대로 코드로 옮겼습니다.

## 화면 구성

- `/` — 목록 화면: 최신순 메시지 카드, 로딩 스켈레톤, 빈 상태, 작성 화면으로 가는 FAB 버튼
- `/write` — 작성 화면: 이름 · 메시지 입력, 빈 값 검증, 등록 후 목록으로 이동

## 남은 단계 (워크북 Step 3~7)

### Step 3 — Supabase 테이블

1. [supabase.com](https://supabase.com) 에서 새 프로젝트 생성 (GitHub으로 로그인)
2. 프로젝트의 **SQL Editor** 에 `supabase/schema.sql` 내용을 붙여넣고 Run
   - `posts` 테이블(id, name, message, created_at) + RLS 읽기·쓰기 정책이 만들어집니다

### Step 4 — 환경 변수 연결

1. Supabase 프로젝트의 **Project Settings → API** 에서 URL과 anon public key 복사
2. 프로젝트 루트에 `.env.local` 파일을 만들고 아래 두 값을 채우기

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=복사한 URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=복사한 anon public key
   ```

3. 의존성 설치 후 로컬 실행

   ```bash
   npm install
   npm run dev
   ```

   http://localhost:3000 에서 내 디자인이 보이면 통과입니다.

### Step 5 — CRUD 확인 (★ 관문)

- 작성 화면에서 이름·메시지를 남기고 [남기기] 클릭 → 목록 맨 위에 카드가 보이는지 확인
- **새로고침해도 글이 남아 있는지** 반드시 확인
- 이름/메시지를 비운 채 제출 → 에러 안내 + 입력값 유지되는지 확인 (F12 Network 탭에 요청이 안 나가는 것도 확인)

### Step 6 — GitHub push

```bash
git init
git add .
git commit -m "feat: pro's guest-book MVP"
git branch -M main
git remote add origin <내 저장소 URL>
git push -u origin main
```

`.env.local`은 `.gitignore`에 이미 포함되어 있어 저장소에 올라가지 않습니다. push 후 GitHub 저장소 파일 목록에 `.env.local`이 없는지 확인하세요.

### Step 7 — Vercel 배포

1. [vercel.com](https://vercel.com) 에서 GitHub 저장소 Import
2. **Environment Variables** 에 `.env.local`과 동일한 두 값(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) 등록
3. Deploy → 발급된 URL을 폰에서 열어 자물쇠 아이콘과 정상 동작 확인
