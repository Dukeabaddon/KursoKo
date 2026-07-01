# Architecture Document

## Introduction

This architecture document outlines the technical architecture and implementation approach for enhancing the existing RIASEC Career Assessment Tool. The current React application already implements core RIASEC assessment functionality with a modern, youth-friendly interface. This architecture focuses on integrating the missing components: character archetypes, NCR college recommendations, and Philippine scholarship data.

## Current System Analysis

### Existing Architecture
- **Framework**: React 19.1.0 with Vite build system
- **Styling**: Tailwind CSS with custom youth-friendly design system
- **State Management**: React useState for local component state
- **Data Storage**: Static JSON files for questions and course recommendations
- **Assessment Logic**: Complete RIASEC scoring algorithm implemented
- **UI Components**: Comprehensive component library with animations and responsive design

### Current Features
- 30-question RIASEC assessment with rating system (1-3 scale)
- Progress tracking and navigation
- RIASEC score calculation and personality profiling
- Basic course recommendations based on RIASEC combinations
- Youth-friendly UI with animations and Filipino cultural elements
- Mobile-responsive design

### Gaps to Address
1. **Character Archetypes**: No visual character representations for RIASEC types
2. **NCR College Data**: Missing specific Philippine college recommendations
3. **Scholarship Integration**: No scholarship data or recommendations
4. **Data Sources**: Need integration with official Philippine education data

## Architecture

### System Overview
The enhanced system maintains the existing React SPA architecture while adding new data layers and components for character visualization, college recommendations, and scholarship information.

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                        │
├─────────────────────────────────────────────────────────────┤
│  Components Layer                                           │
│  ├── Existing: HomePage, Questionnaire, Results, Navbar    │
│  ├── Enhanced: Results (with characters & colleges)        │
│  └── New: CharacterCard, CollegeCard, ScholarshipCard      │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  ├── Existing: questions.json, courses.json               │
│  ├── Enhanced: filipinoContent.js (expanded)               │
│  └── New: ncrColleges.json, scholarships.json             │
├─────────────────────────────────────────────────────────────┤
│  Utils Layer                                                │
│  ├── Existing: riasecScoring.js, courseRecommendations.js  │
│  └── New: collegeMatching.js, scholarshipFiltering.js      │
├─────────────────────────────────────────────────────────────┤
│  Assets Layer                                               │
│  ├── Existing: Question illustrations (1-14)               │
│  └── New: Character archetype illustrations                │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture
```
User Input → RIASEC Assessment → Scoring Algorithm → Results Display
                                        ↓
Character Selection ← RIASEC Profile → College Matching → Scholarship Filtering
                                        ↓
                            Enhanced Results Display
```

## Components and Interfaces

### New Components

#### CharacterCard Component
```javascript
// Props interface
interface CharacterCardProps {
  riasecType: 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
  characterName: string
  characterDescription: string
  traits: string[]
  illustration: string
  isActive: boolean
}
```

**Purpose**: Display character archetype with illustration and personality traits
**Location**: `src/components/CharacterCard.jsx`
**Integration**: Used in Results component to show user's primary character type

#### CollegeCard Component
```javascript
// Props interface
interface CollegeCardProps {
  college: {
    name: string
    location: string
    programs: string[]
    specialties: string[]
    scholarships: string[]
    website: string
    matchReason: string
  }
  matchStrength: 'Excellent' | 'Very Good' | 'Good'
}
```

**Purpose**: Display NCR college recommendations with relevant programs
**Location**: `src/components/CollegeCard.jsx`
**Integration**: Used in Results component to show college recommendations

#### ScholarshipCard Component
```javascript
// Props interface
interface ScholarshipCardProps {
  scholarship: {
    name: string
    provider: string
    coverage: string
    requirements: string[]
    deadline: string
    applicationUrl: string
    eligibilityMatch: boolean
  }
}
```

**Purpose**: Display relevant scholarship opportunities
**Location**: `src/components/ScholarshipCard.jsx`
**Integration**: Used in Results component to show scholarship options

### Enhanced Components

#### Results Component Enhancement
The existing Results component will be enhanced to include:
- Character archetype display with illustrations
- NCR college recommendations section
- Scholarship opportunities section
- Improved layout to accommodate new content

### Data Structures

#### Character Archetypes Data
```javascript
// src/data/characterArchetypes.js
export const CHARACTER_ARCHETYPES = {
  R: {
    name: "The Builder",
    title: "Hands-On Creator",
    description: "You love working with your hands and creating tangible solutions...",
    traits: ["Practical", "Skilled", "Problem-solver", "Reliable"],
    illustration: "/assets/characters/builder.svg",
    careerFocus: "Technical and hands-on careers",
    filipinoExample: "Like Engr. Aisa Mijeno, inventor of SALt lamp"
  },
  // ... other archetypes
}
```

#### NCR Colleges Data
```javascript
// src/data/ncrColleges.json
{
  "colleges": [
    {
      "id": "up-diliman",
      "name": "University of the Philippines Diliman",
      "location": "Quezon City",
      "type": "Public",
      "programs": {
        "engineering": ["Computer Science", "Electrical Engineering", "Mechanical Engineering"],
        "liberal_arts": ["Psychology", "Sociology", "Political Science"],
        "business": ["Business Administration", "Economics"]
      },
      "specialties": ["Research Excellence", "Engineering Programs", "Liberal Arts"],
      "scholarships": ["UP Merit Scholarship", "DOST Scholarship"],
      "website": "upd.edu.ph",
      "riasecMatch": {
        "R": ["Engineering Programs"],
        "I": ["Research Programs", "Science Courses"],
        "A": ["Fine Arts", "Creative Writing"],
        "S": ["Education", "Social Work"],
        "E": ["Business Administration", "Public Administration"],
        "C": ["Accounting", "Information Systems"]
      }
    }
    // ... more colleges
  ]
}
```

