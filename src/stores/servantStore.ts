import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SlimServant, GuessRow, GuessResult, Difficulty, HintableColumn } from '../types/servant'

const SERVANTS_URL = import.meta.env.BASE_URL + 'fgo-servants.json'

// Hint rows at 0-indexed positions 4 and 7
// User can reveal up to maxReveal cells before submitting their guess on that row
export const HINT_ROW_CONFIG = [
  { rowIdx: 4, maxReveal: 1 },
  { rowIdx: 7, maxReveal: 3 },
] as const

function compareGuess(guessed: SlimServant, answer: SlimServant): GuessRow['results'] {
  const rarityDiff = Math.abs(guessed.rarity - answer.rarity)
  function check(a: unknown, b: unknown, partial?: () => GuessResult): GuessResult {
    if (a === b) return 'correct'
    return partial ? partial() : 'wrong'
  }
  return {
    name:      { value: guessed.name,      result: check(guessed.name, answer.name) },
    className: { value: guessed.className, result: check(guessed.className, answer.className) },
    rarity: {
      value: guessed.rarity,
      result: guessed.rarity === answer.rarity ? 'correct' : rarityDiff === 1 ? 'partial' : 'wrong',
    },
    attribute: { value: guessed.attribute, result: check(guessed.attribute, answer.attribute) },
    gender:    { value: guessed.gender,    result: check(guessed.gender, answer.gender) },
    alignment: { value: guessed.alignment, result: check(guessed.alignment, answer.alignment) },
    npCard:    { value: guessed.npCard,    result: check(guessed.npCard, answer.npCard) },
    npTarget:  { value: guessed.npTarget,  result: check(guessed.npTarget, answer.npTarget) },
  }
}

export const useServantStore = defineStore('servant', () => {
  const allServants = ref<SlimServant[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const todayAnswer = ref<SlimServant | null>(null)
  const guesses = ref<GuessRow[]>([])
  const gameOver = ref(false)
  const won = ref(false)

  type GameMode = 'daily' | 'unlimited'
  const gameMode = ref<GameMode>('daily')
  const difficulty = ref<Difficulty>('normal')

  const maxGuesses = computed(() => {
    if (gameMode.value === 'daily') return 8
    const map: Record<Difficulty, number> = { easy: 12, normal: 8, hard: 5 }
    return map[difficulty.value]
  })

  // key = rowIdx (4 or 7), value = Set of revealed columns for that hint row
  const revealedHints = ref<Map<number, Set<HintableColumn>>>(
    new Map(HINT_ROW_CONFIG.map(c => [c.rowIdx, new Set<HintableColumn>()]))
  )

  // Which hint row is currently "active"
  const activeHintRowIdx = computed<number | null>(() => {
    if (gameMode.value !== 'daily' || gameOver.value) return null
    for (const cfg of HINT_ROW_CONFIG) {
      if (guesses.value.length === cfg.rowIdx) return cfg.rowIdx
    }
    return null
  })

  // Animation
  const revealingRowId = ref<number | null>(null)

  const searchQuery = ref('')

  const filteredServants = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return []
    const guessedIds = new Set(guesses.value.map(g => g.servant.id))
    return allServants.value
      .filter(s => {
        if (guessedIds.has(s.id)) return false
        if (s.name.toLowerCase().includes(q)) return true
        if (s.className.toLowerCase().includes(q)) return true
        if (s.aliases.some(a => a.toLowerCase().includes(q))) return true
        return false
      })
      .slice(0, 12)
  })

  async function fetchServants() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(SERVANTS_URL)
      if (!res.ok) throw new Error(`Failed to load servant data (${res.status})`)
      allServants.value = await res.json()
      startNewGame()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  function getDateString() {
    const t = new Date()
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
  }

  function startNewGame(mode?: GameMode) {
    if (mode) gameMode.value = mode
    guesses.value = []
    gameOver.value = false
    won.value = false
    revealingRowId.value = null
    revealedHints.value = new Map(HINT_ROW_CONFIG.map(c => [c.rowIdx, new Set<HintableColumn>()]))

    if (gameMode.value === 'daily') {
      const dateStr = getDateString()
      const saved = localStorage.getItem('fgo-wordle-state')
      if (saved) {
        try {
          const state = JSON.parse(saved)
          if (state.date === dateStr) {
            const savedAnswer = allServants.value.find(s => s.id === state.answerId)
            if (savedAnswer) {
              todayAnswer.value = savedAnswer
              guesses.value = state.guesses
              gameOver.value = state.gameOver
              won.value = state.won
              // Restore hint state: stored as [[rowIdx, [col,col,...]], ...]
              if (state.revealedHints) {
                const restored = new Map<number, Set<HintableColumn>>()
                for (const [k, v] of state.revealedHints) {
                  restored.set(k, new Set(v))
                }
                revealedHints.value = restored
              }
              return
            }
          }
        } catch { /* ignore */ }
      }
      const [y, m, d] = dateStr.split('-').map(Number)
      const seed = y * 10000 + m * 100 + d
      todayAnswer.value = allServants.value[seed % allServants.value.length]
    } else {
      todayAnswer.value = allServants.value[Math.floor(Math.random() * allServants.value.length)]
    }
  }

  function playAgain() { startNewGame('unlimited') }

  function setDifficulty(d: Difficulty) {
    difficulty.value = d
    startNewGame('unlimited')
  }

  /**
   * Reveal a hint cell for the hint row at the given rowIdx.
   * Only works when that row is the active hint row and reveals < maxReveal.
   */
  function revealHint(rowIdx: number, column: HintableColumn) {
    if (gameMode.value !== 'daily') return
    if (activeHintRowIdx.value !== rowIdx) return
    const cfg = HINT_ROW_CONFIG.find(c => c.rowIdx === rowIdx)
    if (!cfg) return
    const set = revealedHints.value.get(rowIdx) ?? new Set<HintableColumn>()
    if (set.size >= cfg.maxReveal) return
    const newSet = new Set(set)
    newSet.add(column)
    revealedHints.value = new Map(revealedHints.value).set(rowIdx, newSet)
    saveState()
  }

  function submitGuess(servant: SlimServant) {
    if (gameOver.value || !todayAnswer.value) return
    if (guesses.value.some(g => g.servant.id === servant.id)) return

    const results = compareGuess(servant, todayAnswer.value)
    guesses.value.push({ servant, results })
    searchQuery.value = ''

    revealingRowId.value = servant.id
    setTimeout(() => { revealingRowId.value = null }, 900)

    if (servant.id === todayAnswer.value.id) {
      won.value = true
      gameOver.value = true
    } else if (guesses.value.length >= maxGuesses.value) {
      gameOver.value = true
    }

    if (gameMode.value === 'daily') saveState()
  }

  function saveState() {
    // Serialize Map<number, Set<HintableColumn>> as [[number, string[]], ...]
    const serializedHints = [...revealedHints.value.entries()].map(([k, v]) => [k, [...v]])
    localStorage.setItem('fgo-wordle-state', JSON.stringify({
      date: getDateString(),
      answerId: todayAnswer.value?.id,
      guesses: guesses.value,
      gameOver: gameOver.value,
      won: won.value,
      revealedHints: serializedHints,
    }))
  }

  return {
    allServants, loading, error,
    todayAnswer, guesses, gameOver, won,
    maxGuesses, gameMode, difficulty,
    revealedHints, activeHintRowIdx, revealingRowId,
    searchQuery, filteredServants,
    fetchServants, submitGuess, startNewGame, playAgain, setDifficulty, revealHint,
  }
})
