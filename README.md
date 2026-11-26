# Academic Interview Pro 🎓

> **Learn. Practice. Perform.**  
> An AI-powered Computer Science lecturer test and interview preparation platform specifically designed for candidates applying for university teaching positions (BPS-17 / BPS-18) in Pakistan (PPSC, FPSC, SPSC, KPPSC, BPSC & HEC Selection Boards).

[![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10-2D3748?logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20Auth-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tests](https://img.shields.io/badge/Tests-15%20Pillars%20Passing-brightgreen)](scripts/run-all-tests.ts)

---

## 🏛️ Platform Architecture Overview

Academic Interview Pro is built for Pakistani Computer Science lecturer aspirants preparing for provincial public service commissions (Punjab PPSC, Federal FPSC, Sindh SPSC, Khyber Pakhtunkhwa KPPSC, Balochistan BPSC) and university academic selection committees.

The platform replicates the exact statutory screening exams, viva voce boards, black-board teaching demonstrations, and programming labs prescribed by the **Higher Education Commission (HEC) of Pakistan Revised Curriculum 2025**.

```mermaid
flowchart TD
    subgraph Client["Modern Senior SaaS Interface (Next.js 16 App Router)"]
        Dashboard["Candidate Portal (/dashboard)"]
        AdminPortal["Admin Control Center (/admin)"]
        PublicHome["Public Portal & Demos (/)"]
    end

    subgraph CoreLabs["Specialized Preparation Labs"]
        MCQ["MCQ Practice & 100-Mark Mocks"]
        AIViva["AI Technical Interview Simulator"]
        VoiceLab["English Voice & Cadence Lab"]
        CodeLab["Sandboxed Programming Lab"]
        TeachLab["Micro-Teaching Demonstration"]
        Telemetry["Psychometric & Academic Telemetry"]
    end

    subgraph BackendServices["Secure Server-Side Backend"]
        AuthRBAC["Supabase Auth SSR & RBAC Guard"]
        RateLimit["Sliding-Window Memory Rate Limiter"]
        ScoringEngine["Server-Side Grading & Penalty Engine"]
        PaymentEngine["Pakistani Gateway Adapter (JazzCash/Easypaisa/Safepay)"]
        CodeSandbox["AST-Enforced Sandboxed Code Execution"]
    end

    subgraph DataStore["Enterprise Data Persistence"]
        PrismaORM["Prisma ORM 7 Engine"]
        Postgres["Supabase PostgreSQL (Pooled)"]
    end

    Client --> CoreLabs
    CoreLabs --> BackendServices
    BackendServices --> DataStore
```

---

## ✨ Complete Feature Modules (10-Phase Core)

### 1. HEC BS CS Curriculum Engine (Revised 2025)
- **21 Subject Disciplines**: Covering 18 Core CS disciplines and 3 High-Yield Supplementary fields (General Knowledge/Pakistan Studies, Pedagogical Teaching Methodology, Spoken English).
- **102 Curated Subtopics**: Fully mapped to university undergraduate curricula and provincial commission test specifications.

### 2. Verified Question Bank & Screening Suite
- **4-Option MCQ Format**: Strictly conforms to standard A/B/C/D formats with verified single keys.
- **Pedagogical Solutions**: In-depth explanations, key points, and official past paper citations (PPSC 2015-2025, FPSC, SPSC).
- **Dual Modes**: *Immediate Feedback Mode* (live explanations) and *Examination Mode* (post-test diagnostic review).

### 3. Mock Examination Engine with Negative Marking
- **Standardized Templates**: 30-question diagnostic, 50-question subject drill, and full-length 100-mark 90-minute provincial screening exams.
- **Server-Side Scoring**: Enforces statutory negative marking rates (`-0.25` marks per incorrect answer) with server-calculated merit scores.
- **Resilience**: Client state recovery (`localStorage`), duplicate submission prevention, and automatic timeout submission.

### 4. AI Technical Interview Simulator
- **5 Realistic Board Personas**: Senior Professor (Dr. Arshad), Assistant Professor (Dr. Fatima), Technical Expert (Engr. Bilal), University Selection Committee, and HR Interviewer.
- **Statutory 5-Dimension Rubric**:
  - Technical Accuracy: 40%
  - Conceptual Understanding: 25%
  - Spoken Communication: 15%
  - Answer Scaffolding & Structure: 10%
  - Problem Solving & Engineering Trade-offs: 10%
- **Actionable Viva Reports**: Technical critique, missing concepts, model answers, and textbook reading recommendations.

### 5. English Spoken Communication & Voice Lab
- **Dual Practice Architectures**:
  - *Mode 1 (Turn-Based Voice)*: Microphone recording $\rightarrow$ speech-to-text $\rightarrow$ speech cadence analysis $\rightarrow$ instant grammar & vocabulary upgrades with Urdu explanations $\rightarrow$ text-to-speech audio reply.
  - *Mode 2 (Realtime Voice)*: WebRTC low-latency audio stream supporting candidate interruption and live conversational turn-taking.
- **Cadence Velocity Gauge**: Targets the optimal academic speech range (120–145 WPM) mapped to CEFR levels (A1 to C2).

### 6. Programming Lab & Micro-Teaching Demonstration
- **Polyglot Coding Environment**: C++20 (GCC), Java 21, Python 3.12, and JavaScript (Node.js).
- **AST Security Policy**: Pre-execution static analysis rejects dangerous system calls, network sockets, file forks, and processes.
- **8-Dimension Teaching Evaluation**: Evaluates 5-minute recorded lecture demonstrations on hook, scaffolding, blackboard management, and technical accuracy.

### 7. Psychometric Telemetry & Recharts Analytics
- **Readiness Index (0–100%)**: Composite calculation benchmarking the aspirant's provincial merit percentile (e.g. "Top 4.2%").
- **Visual Dashboards**: Subject radar mastery charts, 30-day activity volume, weak topic alerts, and printable Selection Board Dossiers.

### 8. Pakistani Subscription & Payment Architecture
- **Tiers**: Free Tier, Lecturer Pro Plan, and Commission Master Season Pass.
- **Pakistani Payment Adapters**: Dynamic payload generation, webhook listeners, and HMAC-SHA256 signature verification for JazzCash, Easypaisa, Safepay, and 1Link.
- **Zero Frontend Fraud**: All payments and usage entitlements verified strictly on the server.

### 9. Admin Control Center & Platform Telemetry
- **Candidate Governance**: User management, account statuses, role promotion, and session usage tracking.
- **Content Management**: Question approvals, curriculum versioning, and past paper repository.
- **AI & Security**: Dynamic prompt template versioning, voice provider switching, sliding-window rate limiters, and immutable audit logs.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| **Framework** | Next.js 16.4.6 (App Router + Turbopack) | High-performance React server components, partial prefetching, static optimization |
| **Language** | TypeScript 5.0 (Strict Mode) | 100% type safety with zero `any` leaks |
| **Styling** | Tailwind CSS 4.3 + CSS Theme Variables | Custom academic palette: Navy `#101B36`, Blue `#315BEA`, Green `#16A37B` |
| **Components** | Radix UI + Lucide React + Recharts | Accessible UI primitives, responsive data visualizations |
| **Database** | Supabase PostgreSQL + Prisma ORM 7 | Transaction-safe schema with connection pooling |
| **Auth** | Supabase Auth (`@supabase/ssr`) | Cookie-based session tokens and server-side RBAC protection |
| **Validation** | Zod 4.6 | Strict runtime schema validation for all API inputs and webhook payloads |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` or `v22.x` LTS
- **npm**: `v10.x` or higher
- **PostgreSQL**: Local instance or Supabase cloud project

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/your-username/academicinterviewpro.git
cd academicinterviewpro
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# AI Engine
OPENAI_API_KEY="sk-proj-..."

# Pakistani Payment Gateways (Optional for sandbox testing)
JAZZCASH_MERCHANT_ID="MC12345"
JAZZCASH_PASSWORD="password"
JAZZCASH_INTEGRITY_SALT="salt_secret"
EASYPAISA_STORE_ID="12345"
EASYPAISA_HASH_KEY="hash_key_secret"
```

### 4. Database Setup & Seeding
```bash
# Push Prisma schema to database
npx prisma db push

# Seed initial 21 subjects, 100+ topics, and verified question bank
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing and Verification Suite

Academic Interview Pro includes a comprehensive automated test harness:

```bash
# Run 15-Pillar Production Verification Suite
npm test

# Run Cross-Module Integration Audit
npm run test:integration

# Run TypeScript Typecheck (0 errors)
npm run typecheck

# Run ESLint Linting (0 errors)
npm run lint

# Run Full Production Build
npm run build
```

---

## 📁 Repository Directory Structure

```
academicinterviewpro/
├── prisma/
│   ├── schema.prisma           # Prisma 7 Database schema (12 core models)
│   └── seed.ts                 # Database seeder for curriculum & question bank
├── scripts/
│   ├── run-all-tests.ts        # 15-Pillar Production Verification Harness
│   ├── test-cross-module-integration.ts # Cross-Module Integration Audit Suite
│   ├── backup-db.sh            # Automated pg_dump backup script with rotation
│   ├── deploy-azure.sh         # Zero-downtime Azure Ubuntu deployment script
│   └── health-check.sh         # Watchdog script with auto-restart triggers
├── src/
│   ├── app/                    # Next.js App Router (81 compiled routes)
│   │   ├── admin/              # Admin Control Center pages
│   │   ├── api/                # Secure server-side REST API route handlers
│   │   ├── auth/               # Authentication pages (login, register, forgot-password)
│   │   ├── dashboard/          # Candidate Portal pages (11 specialized preparation views)
│   │   ├── globals.css         # Tailwind CSS 4 theme variables & custom utilities
│   │   └── layout.tsx          # Root platform layout
│   ├── components/
│   │   ├── admin/              # Admin sidebar, header, and management views
│   │   ├── dashboard/          # Candidate sidebar, navigation bar, and stats widgets
│   │   ├── public/             # Landing page, curriculum showcase, pricing table
│   │   ├── shared/             # Reusable primitives (PageHeader, EmptyState, Skeleton, ErrorState)
│   │   └── ui/                 # Accessible UI components (Button, Badge, Card, Modal, Progress)
│   ├── data/                   # Static mock data, HEC curricula, personas, coding problems
│   └── lib/                    # Core business logic services
│       ├── ai/                 # OpenAI interview & teaching evaluation services
│       ├── analytics/          # Psychometric & readiness scoring service
│       ├── auth/               # Supabase SSR auth context & admin guards
│       ├── code-execution/     # AST security sandbox runner
│       ├── db/                 # Prisma client instance with adapter-pg
│       ├── payments/           # JazzCash, Easypaisa, Safepay payment adapters
│       ├── security/           # Sliding-window rate limiter & input sanitizers
│       └── subscription/       # Quota entitlement enforcement service
└── docs/                       # Architecture, Deployment, Maintenance & Backup Manuals
```

---

## 📄 License
This project is proprietary and confidential. Developed specifically for university faculty aspirants in Pakistan.
