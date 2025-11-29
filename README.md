# AI 팩트 관상 (AI Fact-based Face Reading)

**"당신의 얼굴에 숨겨진 잔혹한 진실을 마주하세요."**

이 프로젝트는 Google Gemini AI를 활용하여 사용자의 관상을 분석하고, 사용자가 입력한 구체적인 고민에 대해 냉철하고 객관적인 조언을 제공하는 웹 애플리케이션입니다.

## 🚀 주요 기능

1.  **AI 관상 분석 (Gemini 2.0 Flash)**
    *   사용자의 얼굴 사진을 분석하여 성격, 재물운, 연애운 등을 파악합니다.
    *   단순한 덕담이 아닌, **"팩트 폭격"** 수준의 냉철하고 비판적인 분석을 제공합니다.
    *   사용자가 입력한 **구체적인 고민/욕망**에 맞춰 맞춤형 조언을 생성합니다.

2.  **구체적인 고민 상담**
    *   단순한 선택지 대신, 사용자가 직접 자신의 상황과 고민을 300자 이내로 구체적으로 작성합니다.
    *   AI는 이 내용을 바탕으로 관상학적 근거를 들어 해결책을 제시합니다.

3.  **바이럴 & 잠금 해제 시스템 (Referral System)**
    *   핵심 분석 결과(성격, 재물, 연애, 조언)는 처음에 **잠겨(Locked)** 있습니다.
    *   **"친구 3명 초대"** 미션을 달성해야 결과가 해제됩니다.
    *   로컬 파일 기반의 DB(`referrals.json`)를 사용하여 실제 초대 링크 방문을 추적합니다.

4.  **관상 등급 & 티어**
    *   **관상 점수**: 얼굴의 조화와 기운을 점수로 환산하여 보여줍니다.
    *   **재물/사회성 티어**: 상위 1%, 자수성가형 등 직관적인 티어로 표현합니다.

## 🛠 기술 스택

*   **Framework**: Next.js 14 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS, Framer Motion (애니메이션)
*   **AI Model**: Google Gemini 2.0 Flash Lite (Vision + Text)
*   **Icons**: Lucide React
*   **Data Persistence**: LocalStorage (Client), JSON File (Server - Referral Tracking)

## 📦 설치 및 실행 방법

1.  **프로젝트 클론**
    ```bash
    git clone https://github.com/YOUR_USERNAME/karma-image.git
    cd karma-image
    ```

2.  **패키지 설치**
    ```bash
    npm install
    ```

3.  **환경 변수 설정**
    root 디렉토리에 `.env` 파일을 생성하고 Gemini API 키를 입력하세요.
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **개발 서버 실행**
    ```bash
    npm run dev
    ```
    브라우저에서 `http://localhost:3000`으로 접속하세요.

## 📂 프로젝트 구조

```
src/
├── app/
│   ├── api/            # API Routes (Analyze, Referral)
│   ├── analysis/       # 분석 로딩 페이지
│   ├── result/         # 결과 페이지 (잠금/해제 로직)
│   ├── scan/           # 사진 업로드 페이지
│   └── page.tsx        # 랜딩 페이지 (고민 입력)
├── components/
│   └── ui/             # 재사용 가능한 UI 컴포넌트 (Button, BottomSheet 등)
├── lib/
│   └── gemini.ts       # Google Gemini API 연동 로직
└── ...
```

## ⚠️ 주의사항

*   이 서비스는 재미를 위한 관상 분석 서비스입니다. 결과에 너무 과몰입하지 마세요.
*   업로드된 사진은 분석 직후 삭제되거나, 브라우저 로컬 스토리지에만 잠시 저장됩니다 (서버 저장 X).
