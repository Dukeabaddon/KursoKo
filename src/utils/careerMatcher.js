import careersData from '../data/careers.json'
import { blendedCareerScore, toFitPercent } from './matchScoring.js'

const CAREER_NARRATIVES = {
  'software-engineer':
    'You like figuring out how things work behind the screen — and making tools that actually help people. You probably enjoy puzzles, building small projects, and fixing problems until they finally click. This path rewards patience, curiosity, and the satisfaction of turning an idea into something real.',
  'mechanical-engineer':
    'You think in parts, motion, and how systems fit together. You may enjoy taking things apart, improving how they run, or designing solutions that work in the real world. This career fits students who want hands-on impact at a large scale.',
  architect:
    'You imagine spaces before they exist — how light, flow, and layout change how people feel. You blend creativity with structure, which makes architecture exciting if you want design that people live inside every day.',
  teacher:
    'You light up when someone finally understands something because of you. You care about people, not just grades, and you probably explain ideas in ways your classmates actually get. Teaching is a path for patient guides who want lasting impact.',
  psychologist:
    'You pay attention to what people feel, not just what they say. You are curious about behavior and motivated to help others understand themselves. Psychology suits empathetic thinkers who want depth, research, and human connection.',
  nurse:
    'You stay calm when others panic and show up when care matters most. You combine skill with heart — the kind of person friends trust in stressful moments. Nursing is for students who want a clear, meaningful healthcare path.',
  'graphic-designer':
    'You think in color, layout, and mood. You enjoy making ideas visible — posters, brands, stories people remember at a glance. Design is a strong fit if you express yourself visually and love creative problem-solving.',
  entrepreneur:
    'You see gaps and want to fill them yourself. You like leading, selling ideas, and learning by trying. Entrepreneurship fits students who would rather build something than wait for permission.',
  accountant:
    'You trust numbers when people get emotional. You like things neat, correct, and fair — especially when money or records are involved. Accountancy rewards detail, discipline, and clear thinking.',
  'civil-engineer':
    'You care about what communities stand on — roads, bridges, buildings that last. You want practical work with visible community impact. Civil engineering suits builders who think big and plan carefully.',
  'research-scientist':
    'You ask "why?" and will not stop until the evidence makes sense. You enjoy experiments, data, and discoveries that change what people believe. Research science is for patient investigators who love the chase.',
  'social-worker':
    'You notice who is struggling and want to stand beside them. Community, dignity, and support matter to you more than status. Social work fits students drawn to service and real-world problem-solving with people.',
  electrician:
    'You like fixing what is broken and making systems work safely. Hands-on skill and quick troubleshooting energize you. This trade path leads directly to employability with clear, practical mastery.',
  'marketing-manager':
    'You read people and trends — what they want, what catches attention, what makes them act. You enjoy persuasion, storytelling, and strategy. Marketing fits students who connect ideas with audiences.',
  'data-analyst':
    'You notice patterns other people miss — who bought what, which team is winning, which habit actually works. You enjoy organizing information and using it to make smarter choices. This path suits students who like logic and evidence.',
  chef:
    'You express care through food — timing, taste, and craft under pressure. You enjoy creating experiences people feel immediately. Culinary work fits makers who blend creativity with discipline.',
  lawyer:
    'You argue with purpose, not just to win. You care about rules, fairness, and speaking clearly under pressure. Law suits students who enjoy reading closely and defending a point with structure.',
  'hr-specialist':
    'You see teams as people first, systems second. You like helping groups communicate, grow, and stay organized. HR fits students who balance empathy with structure.',
  'content-creator':
    'You turn thoughts into videos, posts, or stories that connect. You experiment, learn in public, and enjoy audience feedback. Content creation fits expressive students who like media and momentum.',
  pharmacist:
    'You combine science with trust — medicine, dosage, and patient safety. You like precision and helping people stay healthy. Pharmacy suits detail-oriented students drawn to healthcare and chemistry.',
  dentist:
    'You work with steady hands and careful judgment to keep people healthy and confident about their smile. You enjoy science, patient care, and solving problems inside the clinic. Dentistry is a licensed professional path through a six-year Doctor of Dental Medicine program.',
  welder:
    'You turn raw metal into strong joints that hold buildings, ships, and vehicles together. With a TESDA certificate, you can work locally or abroad where Filipino welders are always in demand. It is a hands-on path that rewards precision and steady practice.',
  'automotive-technician':
    'You diagnose and fix the cars, trucks, and motorcycles that keep the country moving. From quick oil changes to complex engine overhauls, your hands-on skills keep vehicles safe and running. TESDA offers a fast track, and many technicians later open their own shops.',
  'hvac-technician':
    'In a tropical country, air-conditioning is essential everywhere from homes to malls to data centers. You install, maintain, and repair cooling systems that keep people comfortable and equipment from overheating. It is a practical trade with steady local work and overseas options.',
  'seafarer-deck-officer':
    'You help move the world by guiding ships across oceans carrying goods and people. After finishing a maritime degree and earning your sea time, you take the board exam to become a deck officer. Filipino seafarers are among the most sought-after globally, and this career can support a family back home.',
  'agricultural-technician':
    'You work with soil, seeds, and science to grow food for the nation and beyond. Whether you manage a farm, advise growers on better yields, or handle post-harvest processing, your work feeds communities. With agriculture modernizing, tech-savvy technicians are needed more than ever.',
  'aircraft-maintenance-technician':
    'You keep planes safe to fly by inspecting engines, airframes, and electronics before every takeoff. Aviation schools in Metro Manila and nearby provinces train you for this high-responsibility role. With Philippine airports expanding, licensed aircraft technicians are in short supply.',
  'medical-technologist':
    'You run the lab tests that help doctors find out what is making a patient sick. From blood counts to cultures, your careful work behind the microscope guides treatment decisions. Hospitals and diagnostic centers across NCR always need board-certified med techs.',
  'cybersecurity-analyst':
    'You are the digital bodyguard that stops hackers from stealing data and crashing systems. Banks, BPOs, and government agencies in the Philippines urgently need people who can spot threats and lock down networks. It is a brainy, high-paying path that starts with an IT degree and grows with certifications.',
  'data-scientist':
    'You dig through massive piles of numbers to find patterns that help companies make smarter decisions. From predicting sales trends to training AI models, your work blends math, coding, and curiosity. It is a premium career path that is growing fast in Philippine BPOs and tech startups.',
  'marine-engineer':
    'You design, build, and maintain the engines and systems that power ships across the ocean. While deck officers navigate, you keep the heart of the vessel running. Filipino marine engineers are globally respected, and the career offers strong salaries and a clear path to becoming a chief engineer.',
  'food-technologist':
    'You make sure the food on every Filipino table is safe, nutritious, and delicious. From developing new snack flavors to testing shelf life in a lab, you blend science with daily life. Food factories, research institutes, and government agencies need technologists who understand both chemistry and local tastes.',
  'environmental-scientist':
    'You study air, water, and land to protect communities from pollution and climate change. Whether assessing a new highway\'s impact or cleaning up a river, your work helps the Philippines grow sustainably. It is a meaningful career for students who love science and nature.',
  'ui-ux-designer':
    'You design apps and websites that feel easy and enjoyable to use. By understanding how people think and click, you create layouts, buttons, and flows that make technology less frustrating. Startups and global companies in BGC and Makati hire UI/UX designers who can show a strong portfolio.',
  'game-developer':
    'You build the worlds, characters, and rules that make video games fun to play. From mobile puzzle games to big PC titles, game development mixes creativity with serious coding. The Philippines has a growing game industry, and many developers also work remotely for global studios.',
  'multimedia-artist':
    'You bring stories to life through animation, video, and digital art. From TV commercials to social media campaigns, your visuals catch eyes and deliver messages. Advertising agencies, production houses, and corporate creative teams in Metro Manila always need fresh multimedia talent.',
  journalist:
    'You ask tough questions, dig for facts, and tell stories that keep the public informed and empowered. Whether covering politics, sports, or community issues, your words shape how people understand the world. Newsrooms, online media, and PR firms in Manila offer many entry points.',
  'interior-designer':
    'You transform empty rooms into beautiful, functional spaces where people live, work, and relax. From choosing colors to planning layouts, you balance art with practicality. Condo developments and office fit-outs in NCR keep interior designers busy year-round.',
  photographer:
    'You capture moments that tell stories without words. From weddings and product shoots to documentary films, your images preserve memories and sell ideas. With a good camera and a strong portfolio, you can freelance or join media teams, ad agencies, or corporate communications.',
  caregiver:
    'You provide comfort, companionship, and daily assistance to elderly people, children, or patients who need extra help. It is a deeply human job that builds trust one day at a time. Filipino caregivers are trusted worldwide, and this TESDA path can lead to local work or overseas placement.',
  midwife:
    'You guide mothers through pregnancy and bring new life safely into the world. In barangay health centers and lying-in clinics across the Philippines, midwives are often the first healthcare worker families meet. It is a respected, hands-on profession with steady community demand.',
  'guidance-counselor':
    'You help students figure out who they are, what they want, and how to handle tough times. Schools need counselors who can listen without judging and guide teens through academic and personal challenges. It is a meaningful career for those who love supporting others.',
  'physical-therapist':
    'You help people walk, move, and live without pain after injury, surgery, or illness. From stroke survivors to athletes, your hands and knowledge rebuild strength and confidence. Hospitals, clinics, and sports teams in NCR need more licensed physical therapists.',
  'speech-language-pathologist':
    'You help children find their voice and adults recover speech after stroke or injury. Your patient, creative sessions turn frustration into communication. As awareness of autism, stroke rehab, and developmental delays grows, so does the need for speech therapists in schools and hospitals.',
  'nutritionist-dietitian':
    'You design healthy meals and educate communities about food that heals rather than harms. In hospitals, you plan diets for patients recovering from surgery; in schools, you teach kids why vegetables matter. With lifestyle diseases rising, your expertise keeps families healthier.',
  'criminology-graduate':
    'You protect communities by preventing crime, investigating cases, and enforcing the law. Whether wearing a PNP uniform or working behind the scenes in forensic labs, your work keeps streets safer. Criminology is one of the most popular courses in the Philippines for a reason: it offers a clear path to public service.',
  'sales-representative':
    'You connect people with products and services they actually need. From pharmaceuticals to real estate to software, every industry needs persuasive, trustworthy salespeople. If you are outgoing, resilient, and driven by targets, sales can earn you commissions well above a fixed salary.',
  'business-development-manager':
    'You spot new markets, negotiate deals, and find ways for companies to grow bigger and better. Whether launching a new product line or entering a new city, you turn opportunities into revenue. It is a strategic role for students who love competition, networking, and numbers.',
  'real-estate-broker':
    'You match families and investors with properties that fit their dreams and budgets. From condo units in Makati to farmland in Cavite, you know the market and close the deals. With the Philippine property market always active, skilled brokers earn through commissions and build their own client base.',
  'hotel-manager':
    'You run the show behind a hotel\'s front desk, restaurants, and rooms, making sure every guest leaves happy. From boutique inns in Tagaytay to big chains in Makati, hotel managers blend hospitality with business sense. The Philippines\' tourism growth means more hotels and more managers are needed.',
  'restaurant-manager':
    'You keep a restaurant buzzing by managing the kitchen, the floor staff, and the budget all at once. From fast-casual chains in malls to fine dining in BGC, restaurant managers make sure service is fast, food is great, and customers come back. It is a hands-on business role with clear promotion paths.',
  'flight-attendant':
    'You ensure passengers are safe, comfortable, and welcomed at 35,000 feet. Beyond serving meals, you are trained for medical emergencies and evacuations. Filipino flight attendants are known worldwide for warmth and professionalism, and local airlines are always hiring as travel rebounds.',
  'supply-chain-manager':
    'You make sure products move from factory to store shelf without delays or waste. In a country of islands, supply chain pros are crucial for keeping groceries, medicine, and electronics available everywhere. E-commerce growth has made this one of the most in-demand business roles.',
  bookkeeper:
    'You keep a company\'s financial records clean, accurate, and up to date so accountants and bosses can make smart decisions. Every small business, school, and nonprofit needs someone who understands debits and credits. It is a steady, detail-oriented job with clear paths to higher accounting roles.',
  'logistics-coordinator':
    'You are the traffic controller of goods, making sure deliveries arrive on time and warehouses do not overflow. From online shopping orders to factory parts, you track shipments and solve delays before they become problems. E-commerce growth means logistics coordinators are needed everywhere.',
  'quality-assurance-analyst':
    'You check products and software before they reach customers, catching mistakes so brands keep their good reputation. In IT, you test apps for bugs; in factories, you inspect parts for defects. It is a careful, systematic role that fits students who notice details others miss.',
  'customs-broker':
    'You clear imported goods through Philippine ports and airports, making sure paperwork, taxes, and regulations are all correct. Every smartphone, car part, and grocery item that enters the country needs a customs broker. It is a specialized, well-paying role for detail-oriented students.',
  'administrative-assistant':
    'You are the organizational backbone of every office, keeping schedules straight, files in order, and meetings running smoothly. From government agencies to BPOs to law firms, every workplace needs reliable admin staff. It is a great entry point for students who are organized, friendly, and tech-savvy.',
}

