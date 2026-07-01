# Overview
Refactor KursoKo React Application starting fundamentally from commit `9cd74d6`. Based on the previous architectural objectives, the goal is to orchestrate clean directory patterns (Barrels), isolate styling/rendering logic from computational functions, and establish a real integration with Vercel Serverless endpoints referencing the research documents in `./docs`.

# Project Type
WEB / BACKEND (Vercel Serverless)

# Success Criteria
- [ ] Application safely boots from `9cd74d6` snapshot
- [ ] Folder structure organized with folder-level `index.js` barrels
- [ ] File and functional coupling decoupled using Custom Hooks
- [ ] Implementation of `api/` endpoint utilizing gathered school research 

# Tech Stack
- Frontend: React / Vite + Tailwind CSS
- Backend: Vercel Serverless Functions (`/api`), Node.js
- Architecture: Clean Component Architecture

# File Structure Target
```text
src/
├── assets/
├── components/
│   ├── common/       
│   ├── features/     
│   ├── layouts/      
│   └── index.js      
├── hooks/            
├── styles/           
├── utils/            
├── App.jsx           
└── main.jsx
api/
└── calculate.js
```

# Task Breakdown

### Task 1: Environment Cleanup & Barrel Setup
- **Agent**: `frontend-specialist`
- **Output**: Clean `9cd74d6`'s component components by nesting them into `/common`, `/features`, `/layouts` and implement their barrel `.js` files.
- **Verify**: `npm run dev` displays zero native Vite import crashes.

### Task 2: Component Logic Decoupling
- **Agent**: `frontend-specialist`
- **Output**: Extract large handlers (from App.jsx or newly discovered legacy wrappers) into standard React Hooks.
- **Verify**: Component files are purely presentational.

### Task 3: Backend API Algorithm Setup
- **Agent**: `backend-specialist`
- **Output**: Analyze the `./docs` materials and write the Vercel API handler to process RIASEC combinations into direct School recommendations.

### Task 4: Frontend-Backend Linkage
- **Agent**: `frontend-specialist` & `debugger`
- **Output**: Replace mock test results with native HTTP fetches calling the serverless backend.
- **Verify**: Successful E2E transition from questionnaire to results.

# Phase X: Verification
- [ ] Run `npm run lint` 
- [ ] Build project `npm run build` safely
