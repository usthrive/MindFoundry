/**
 * Fetch real YouTube video durations and generate a SQL migration.
 *
 * Usage:
 *   cd MindFoundry/frontend
 *   YOUTUBE_API_KEY=<your-key> npx tsx ../scripts/fetch-video-durations.ts
 */

const API_KEY = process.env.YOUTUBE_API_KEY
if (!API_KEY) {
  console.error('Error: YOUTUBE_API_KEY environment variable is required.')
  console.error('Usage: YOUTUBE_API_KEY=<key> npx tsx scripts/fetch-video-durations.ts')
  process.exit(1)
}

// All 53 videos from the seed migration (20260121000001_video_integration.sql)
// Format: [youtubeId, title, currentDurationSeconds]
const VIDEOS: [string, string, number][] = [
  // Level 7A-5A: Number Sense
  ['Nh1QeH7PL5Y', 'Chicken Count | Count 1 to 10', 145],
  ['610A2IzBm-I', 'Number Seven | Counting 1 to 10! | Part 4', 300],
  ['dNDMW2W4nQk', 'Counting 1 to 100 | Mini Math Movies', 165],
  ['Tc3zFXVfYIg', 'COUNTING NUMBERS FOR KIDS 1 TO 100', 360],
  ['-zyqspTpKzM', 'PART 5 NUMBER RECOGNITION: Learn to count 1-10', 240],
  ['_uedvVJFeBU', '5 Fun number sense games to teach number recognition', 525],
  ['TShHga40XgQ', 'Count by 10 Song | Skip Counting by 10', 150],
  ['5FaBDqOmiyI', 'Skip Counting by 2s, 3s, 4s, 5s, 10s, and 100s', 588],
  ['ka9zbPcqXBI', 'Greater Than Less Than Song for Kids', 200],
  ['rBkwSl8Tj98', 'Comparing Numbers for Kids (Grade 1)', 420],

  // Level 4A-2A: Basic Operations
  ['uONIJ5TQ2DA', 'Move and Add, Add and Move | Addition Song', 225],
  ['kwphjyYokbY', 'Addition for Kids | Basic Addition for Kindergarten', 360],
  ['zl5m4e_d3xg', 'Let\'s All Do the 10 Dance | Number Bonds to 10', 140],
  ['erJlnqRfUMM', 'Addition Facts 0-10 | Practice Drills', 300],
  ['L_m-3-ITiX8', 'Addition Facts 11-20', 240],
  ['183gDLvCmmo', 'Making 10 Strategy for Addition', 375],
  ['y2Ntn69b8Cs', 'Basic Subtraction for Kids', 240],
  ['eg9iSgMAJZc', 'Subtraction with Pictures', 330],
  ['dslT0LOTf5w', 'Subtraction Song | Minus 1', 150],
  ['ohur61E569w', 'Subtraction Facts 0-20 Drill', 300],

  // Level A-B: Multi-Digit Operations
  ['kmhdFjgFHA8', 'Two Digit Addition No Regrouping', 180],
  ['G1cNKc3PD74', 'Adding Two-Digit Numbers', 360],
  ['pjhlq31kBho', 'Two Digit Addition with Regrouping', 225],
  ['fbykrBCqopk', '2-Digit Subtraction No Regrouping', 210],
  ['_CcdCmYP-Wo', 'Subtraction - Two Digits', 360],
  ['YJ6FIhwHVCs', 'Subtraction with Regrouping', 240],

  // Level C: Multiplication
  ['fZFwHpiAVE0', 'What is Multiplication? | Arrays', 353],
  ['un-kKDVFlQg', '2 Times Table Song', 165],
  ['C3PojOwjHcc', 'Multiplication Mash Up | 1-10 Tables', 1200],
  ['9XzfQUXqiYY', '3 Times Table Song (Uptown Funk Cover)', 210],
  ['7pbwAax2zU4', '7 Times Table Song', 180],
  ['CnY7jpHR_FU', 'Area Model Multiplication Explained', 240],

  // Level D: Division
  ['2muobEZUalE', 'Basic Division', 300],
  ['SGEPOhQ09Rc', 'Division Concept | Periwinkle', 505],
  ['N_8YL_VdkSU', 'Division Tables 8 Mixed Up', 180],
  ['up_xKZ6GeUg', 'Long Division with Remainders (DMSB)', 300],
  ['LGqDdbpnXFQ', 'Long Division', 600],
  ['uiSDZ3zB_d4', 'Divisibility Rules for 2, 3, 5, 9, 10', 180],

  // Level E: Fractions
  ['5TaQc0HojSw', 'What is a Fraction?', 270],
  ['dBZ2QGZBH6M', 'Equivalent Fractions', 300],
  ['7OGG9whj3CU', 'Adding Fractions with Unlike Denominators', 300],
  ['qmfXyR7Z6Lk', 'Multiplying Fractions', 300],
  ['4lkq3DgvmJo', 'Dividing Fractions (Why Flip?)', 600],
  ['EpXCr2iax5E', 'Mixed Numbers to Improper Fractions', 240],
  ['Y7Xav-XAhXs', 'LCM and GCF Difference', 300],
  ['AHszBRnPbYM', 'Ladder Method for LCM and GCF', 540],

  // Level G-I: Pre-Algebra & Algebra
  ['dAgfnK528RA', 'Order of Operations | PEMDAS', 420],
  ['XFKjQEFaEQM', 'What are Integers?', 360],
  ['-zUmvpkhvW8', 'What are Exponents?', 300],
  ['l3XzepN03KQ', 'Solving Basic Equations', 480],
  ['MXV65i9g1Xg', 'Slope Intercept Form', 300],

  // Level I-L: Advanced Algebra
  ['-4jANGlJRSY', 'Factoring Trinomials', 720],
  ['F3eTBxCnzvI', 'Quadratic Formula', 600],
  ['c9iBIkclp_s', 'Quadratic Formula Song', 240],
  ['8lT00iLntFc', 'Polynomial Long Division', 720],
  ['SbUiZx5a0Ok', 'Polynomial Division Basics', 300],
]

