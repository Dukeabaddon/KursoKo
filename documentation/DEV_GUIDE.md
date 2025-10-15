# KursoKo Developer Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Component Structure](#component-structure)
3. [Security Features](#security-features)
4. [State Management](#state-management)
5. [Validation System](#validation-system)
6. [Naming Conventions](#naming-conventions)
7. [Development Workflow](#development-workflow)

---

## Architecture Overview

### Application Pattern
**State-Based Router with Security Layer**

KursoKo uses a simple client-side state machine for navigation instead of React Router:

```
┌─────────────────────────────────────────┐
│         ErrorBoundary (Root)            │
│  ┌───────────────────────────────────┐  │
│  │           App.jsx                 │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Validation Layer            │  │  │
│  │  │  Session Management          │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Page Components:           │  │  │
│  │  │  - HomePage                 │  │  │
│  │  │  - Questionnaire            │  │  │
│  │  │  - Results                  │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### State Flow
```
User Action → Validation → Session Check → State Update → UI Render
```

---

## Component Structure

### Barrel Pattern Implementation

All components export through `src/components/index.js`:

```javascript
// ✅ Correct Import
import { HomePage, ErrorBoundary, LoadingSpinner } from './components'

// ❌ Avoid Direct Imports
import HomePage from './components/Home/HomePage'
```

### Component Organization

```
src/components/
  ├── ErrorBoundary/      # Error handling wrapper
  ├── ErrorState/         # Error display UI
  ├── LoadingSpinner/     # Loading indicators
  ├── HomePage/           # Landing page
  ├── Questionnaire/      # Assessment questions
  └── Results/            # Career recommendations
```

Each component folder contains:
- `ComponentName.jsx` - Component logic
- `index.js` - Barrel export

---

## Security Features

### 1. Session Management

**Location:** `src/utils/sessionManager.js`

```javascript
import { 
  startSession,      // Create new session
  isSessionValid,    // Validate active session
  clearSession,      // Remove session
  checkRateLimit,    // Prevent spam
  recordSubmission   // Track submissions
} from './utils/sessionManager'
```

**Security Measures:**
- Unique session IDs (UUID v4)
- 1-hour session expiration
- Session validation before submissions
- SessionStorage for client-side persistence

### 2. Response Validation

**Location:** `src/utils/validation.js`

```javascript
import { validateAndSanitize } from './utils/validation'

// Returns:
{
  isValid: boolean,
  sanitizedResponses: Array,
  errors: string[]
}
```

**Validation Rules:**
- Exactly 60 responses required
- Score range: 1-5
- No duplicate question IDs
- Timestamp validation
- Structure integrity checks

### 3. Rate Limiting

**Implementation in `App.jsx`:**

```javascript
const rateLimitCheck = checkRateLimit(5000) // 5 seconds minimum

if (!rateLimitCheck.allowed) {
  throw new Error(`Please wait ${waitTime} seconds`)
}
```

**Prevents:**
- Bot submissions
- Accidental double-clicks
- Rapid retake attempts

### 4. Data Sanitization

All user responses are sanitized before processing:

```javascript
{
  questionId: parseInt(response.questionId, 10),
  score: parseInt(response.score, 10),
  timestamp: parseInt(response.timestamp, 10)
}
```

**Prevents:**
- XSS injection
- Type coercion attacks
- Invalid data types

---

## State Management

### App-Level State

| State | Type | Purpose | Initial Value |
|-------|------|---------|---------------|
| `currentPage` | `string` | Page router | `'home'` |
| `responses` | `Array` | User answers | `[]` |
| `results` | `Object` | RIASEC scores | `null` |
| `isCalculating` | `boolean` | Loading state | `false` |
| `error` | `string|null` | Error message | `null` |

### State Transitions

```javascript
// Starting assessment
'home' → startQuestionnaire() → 'questionnaire'

// Completing assessment
'questionnaire' → completeQuestionnaire() → 'results'

// Restarting
'results' → goHome() → 'home'
```

### Callback Pattern

All navigation functions use `useCallback` for optimization:

```javascript
const startQuestionnaire = useCallback(() => {
  // Clear session
  // Reset state
  // Navigate
}, []) // No dependencies
```

---

## Validation System

### Complete Validation Pipeline

```javascript
// In completeQuestionnaire()
1. Session validation    → isSessionValid()
2. Rate limit check      → checkRateLimit()
3. Response validation   → validateAndSanitize()
4. Record submission     → recordSubmission()
5. Calculate results     → (to be implemented)
6. Clear session         → clearSession()
```

### Error Handling Flow

```javascript
try {
  // Validation steps
} catch (err) {
  setError(err.message)
  setIsCalculating(false)
}
```

Errors are displayed via `<ErrorState />` component.

---

## Naming Conventions

### Files & Components
- **Components:** PascalCase (`HomePage.jsx`)
- **Utilities:** camelCase (`validation.js`)
- **Folders:** PascalCase for components, lowercase for utils

### Functions
- **Event Handlers:** `handle` + `Action` (`handleRetry`)
- **Navigation:** Verb-based (`startQuestionnaire`, `goHome`)
- **Validation:** `validate` + `Subject` (`validateResponses`)

### Constants
- **All Caps:** `VALIDATION_CONFIG`, `SESSION_STORAGE_KEY`
- **Exported:** Named exports from utils

---

## Development Workflow

### Adding a New Component

1. **Create component folder:**
   ```bash
   mkdir src/components/NewComponent
   ```

2. **Create component file:**
   ```javascript
   // src/components/NewComponent/NewComponent.jsx
   const NewComponent = ({ prop1, prop2 }) => {
     return <div>{/* ... */}</div>
   }
   
   export default NewComponent
   ```

3. **Add barrel export:**
   ```javascript
   // src/components/NewComponent/index.js
   export { default } from './NewComponent'
   ```

4. **Update main barrel:**
   ```javascript
   // src/components/index.js
   export { default as NewComponent } from './NewComponent'
   ```

### Adding Validation Rules

Edit `src/utils/validation.js`:

```javascript
export const VALIDATION_CONFIG = {
  TOTAL_QUESTIONS: 60,  // Update this
  VALID_SCORE_RANGE: [1, 5],
  // Add new rules here
}
```

### Testing Security Features

```javascript
// In browser console:

// Test rate limiting
for(let i = 0; i < 5; i++) {
  startQuestionnaire()
}
// → Should block after first attempt

// Test validation
completeQuestionnaire([{ invalid: 'data' }])
// → Should show error

// Test session expiration
// Wait 1 hour, then submit
// → Should show session expired error
```

---

## Error Boundary Usage

### Global Error Catching

The `<ErrorBoundary>` component wraps the entire app:

```javascript
<ErrorBoundary onReset={goHome}>
  {/* App content */}
</ErrorBoundary>
```

**Catches:**
- React rendering errors
- Component lifecycle errors
- JavaScript runtime errors

**Does NOT catch:**
- Event handler errors (use try/catch)
- Async errors (use try/catch)
- Server-side errors

### Custom Fallback UI

```javascript
<ErrorBoundary 
  fallback={<CustomErrorUI />}
  onReset={handleReset}
>
  {children}
</ErrorBoundary>
```

---

## Best Practices

### ✅ Do's
- Always validate user input
- Use `useCallback` for function props
- Implement error boundaries
- Add loading states for async operations
- Clear sessions after completion
- Use semantic HTML
- Include ARIA labels

### ❌ Don'ts
- Never trust client-side data
- Avoid direct state manipulation
- Don't skip validation
- No inline functions in JSX
- Avoid deeply nested components
- Don't ignore errors
- No TODOs in production code

---

## Future Enhancements

### Planned Features
1. **RIASEC Calculation Algorithm**
   - Implement scoring logic
   - Add dimension weighting
   - Career path matching

2. **Backend Integration**
   - API endpoints for results
   - Database persistence
   - CSRF protection

3. **Advanced Analytics**
   - Completion rate tracking
   - Time-per-question analysis
   - Drop-off detection

4. **Accessibility**
   - Screen reader testing
   - Keyboard navigation
   - WCAG 2.2 AAA compliance

---

## Troubleshooting

### Common Issues

**Issue:** Session expires too quickly
```javascript
// In sessionManager.js, increase:
const maxAge = 7200000 // 2 hours
```

**Issue:** Rate limiting too strict
```javascript
// In App.jsx, reduce interval:
const rateLimitCheck = checkRateLimit(2000) // 2 seconds
```

**Issue:** Validation errors
```javascript
// Check validation.js logs:
console.log('Validation errors:', validation.errors)
```

---

## Contact & Support

**Project:** KursoKo Career Assessment  
**Repository:** github.com/Dukeabaddon/KursoKo  
**Framework:** React 19 + Vite 7 + Tailwind CSS v4

For questions or issues, check the codebase comments or create an issue on GitHub.

---

*Last Updated: October 15, 2025*
*Version: 1.0.0*