#### Scholarships Data
```javascript
// src/data/scholarships.json
{
  "scholarships": [
    {
      "id": "dost-scholarship",
      "name": "DOST Science and Technology Scholarship",
      "provider": "Department of Science and Technology",
      "type": "Government",
      "coverage": {
        "tuition": "Full",
        "allowance": "Monthly stipend",
        "books": "Book allowance",
        "additional": "Thesis allowance"
      },
      "requirements": {
        "academic": "High school graduate with honors",
        "courses": ["Engineering", "Science", "Technology", "Mathematics"],
        "riasecMatch": ["R", "I", "C"]
      },
      "applicationPeriod": "March-May",
      "website": "dost.gov.ph/scholarships"
    }
    // ... more scholarships
  ]
}
```

## Data Models

### Enhanced RIASEC Profile Model
```javascript
// Enhanced profile structure
const enhancedProfile = {
  // Existing fields
  scores: { R: 15, I: 12, A: 8, S: 10, E: 7, C: 9 },
  combination: "RI",
  primaryDimension: { code: "R", score: 15, info: {...} },
  secondaryDimension: { code: "I", score: 12, info: {...} },
  
  // New fields
  characterArchetype: {
    primary: CHARACTER_ARCHETYPES.R,
    secondary: CHARACTER_ARCHETYPES.I
  },
  collegeRecommendations: [
    // Array of matched colleges
  ],
  scholarshipOpportunities: [
    // Array of relevant scholarships
  ]
}
```

### College Matching Algorithm
```javascript
// College matching logic
const matchColleges = (riasecProfile) => {
  const { primaryDimension, secondaryDimension } = riasecProfile
  
  return colleges
    .map(college => ({
      ...college,
      matchScore: calculateCollegeMatch(college, riasecProfile),
      matchReason: generateMatchReason(college, riasecProfile)
    }))
    .filter(college => college.matchScore > 0.6)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6) // Top 6 recommendations
}
```

## Error Handling

### Data Loading Error Handling
- Graceful fallbacks when college/scholarship data fails to load
- Default character archetypes if illustrations fail to load
- Offline functionality for core assessment features

### User Input Validation
- Validate RIASEC scores before generating recommendations
- Handle edge cases where no colleges match user profile
- Provide alternative recommendations when primary matches unavailable

### Network Error Handling
- Cache college and scholarship data for offline access
- Progressive enhancement for external links
- Fallback content when external resources unavailable

## Testing Strategy

### Unit Testing
- Test RIASEC scoring algorithm with various input combinations
- Test college matching algorithm with different profiles
- Test scholarship filtering logic
- Test character archetype selection

### Integration Testing
- Test complete user flow from assessment to recommendations
- Test data loading and error handling
- Test responsive design across devices
- Test accessibility features

### User Acceptance Testing
- Test with Filipino students in target demographic
- Validate college recommendations accuracy
- Verify scholarship information relevance
- Test character archetype appeal and recognition

### Performance Testing
- Test application load times with full dataset
- Test image loading optimization
- Test mobile performance on various devices
- Test data processing speed with large datasets

## Implementation Phases

### Phase 1: Character Archetypes (Week 1-2)
1. Create character archetype data structure
2. Design and implement CharacterCard component
3. Create character illustrations or source appropriate images
4. Integrate character display into Results component
5. Test character selection logic

### Phase 2: NCR College Data (Week 3-4)
1. Research and compile NCR college data from CHED sources
2. Create college data structure and JSON files
3. Implement college matching algorithm
4. Create CollegeCard component
5. Integrate college recommendations into Results component

### Phase 3: Scholarship Integration (Week 5-6)
1. Research scholarship programs from official sources
2. Create scholarship data structure
3. Implement scholarship filtering logic
4. Create ScholarshipCard component
5. Integrate scholarship display into Results component

### Phase 4: Data Enhancement & Polish (Week 7-8)
1. Expand college database with more institutions
2. Add more scholarship programs
3. Enhance matching algorithms based on testing
4. Improve UI/UX based on user feedback
5. Performance optimization and final testing

## Technical Considerations

### Data Management
- Use static JSON files for college and scholarship data (no API dependencies)
- Implement data versioning for future updates
- Create data validation schemas
- Plan for manual data maintenance workflow

### Performance Optimization
- Lazy load character illustrations
- Implement virtual scrolling for large college lists
- Optimize bundle size with code splitting
- Cache frequently accessed data

### Accessibility
- Ensure character illustrations have proper alt text
- Maintain keyboard navigation for all new components
- Provide screen reader friendly descriptions
- Test with assistive technologies

### Mobile Optimization
- Ensure all new components are mobile-responsive
- Optimize touch interactions for cards
- Test on various screen sizes and orientations
- Maintain performance on lower-end devices

## Security Considerations

### Data Privacy
- No personal data collection or storage
- Client-side only processing
- No external API calls that could leak user data
- Clear privacy policy regarding assessment results

### Content Security
- Validate all external links before including
- Ensure scholarship information accuracy
- Regular updates to maintain data freshness
- Source verification for all educational data

## Deployment Strategy

### Build Process
- Maintain existing Vite build configuration
- Add new assets to build pipeline
- Optimize images and illustrations
- Generate production-ready bundles

### Hosting Considerations
- Static site hosting compatible (Vercel, Netlify, GitHub Pages)
- CDN optimization for assets
- Proper caching headers for static data
- SEO optimization for discoverability

This architecture provides a comprehensive roadmap for enhancing the existing RIASEC Career Assessment Tool while maintaining its current strengths and addressing the identified gaps in character visualization, college recommendations, and scholarship integration.