import { useState } from 'react'

const RIASECSlide = ({ type }) => {
  const [selectedGender, setSelectedGender] = useState('female');
  
  const imagePath = `/src/assets/characters/${type.code.toLowerCase()}-${selectedGender}.png`;
  
  return (
    <div className="snap-center shrink-0 w-[85%] sm:w-[60%] md:w-[50%] lg:w-[42%] xl:w-[36%]">
      <article 
        className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-md h-[500px] flex flex-col"
        aria-labelledby={`riasec-${type.code}`}
      >
        {/* Header with code and gender toggle */}
        <div className={`${type.bgLight} border-b border-slate-200 px-5 py-3 flex items-center justify-between`}>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {type.code}
            </div>
            <h3 id={`riasec-${type.code}`} className="text-lg font-bold text-slate-900">
              {type.name}
            </h3>
          </div>
          {/* Gender toggle */}
          <div className="flex gap-1 bg-white rounded-lg p-1 border border-slate-200">
            <button
              onClick={() => setSelectedGender('female')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                selectedGender === 'female' 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-label="View female character"
              aria-pressed={selectedGender === 'female'}
            >
              F
            </button>
            <button
              onClick={() => setSelectedGender('male')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                selectedGender === 'male' 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-label="View male character"
              aria-pressed={selectedGender === 'male'}
            >
              M
            </button>
          </div>
        </div>

        {/* Character illustration area */}
        <div className={`${type.bgLight} flex items-end justify-center h-36 relative`}>
          <img 
            src={imagePath} 
            alt={`${type.name} character illustration`}
            className="h-full w-auto object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Description content */}
        <div className="flex-1 px-5 py-4 flex flex-col">
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            {type.description}
          </p>
          
          <div className="mt-auto">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              You might enjoy:
            </div>
            <ul className="space-y-1.5" role="list">
              {type.traits.map((trait, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${type.bgDark} mt-1.5`} aria-hidden></span>
                  <span>{trait}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </div>
  )
}

export default RIASECSlide
