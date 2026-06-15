/** SHS strand suggestions by RIASEC combo (display layer only). */
const SHS_BY_COMBO = {
  RI: ['STEM', 'Technical-Vocational-Livelihood (TVL)'],
  IR: ['STEM', 'Technical-Vocational-Livelihood (TVL)'],
  RA: ['STEM', 'Arts and Design Track'],
  AR: ['Arts and Design Track', 'STEM'],
  RS: ['Technical-Vocational-Livelihood (TVL)', 'STEM'],
  SR: ['STEM', 'General Academic Strand (GAS)'],
  RE: ['Technical-Vocational-Livelihood (TVL)', 'STEM'],
  ER: ['STEM', 'Technical-Vocational-Livelihood (TVL)'],
  RC: ['Technical-Vocational-Livelihood (TVL)', 'Accountancy, Business and Management (ABM)'],
  CR: ['Accountancy, Business and Management (ABM)', 'STEM'],
  IA: ['STEM', 'Arts and Design Track'],
  AI: ['Arts and Design Track', 'STEM'],
  IS: ['STEM', 'General Academic Strand (GAS)'],
  SI: ['General Academic Strand (GAS)', 'Humanities and Social Sciences (HUMSS)'],
  IE: ['STEM', 'Accountancy, Business and Management (ABM)'],
  EI: ['Accountancy, Business and Management (ABM)', 'STEM'],
  EA: ['Accountancy, Business and Management (ABM)', 'Arts and Design Track'],
  AE: ['Arts and Design Track', 'Accountancy, Business and Management (ABM)'],
  ES: ['Accountancy, Business and Management (ABM)', 'General Academic Strand (GAS)', 'Humanities and Social Sciences (HUMSS)'],
  SE: ['Humanities and Social Sciences (HUMSS)', 'Accountancy, Business and Management (ABM)'],
  EC: ['Accountancy, Business and Management (ABM)', 'General Academic Strand (GAS)'],
  CE: ['Accountancy, Business and Management (ABM)', 'General Academic Strand (GAS)'],
  SC: ['General Academic Strand (GAS)', 'Accountancy, Business and Management (ABM)'],
  CS: ['Accountancy, Business and Management (ABM)', 'General Academic Strand (GAS)'],
  AC: ['Arts and Design Track', 'Accountancy, Business and Management (ABM)'],
  CA: ['Accountancy, Business and Management (ABM)', 'Arts and Design Track'],
}

const SHS_BY_PRIMARY = {
  R: ['Technical-Vocational-Livelihood (TVL)', 'STEM'],
  I: ['STEM', 'General Academic Strand (GAS)'],
  A: ['Arts and Design Track', 'General Academic Strand (GAS)'],
  S: ['Humanities and Social Sciences (HUMSS)', 'General Academic Strand (GAS)'],
  E: ['Accountancy, Business and Management (ABM)', 'General Academic Strand (GAS)'],
  C: ['Accountancy, Business and Management (ABM)', 'General Academic Strand (GAS)'],
}

export function getShsStrands(combination, primaryCode) {
  if (combination && SHS_BY_COMBO[combination]) {
    return SHS_BY_COMBO[combination]
  }
  return SHS_BY_PRIMARY[primaryCode] ?? SHS_BY_PRIMARY.E
}
