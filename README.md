# KursoKo - Career Assessment System

A React-based RIASEC personality assessment tool that helps high school students discover their ideal career paths through personalized course recommendations.

## ✨ Features

- **30-Question RIASEC Assessment**: Scientifically-designed questionnaire covering all 6 personality dimensions
- **Real-time Progress Tracking**: Visual progress bar and question counter
- **Personality Analysis**: Detailed breakdown of RIASEC scores with explanations
- **Course Recommendations**: Personalized college program suggestions based on personality profile
- **Mobile-Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Anonymous Assessment**: No user accounts or data storage required

## 🧠 RIASEC Dimensions

- **R** - Realistic: Hands-on, practical work
- **I** - Investigative: Research and analysis
- **A** - Artistic: Creative expression
- **S** - Social: Helping and teaching
- **E** - Enterprising: Leadership and business
- **C** - Conventional: Organization and data

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Installation

1. Install dependencies
```bash
npm install
```

2. Start the development server
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## 🔧 Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: TailwindCSS
- **State Management**: React Hooks (useState, useEffect)
- **Data**: JSON files for questions and course recommendations

## 📊 How It Works

1. **Assessment**: Users answer 30 questions, each presenting two career-related activities
2. **Rating**: For each selected activity, users rate their interest level (1-3)
3. **Scoring**: The system calculates scores for all 6 RIASEC dimensions
4. **Analysis**: Top 2 dimensions determine the personality combination (e.g., "RI", "SA")
5. **Recommendations**: Courses are suggested based on the personality combination

## 🎓 Course Recommendation System

The system includes 15 different RIASEC combinations, each with 4+ course recommendations:
- **RI**: Mechanical Engineering, Aerospace Engineering, Robotics
- **SA**: Counseling Psychology, Social Work, Education
- **EC**: Finance, Accounting, Operations Management
- And 12 more combinations...

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Navbar.jsx      # Navigation header
│   ├── HomePage.jsx    # Landing page
│   ├── Questionnaire.jsx # Assessment interface
│   └── Results.jsx     # Results display
├── data/               # JSON data files
│   ├── questions.json  # RIASEC questions
│   └── courses.json    # Course recommendations
├── utils/              # Utility functions
│   ├── riasecScoring.js # Scoring algorithm
│   └── courseRecommendations.js # Course matching
└── App.jsx            # Main application component
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
