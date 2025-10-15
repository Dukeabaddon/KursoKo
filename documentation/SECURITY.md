# KursoKo Security Specification

## Overview

This document outlines the security measures implemented in the KursoKo Career Assessment application to protect against common web vulnerabilities and ensure data integrity.

---

## Threat Model

### Assets to Protect
1. **User Assessment Data** - Questionnaire responses
2. **Results Integrity** - Calculated career recommendations
3. **Application Availability** - Prevent DoS attacks

### Potential Threats
1. **Client-Side Manipulation** - User tampering with responses
2. **Bot Submissions** - Automated fake assessments
3. **Session Hijacking** - Unauthorized access to sessions
4. **XSS Attacks** - Malicious script injection
5. **Rate Abuse** - Spam submissions

---

## Security Layers

### Layer 1: Session Management

**Implementation:** `src/utils/sessionManager.js`

#### Features
- **Unique Session IDs**: UUID v4 format
- **Expiration**: 1 hour maximum session duration
- **Storage**: Browser `sessionStorage` (cleared on tab close)
- **Validation**: Checked before every submission

#### Security Benefits
```javascript
// Prevents:
✓ Session replay attacks (expired sessions rejected)
✓ Cross-tab session sharing (each tab = new session)
✓ Long-lived sessions (auto-expire after 1 hour)
```

#### Implementation Example
```javascript
// Starting new session
const sessionId = startSession()
// → Creates: { id: "uuid", startTime: timestamp, isActive: true }

// Validating session
if (!isSessionValid()) {
  throw new Error('Session expired')
}
```

---

### Layer 2: Input Validation

**Implementation:** `src/utils/validation.js`

#### Validation Rules

| Rule | Check | Error Condition |
|------|-------|-----------------|
| **Response Count** | `length === 60` | Too few/many responses |
| **Question IDs** | `1-60, unique` | Invalid or duplicate IDs |
| **Score Range** | `1-5` | Out of bounds scores |
| **Data Types** | `number` | Non-numeric values |
| **Timestamps** | `> 0` | Invalid timestamps |

#### Validation Pipeline
```javascript
1. Structure Check   → Array format, required fields
2. Data Validation   → Ranges, types, uniqueness
3. Timing Analysis   → Prevent bot submissions
4. Sanitization      → Remove unsafe data
```

#### Example Validation
```javascript
// Input
const responses = [
  { questionId: 1, score: 5, timestamp: 1697234567890 },
  // ... 59 more
]

// Validation
const { isValid, sanitizedResponses, errors } = validateAndSanitize(responses)

// Output
if (!isValid) {
  console.error(errors) // ["Response 5 has invalid score: 7"]
}
```

---

### Layer 3: Rate Limiting

**Implementation:** `src/utils/sessionManager.js` + `App.jsx`

#### Settings
```javascript
MIN_SUBMIT_INTERVAL: 5000 // 5 seconds minimum between submissions
```

#### How It Works
1. Record timestamp of each submission in `sessionStorage`
2. Check time since last submission
3. Block if < 5 seconds elapsed
4. Return wait time to user

#### Code Example
```javascript
const rateLimitCheck = checkRateLimit(5000)

if (!rateLimitCheck.allowed) {
  const waitSeconds = Math.ceil(rateLimitCheck.waitTime / 1000)
  throw new Error(`Please wait ${waitSeconds} seconds`)
}

// Proceed with submission
recordSubmission()
```

#### Prevents
- Accidental double-clicks
- Bot spam attacks
- Rapid retake attempts

---

### Layer 4: Data Sanitization

**Implementation:** `src/utils/validation.js`

#### Sanitization Process
```javascript
export const sanitizeResponses = (responses) => {
  return responses.map(response => ({
    questionId: parseInt(response.questionId, 10),
    score: parseInt(response.score, 10),
    timestamp: parseInt(response.timestamp, 10)
  }))
}
```

#### What It Does
- **Type Coercion**: Force integers
- **Property Whitelisting**: Only keep safe fields
- **Removes**: Scripts, HTML, extra properties

#### Example
```javascript
// Dangerous input
{
  questionId: "1<script>alert('xss')</script>",
  score: "5' OR '1'='1",
  timestamp: "Date.now()",
  malicious: "payload"
}

// Sanitized output
{
  questionId: 1,        // parseInt strips script
  score: 5,             // parseInt prevents SQL injection
  timestamp: NaN        // Invalid becomes NaN (caught by validation)
}
// malicious property removed
```

---

### Layer 5: Timing Analysis

**Implementation:** `src/utils/validation.js`

#### Bot Detection Logic
```javascript
MIN_TIME_PER_QUESTION: 2000    // 2 seconds minimum
MAX_TIME_PER_QUESTION: 300000  // 5 minutes maximum
```

#### Checks Performed
1. **Total Time**: Must be >= 2s × 60 questions = 120 seconds
2. **Per Question**: Each answer must take 2s-5min
3. **Suspicious Patterns**: Warns if too fast

#### Example Detection
```javascript
// Bot submission (all questions in 10 seconds)
const validation = validateResponseTiming(responses)

// Result
{
  isValid: false,
  errors: ["Responses completed too quickly (10s). Possible bot detected."]
}
```