function compareCareers(a, b) {
  if (b.matchPercent !== a.matchPercent) return b.matchPercent - a.matchPercent
  if ((b.rawScore ?? 0) !== (a.rawScore ?? 0)) return (b.rawScore ?? 0) - (a.rawScore ?? 0)
  return (a.title ?? '').localeCompare(b.title ?? '')
}

/**
 * Rank careers by RIASEC cosine fit. matchPercent is a 0–100 alignment meter, not a probability.
 */
export function getCareerMatches(profile, limit = 10) {
  const scores = profile.scores ?? {}
  const primaryCode = profile.primaryDimension?.code
  const secondaryCode = profile.secondaryDimension?.code

  const userTop2 = [primaryCode, secondaryCode].filter(Boolean)

  const ranked = careersData.careers
    .map((career) => {
      const raw = blendedCareerScore(scores, career.riasecWeights, userTop2)
      const matchPercent = toFitPercent(raw)
      const reasons = []

      if (primaryCode && (career.riasecWeights[primaryCode] ?? 0) >= 0.7) {
        reasons.push(`Strong fit with your ${profile.primaryDimension.info.name} strength`)
      }
      if (secondaryCode && (career.riasecWeights[secondaryCode] ?? 0) >= 0.6) {
        reasons.push(`Aligns with your ${profile.secondaryDimension.info.name} side`)
      }
      if (reasons.length === 0) {
        reasons.push('Matches your overall interest pattern')
      }

      return {
        ...career,
        matchPercent,
        fitScore: matchPercent,
        rawScore: raw,
        whyMatched: reasons,
        strengthsUsed: career.skills.slice(0, 2),
        narrative:
          CAREER_NARRATIVES[career.id] ??
          `This path aligns with your ${profile.primaryDimension?.info?.name?.toLowerCase() ?? 'top'} strengths and rewards the kinds of tasks you naturally lean toward.`,
      }
    })
    .sort(compareCareers)

  const sliced = limit == null ? ranked : ranked.slice(0, limit)
  return sliced.map(({ rawScore: _raw, ...career }) => career)
}
