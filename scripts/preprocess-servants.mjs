/**
 * FGO Wordle - Servant Data Preprocessor
 * 
 * Reads the downloaded nice_servant_lang_en.json file locally,
 * extracts only what we need (name, aliases, NP card/type, class, etc.),
 * and saves a slim JSON to public/fgo-servants.json.
 * 
 * Run: node scripts/preprocess-servants.mjs
 */

import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_PATH_JP = resolve(__dirname, '../public/fgo-servants-jp.json')
const OUT_PATH_NA = resolve(__dirname, '../public/fgo-servants-na.json')

const API_URL_JP = 'https://api.atlasacademy.io/export/JP/nice_servant_lang_en.json'
const API_URL_NA = 'https://api.atlasacademy.io/export/NA/nice_servant.json'

// Servant types to include
const PLAYABLE_TYPES = new Set(['normal', 'heroine'])
// Classes to exclude (story-only, beasts, etc.)
const EXCLUDED_CLASSES = new Set([
  'beastI', 'beastII', 'beastIII', 'beastIIIL', 'beastIV', 'beastV',
  'beastVI', 'beastUnknown', 'loreGrandCaster', 'ushiwakamaru',
])

// Trait IDs
const TRAIT_MALE = 1
const TRAIT_FEMALE = 2
const TRAIT_ALIGNMENT_LAWFUL = 300
const TRAIT_ALIGNMENT_CHAOTIC = 301
const TRAIT_ALIGNMENT_NEUTRAL = 302
const TRAIT_ALIGNMENT_GOOD = 303
const TRAIT_ALIGNMENT_EVIL = 304
const TRAIT_ALIGNMENT_BALANCED = 305
const TRAIT_ALIGNMENT_MADNESS = 306
const TRAIT_ALIGNMENT_SUMMER = 308

function getGender(traits) {
  const ids = new Set(traits.map(t => t.id))
  if (ids.has(TRAIT_FEMALE)) return 'female'
  if (ids.has(TRAIT_MALE)) return 'male'
  return 'unknown'
}

function getAlignment(traits) {
  const ids = new Set(traits.map(t => t.id))
  let order = ''
  let moral = ''
  if (ids.has(TRAIT_ALIGNMENT_LAWFUL)) order = 'Lawful'
  else if (ids.has(TRAIT_ALIGNMENT_CHAOTIC)) order = 'Chaotic'
  else if (ids.has(TRAIT_ALIGNMENT_NEUTRAL)) order = 'Neutral'

  if (ids.has(TRAIT_ALIGNMENT_GOOD)) moral = 'Good'
  else if (ids.has(TRAIT_ALIGNMENT_EVIL)) moral = 'Evil'
  else if (ids.has(TRAIT_ALIGNMENT_BALANCED)) moral = 'Balanced'
  else if (ids.has(TRAIT_ALIGNMENT_MADNESS)) moral = 'Insane'
  else if (ids.has(TRAIT_ALIGNMENT_SUMMER)) moral = 'Summer'

  if (!order && !moral) return 'Unknown'
  return `${order} ${moral}`.trim()
}

function getNpInfo(servant) {
  const nps = servant.noblePhantasms
  if (!nps || nps.length === 0) {
    return { npCard: 'buster', npTarget: 'support' }
  }

  // Get the highest priority (last) NP
  let np
  // Prioritize active (not-story/passive) NP if possible
  const activeNps = nps.filter(n => n.id !== 0) 
  if (activeNps.length > 0) {
    np = activeNps[activeNps.length - 1]
  } else {
    np = nps[nps.length - 1]
  }

  let npCard = 'buster'
  let npTarget = 'support'

  if (np.individuality) {
    const indv = new Set(np.individuality.map(t => t.id))
    
    // Card Types
    if (indv.has(4001)) npCard = 'arts'
    else if (indv.has(4002)) npCard = 'buster'
    else if (indv.has(4003)) npCard = 'quick'
    
    // Target Types
    if (indv.has(4101)) npTarget = 'aoe'
    else if (indv.has(4102)) npTarget = 'single'
  }

  return { npCard, npTarget }
}

function getAliases(servant) {
  const aliases = new Set()

  // Add ruby (furigana / alt reading) if it exists
  if (servant.ruby && servant.ruby !== servant.name) {
    aliases.add(servant.ruby)
  }

  // Add battleName if different
  if (servant.battleName && servant.battleName !== servant.name) {
    aliases.add(servant.battleName)
  }

  // Add ascension/costume name overrides
  const overwriteName = servant.ascensionAdd?.overWriteServantName
  if (overwriteName) {
    for (const stageNames of [overwriteName.ascension ?? {}, overwriteName.costume ?? {}]) {
      for (const stageName of Object.values(stageNames)) {
        if (stageName && stageName !== servant.name) aliases.add(stageName)
      }
    }
  }

  return [...aliases].filter(Boolean)
}

async function processRegion(url, outPath, regionName) {
  console.log(`\n📡 Fetching ${regionName} from Atlas API: ${url}...`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  const raw = await res.json()
  console.log(`✅ Loaded ${raw.length} raw entries for ${regionName}`)

  const servants = raw
    .filter(s =>
      PLAYABLE_TYPES.has(s.type) &&
      !EXCLUDED_CLASSES.has(s.className) &&
      s.rarity > 0 &&
      s.collectionNo > 0
    )
    .map(s => {
      const { npCard, npTarget } = getNpInfo(s)

      return {
        id: s.id,
        collectionNo: s.collectionNo,
        name: s.name,
        className: s.className,
        rarity: s.rarity,
        attribute: s.attribute,
        gender: getGender(s.traits),
        alignment: getAlignment(s.traits),
        face: s.extraAssets?.faces?.ascension?.['1'] ?? s.face ?? '',
        npCard,       // "buster" | "quick" | "arts"
        npTarget,     // "aoe" | "single" | "support"
        aliases: getAliases(s),
      }
    })
    .sort((a, b) => a.collectionNo - b.collectionNo)

  const json = JSON.stringify(servants)
  writeFileSync(outPath, json, 'utf-8')

  const sizeKB = (json.length / 1024).toFixed(1)
  console.log(`✅ Processed ${servants.length} playable servants for ${regionName}`)
  console.log(`💾 Saved to: ${outPath} (${sizeKB} KB)`)
}

async function main() {
  try {
    console.log('⚗ FGO Wordle Data Preprocessor')
    await processRegion(API_URL_JP, OUT_PATH_JP, 'JP')
    await processRegion(API_URL_NA, OUT_PATH_NA, 'NA')
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

main()