**Note:** Currently logs warnings only (doesn't block), but can be made strict if needed.

---

## Error Handling

### ErrorBoundary Component

**Location:** `src/components/ErrorBoundary/ErrorBoundary.jsx`

#### What It Catches
✓ React rendering errors  
✓ Component lifecycle errors  
✓ JavaScript runtime errors  

#### What It Doesn't Catch
✗ Event handler errors (use try/catch)  
✗ Async/await errors (use try/catch)  
✗ Server errors (handle in fetch)  

#### Implementation
```javascript
<ErrorBoundary onReset={goHome}>
  <App />
</ErrorBoundary>
```

#### Fallback UI
- User-friendly error message in Filipino
- "Go Home" button to reset
- Technical details (dev mode only)
- Error logging (console + future reporting service)

---

### ErrorState Component

**Location:** `src/components/ErrorState/ErrorState.jsx`

#### Use Cases
- Validation failures
- Network errors
- Session expiration
- Rate limit errors

#### Example
```javascript
{error && (
  <ErrorState
    title="Oops! May problema"
    message={error}
    onRetry={handleRetry}
    onHome={goHome}
  />
)}
```

---

## Security Best Practices

### Client-Side Security

#### ✅ Implemented
- Input validation
- Session management
- Rate limiting
- Data sanitization
- Error boundaries
- Type checking

#### ⚠️ Limitations
**Client-side security is NOT foolproof!**

A determined attacker can:
- Open DevTools and manipulate state
- Bypass validation in console
- Fake timestamps
- Modify sessionStorage

**Why it's still valuable:**
1. Prevents **casual** manipulation
2. Stops **accidental** errors
3. Catches **bots** and scripts
4. Improves **data quality**

---

### Future: Backend Security

When adding a backend API, implement:

#### 1. Server-Side Validation
```javascript
// Backend validation (duplicate of client-side)
app.post('/api/submit', (req, res) => {
  const validation = validateResponses(req.body.responses)
  
  if (!validation.isValid) {
    return res.status(400).json({ error: 'Invalid data' })
  }
  
  // Process...
})
```

#### 2. CSRF Protection
```javascript
// Add CSRF token to requests
const csrfToken = document.querySelector('meta[name="csrf-token"]').content

fetch('/api/submit', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify(data)
})
```

#### 3. JWT Authentication
```javascript
// For user accounts
const token = localStorage.getItem('auth_token')

fetch('/api/submit', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

#### 4. IP-Based Rate Limiting
```javascript
// Server-side rate limit per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // 10 submissions per IP
}))
```

#### 5. Database Validation
```javascript
// Prevent duplicate submissions
const existingSubmission = await db.submissions.findOne({
  userId: req.user.id,
  createdAt: { $gte: Date.now() - 86400000 } // Last 24 hours
})

if (existingSubmission) {
  return res.status(429).json({ error: 'Already submitted today' })
}
```

---

## Security Testing

### Manual Tests

#### Test 1: Session Expiration
```javascript
// 1. Start questionnaire
// 2. Wait 1 hour
// 3. Try to submit
// Expected: "Session expired" error
```

#### Test 2: Rate Limiting
```javascript
// In browser console:
for (let i = 0; i < 5; i++) {
  startQuestionnaire()
}
// Expected: Second call blocks with "Please wait X seconds"
```

#### Test 3: Invalid Responses
```javascript
completeQuestionnaire([
  { questionId: 999, score: 10 } // Invalid
])
// Expected: "Invalid responses detected"
```

#### Test 4: Duplicate Questions
```javascript
completeQuestionnaire([
  { questionId: 1, score: 5 },
  { questionId: 1, score: 3 }, // Duplicate
  // ... rest
])
// Expected: "Duplicate questionId detected"
```

#### Test 5: XSS Attempt
```javascript
completeQuestionnaire([
  { 
    questionId: "<script>alert('xss')</script>",
    score: 5
  }
])
// Expected: Sanitized to { questionId: NaN, score: 5 } → validation error
```

---

## Vulnerability Disclosure

### Known Limitations

#### 1. Client-Side Only (Current)
**Risk Level:** 🟡 Medium  
**Issue:** All security runs in browser  
**Mitigation:** Backend validation (future)

#### 2. No User Authentication
**Risk Level:** 🟢 Low  
**Issue:** Anyone can take assessment  
**Mitigation:** Not needed for current use case

#### 3. No Data Persistence
**Risk Level:** 🟢 Low  
**Issue:** Results not saved  
**Mitigation:** Future database integration

#### 4. SessionStorage Only
**Risk Level:** 🟢 Low  
**Issue:** Shared devices could leak data  
**Mitigation:** Session expires on tab close

---

## Compliance

### WCAG 2.2 AA
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Error announcements

### GDPR Considerations
- ✅ No personal data collected
- ✅ No cookies used
- ✅ No tracking
- ✅ No third-party scripts

---

## Security Checklist

Before deployment:

- [ ] All validation rules tested
- [ ] Rate limiting verified
- [ ] Error boundaries working
- [ ] Session expiration tested
- [ ] XSS prevention confirmed
- [ ] HTTPS enabled (production)
- [ ] Content Security Policy set
- [ ] No console.logs with sensitive data
- [ ] Dependencies audited (`npm audit`)

---

## Contact

**Security Issues:** Report to project maintainers  
**Repository:** github.com/Dukeabaddon/KursoKo

---

*Last Updated: October 15, 2025*  
*Security Version: 1.0.0*