function parseISO8601Duration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const hours = parseInt(match[1] || '0', 10)
  const minutes = parseInt(match[2] || '0', 10)
  const seconds = parseInt(match[3] || '0', 10)
  return hours * 3600 + minutes * 60 + seconds
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

async function fetchBatch(ids: string[]): Promise<Map<string, number>> {
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${ids.join(',')}&part=contentDetails&key=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`YouTube API error ${res.status}: ${body}`)
  }
  const data = await res.json()
  const map = new Map<string, number>()
  for (const item of data.items) {
    map.set(item.id, parseISO8601Duration(item.contentDetails.duration))
  }
  return map
}

async function main() {
  const allIds = VIDEOS.map(([id]) => id)

  // YouTube API accepts up to 50 IDs per request
  const batch1 = allIds.slice(0, 50)
  const batch2 = allIds.slice(50)

  console.log(`Fetching durations for ${allIds.length} videos (${batch1.length} + ${batch2.length} batches)...\n`)

  const results = new Map<string, number>()

  const map1 = await fetchBatch(batch1)
  for (const [k, v] of map1) results.set(k, v)

  if (batch2.length > 0) {
    const map2 = await fetchBatch(batch2)
    for (const [k, v] of map2) results.set(k, v)
  }

  // Print diff table
  const notFound: string[] = []
  const changed: [string, string, number, number][] = []
  let unchanged = 0

  console.log('┌──────────────┬────────────────────────────────────────────────────┬───────────┬───────────┬────────┐')
  console.log('│ YouTube ID   │ Title                                              │ Old       │ New       │ Delta  │')
  console.log('├──────────────┼────────────────────────────────────────────────────┼───────────┼───────────┼────────┤')

  for (const [id, title, oldDuration] of VIDEOS) {
    const newDuration = results.get(id)
    if (newDuration === undefined) {
      notFound.push(id)
      console.log(`│ ${id.padEnd(12)} │ ${title.slice(0, 50).padEnd(50)} │ ${formatDuration(oldDuration).padStart(9)} │ NOT FOUND │        │`)
      continue
    }

    const delta = newDuration - oldDuration
    if (delta === 0) {
      unchanged++
      continue
    }

    changed.push([id, title, oldDuration, newDuration])
    const deltaStr = (delta > 0 ? '+' : '') + delta + 's'
    console.log(`│ ${id.padEnd(12)} │ ${title.slice(0, 50).padEnd(50)} │ ${formatDuration(oldDuration).padStart(9)} │ ${formatDuration(newDuration).padStart(9)} │ ${deltaStr.padStart(6)} │`)
  }

  console.log('└──────────────┴────────────────────────────────────────────────────┴───────────┴───────────┴────────┘')
  console.log(`\nSummary: ${changed.length} changed, ${unchanged} unchanged, ${notFound.length} not found`)

  if (notFound.length > 0) {
    console.log(`\n⚠️  Videos not found (deleted/private): ${notFound.join(', ')}`)
  }

  if (changed.length === 0) {
    console.log('\nAll durations are already correct! No migration needed.')
    return
  }

  // Generate SQL migration
  const timestamp = new Date().toISOString()
  const migrationPath = new URL('../supabase/migrations/20260218000001_fix_video_durations.sql', import.meta.url)

  let sql = `-- Fix video durations: Fetched from YouTube Data API v3\n`
  sql += `-- Generated: ${timestamp}\n`
  sql += `-- ${changed.length} videos with incorrect durations\n\n`

  for (const [id, title, oldDuration, newDuration] of changed) {
    sql += `-- ${title} (was ${formatDuration(oldDuration)}, now ${formatDuration(newDuration)})\n`
    sql += `UPDATE video_library SET duration_seconds = ${newDuration}, updated_at = NOW() WHERE youtube_id = '${id}';\n\n`
  }

  sql += `DO $$ BEGIN RAISE NOTICE 'Fixed durations for ${changed.length} videos'; END $$;\n`

  const { writeFileSync } = await import('fs')
  const { fileURLToPath } = await import('url')
  const outPath = fileURLToPath(migrationPath)
  writeFileSync(outPath, sql, 'utf-8')

  console.log(`\n✅ Migration written to: ${outPath}`)
  console.log('Review the file, then apply with: npx supabase db push')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
