<template>
  <div class="guess-grid">
    <!-- Header row -->
    <div class="grid-row header-row">
      <div class="cell cell-servant">Servant</div>
      <div class="cell">Class</div>
      <div class="cell">Rarity</div>
      <div class="cell">Gender</div>
      <div class="cell">NP Card</div>
      <div class="cell">NP Target</div>
      <div class="cell">Attribute</div>
      <div class="cell">Alignment</div>
    </div>

    <template v-for="visualIdx in maxVisualRows" :key="visualIdx - 1">
      <div
        class="grid-row"
        :class="rowClasses(visualIdx - 1)"
      >
        <!-- ── FILLED GUESS ROW ── -->
        <template v-if="store.guesses[visualIdx - 1]">
          <div class="cell cell-servant">
            <img
              :src="store.guesses[visualIdx - 1].servant.face"
              :alt="store.guesses[visualIdx - 1].servant.name"
              class="servant-face" loading="lazy"
              @error="(e) => ((e.target as HTMLImageElement).style.opacity = '0.2')"
            />
            <span class="servant-name">{{ store.guesses[visualIdx - 1].servant.name }}</span>
          </div>
          <div v-for="(col, ci) in columnDefs" :key="col.key"
            class="cell"
            :class="[resultClass(getResult(visualIdx - 1, col.key)), isRevealing(visualIdx - 1) ? 'flip' : '']"
            :style="{ '--flip-delay': (ci * 110) + 'ms' }"
          >
            <component :is="'span'" v-bind="getCellBadgeAttrs(visualIdx - 1, col.key)" class="cell-value">
              {{ getCellText(visualIdx - 1, col.key) }}
            </component>
            <span v-if="col.key === 'rarity' && getResult(visualIdx - 1, col.key) === 'partial'" class="hint-arrow">
              {{ Number(store.guesses[visualIdx - 1].results.rarity.value) < (store.todayAnswer?.rarity ?? 0) ? '▲' : '▼' }}
            </span>
            <span class="result-icon">{{ resultIcon(getResult(visualIdx - 1, col.key)) }}</span>
          </div>
        </template>

        <!-- ── PLACEHOLDER / HINT ROW ── -->
        <template v-else>
          <div class="cell cell-servant" :class="isHintRow(visualIdx - 1) ? 'hint-label-cell' : ''">
            <template v-if="isHintRow(visualIdx - 1)">
              <span class="hint-row-icon">💡</span>
              <div class="hint-label-text">
                <div class="hint-row-title">Hint Row</div>
                <div class="hint-row-sub" v-if="isHintActive(visualIdx - 1)">
                  Reveal up to {{ hintMaxReveal(visualIdx - 1) }} cell{{ hintMaxReveal(visualIdx - 1) > 1 ? 's' : '' }}
                </div>
                <div class="hint-row-sub" v-else-if="hintUsed(visualIdx - 1)">Used ✓</div>
                <div class="hint-row-sub" v-else>Locked</div>
              </div>
            </template>
            <template v-else>
              <div class="servant-face-placeholder"></div>
              <span class="placeholder-text">—</span>
            </template>
          </div>

          <!-- Hint cells (hint row) -->
          <template v-if="isHintRow(visualIdx - 1)">
            <div
              v-for="col in columnDefs"
              :key="col.key"
              class="cell hint-cell"
              :class="hintCellClass(visualIdx - 1, col.key as any)"
              @click="handleHintClick(visualIdx - 1, col.key as any)"
            >
              <template v-if="isHintRevealed(visualIdx - 1, col.key as any) && store.todayAnswer">
                <component :is="'span'" v-bind="getAnswerCellAttrs(col.key)" class="cell-value">
                  {{ getAnswerText(col.key) }}
                </component>
                <span class="hint-check">✓</span>
              </template>
              <template v-else>
                <span class="hint-dot"></span>
              </template>
            </div>
          </template>

          <!-- Normal empty cells -->
          <template v-else>
            <div v-for="col in columnDefs" :key="col.key" class="cell empty-cell">
              <span class="placeholder-dash">—</span>
            </div>
          </template>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useServantStore, HINT_ROW_CONFIG } from '../stores/servantStore'
import type { GuessResult, HintableColumn } from '../types/servant'

const store = useServantStore()
const maxVisualRows = computed(() => store.maxGuesses)

// Column definitions in display order
const columnDefs = [
  { key: 'className'  },
  { key: 'rarity'    },
  { key: 'gender'    },
  { key: 'npCard'    },
  { key: 'npTarget'  },
  { key: 'attribute' },
  { key: 'alignment' },
]

// ─── Hint row helpers ─────────────────────────────────────────────────────────
function isHintRow(idx: number) {
  return store.gameMode === 'daily' && HINT_ROW_CONFIG.some(c => c.rowIdx === idx)
}

function getHintConfig(idx: number) {
  return HINT_ROW_CONFIG.find(c => c.rowIdx === idx) ?? null
}

function isHintActive(idx: number) {
  return store.activeHintRowIdx === idx
}

function hintUsed(idx: number) {
  const set = store.revealedHints.get(idx)
  return !!set && set.size > 0
}

function hintMaxReveal(idx: number) {
  return getHintConfig(idx)?.maxReveal ?? 0
}

function isHintRevealed(idx: number, col: HintableColumn) {
  return store.revealedHints.get(idx)?.has(col) ?? false
}

function hintCellClass(idx: number, col: HintableColumn) {
  const revealed = isHintRevealed(idx, col)
  const active = isHintActive(idx)
  const canReveal = active && !revealed && !hintMaxReached(idx)
  const spent = hintUsed(idx) && !revealed
  return {
    'hint-revealed': revealed,
    'hint-clickable': canReveal,
    'hint-spent': spent,
    'hint-locked': !active && !revealed,
  }
}

function hintMaxReached(idx: number) {
  const cfg = getHintConfig(idx)
  if (!cfg) return true
  return (store.revealedHints.get(idx)?.size ?? 0) >= cfg.maxReveal
}

function handleHintClick(idx: number, col: HintableColumn) {
  if (!isHintActive(idx)) return
  if (hintMaxReached(idx)) return
  store.revealHint(idx, col)
}

// ─── Row class computation ────────────────────────────────────────────────────
function rowClasses(idx: number) {
  const filled = !!store.guesses[idx]
  const hintRow = isHintRow(idx)
  const hintActive = isHintActive(idx)
  const used = hintUsed(idx)

  return {
    'guess-row': !hintRow,
    'hint-row': hintRow,
    'hint-row-locked': hintRow && !filled && !hintActive,
    'hint-row-active': hintRow && !filled && hintActive,
    'hint-row-used': hintRow && !filled && used && !hintActive,
    'is-revealing': !hintRow && store.revealingRowId === store.guesses[idx]?.servant.id,
  }
}

function isRevealing(idx: number) {
  return store.revealingRowId === store.guesses[idx]?.servant.id
}

// ─── Result helpers ───────────────────────────────────────────────────────────
function getResult(idx: number, key: string): GuessResult {
  const row = store.guesses[idx]
  if (!row) return 'wrong'
  return (row.results as any)[key]?.result ?? 'wrong'
}

function resultClass(result: GuessResult) {
  return {
    'cell-correct': result === 'correct',
    'cell-partial': result === 'partial',
    'cell-wrong': result === 'wrong',
  }
}

function resultIcon(result: GuessResult) {
  return result === 'correct' ? '✓' : result === 'partial' ? '~' : '✗'
}

// ─── Cell content helpers ─────────────────────────────────────────────────────
function getCellText(idx: number, key: string): string {
  const row = store.guesses[idx]
  if (!row) return ''
  const val = String((row.results as any)[key]?.value ?? '')
  return formatValue(key, val)
}

function getCellBadgeAttrs(idx: number, key: string) {
  const row = store.guesses[idx]
  if (!row) return {}
  const val = String((row.results as any)[key]?.value ?? '')
  return getBadgeAttrs(key, val)
}

function getAnswerText(key: string): string {
  const a = store.todayAnswer
  if (!a) return ''
  const map: Record<string, string> = {
    className: a.className,
    rarity: String(a.rarity),
    gender: a.gender,
    npCard: a.npCard,
    npTarget: a.npTarget,
    attribute: a.attribute,
    alignment: a.alignment,
  }
  return formatValue(key, map[key] ?? '')
}

function getAnswerCellAttrs(key: string) {
  const a = store.todayAnswer
  if (!a) return {}
  const map: Record<string, string> = {
    className: a.className,
    rarity: String(a.rarity),
    gender: a.gender,
    npCard: a.npCard,
    npTarget: a.npTarget,
    attribute: a.attribute,
    alignment: a.alignment,
  }
  return getBadgeAttrs(key, map[key] ?? '')
}

function getBadgeAttrs(key: string, val: string): Record<string, string> {
  if (key === 'className') return { class: `class-badge np-${val}` }
  if (key === 'npCard') return { class: `np-badge np-${val}` }
  if (key === 'attribute') return { class: `attr-badge attr-${val}` }
  if (key === 'rarity') return { class: 'rarity-stars' }
  if (key === 'gender') return { class: 'gender-icon' }
  if (key === 'npTarget') return { class: 'np-tar-text' }
  if (key === 'alignment') return { class: 'align-text' }
  return {}
}

function formatValue(key: string, val: string): string {
  if (key === 'rarity') return '★'.repeat(Number(val))
  if (key === 'className') return formatClass(val)
  if (key === 'attribute') return formatAttr(val)
  if (key === 'gender') return formatGender(val)
  if (key === 'npCard') return val.charAt(0).toUpperCase() + val.slice(1)
  if (key === 'npTarget') return ({ aoe: 'AoE', single: 'Single', support: 'Support' } as any)[val] ?? val
  return val
}

function formatClass(cls: string): string {
  return ({ alterEgo: 'Alter Ego', moonCancer: 'Moon Cancer', loreGrandCaster: 'Grand Caster' } as any)[cls]
    ?? cls.charAt(0).toUpperCase() + cls.slice(1)
}

function formatAttr(attr: string): string {
  return ({ sky: '☀ Sky', earth: '🌿 Earth', human: '👤 Human', star: '★ Star', beast: '🔥 Beast' } as any)[attr] ?? attr
}

function formatGender(g: string): string {
  return g === 'female' ? '♀ Female' : g === 'male' ? '♂ Male' : '⚧ Unknown'
}
</script>

<style scoped>
.guess-grid {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.grid-row {
  display: grid;
  grid-template-columns: 220px repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 6px;
  min-width: 860px;
}

/* Header */
.header-row .cell {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--gold);
  font-family: var(--font-title);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  text-align: center;
}

/* Base cell */
.cell {
  background: var(--bg-card);
  border: 1px solid var(--wrong-border);
  border-radius: var(--radius-sm);
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 0.78rem;
  text-align: center;
  min-height: 72px;
  transition: background 0.3s ease, border-color 0.3s ease;
}

/* Result colors */
.cell-correct { background: var(--correct-bg); border-color: var(--correct-border); box-shadow: 0 0 10px rgba(67,160,71,0.2); }
.cell-partial  { background: var(--partial-bg); border-color: var(--partial-border); box-shadow: 0 0 10px rgba(251,140,0,0.2); }
.cell-wrong    { background: var(--wrong); border-color: var(--wrong-border); }

/* Flip animation */
.cell.flip {
  animation: flipReveal 0.7s ease var(--flip-delay, 0ms) both;
}

@keyframes flipReveal {
  0%   { transform: rotateX(0deg); }
  40%  { transform: rotateX(-90deg); opacity: 0.4; }
  60%  { transform: rotateX(-90deg); opacity: 0.4; }
  100% { transform: rotateX(0deg); }
}

.result-icon {
  font-size: 0.65rem;
  font-weight: 700;
  opacity: 0.7;
}
.cell-correct .result-icon { color: var(--correct-border); }
.cell-partial .result-icon { color: var(--partial-border); }
.cell-wrong .result-icon   { color: var(--text-muted); }

/* Servant cell */
.cell-servant {
  flex-direction: row !important;
  justify-content: flex-start !important;
  gap: 10px;
  text-align: left !important;
  padding: 8px 12px;
}

.servant-face {
  width: 44px; height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border);
  background: var(--wrong);
  flex-shrink: 0;
}

.servant-face-placeholder {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: var(--wrong);
  border: 2px solid var(--wrong-border);
  flex-shrink: 0;
}

.servant-name {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.3;
}

.placeholder-text, .placeholder-dash { color: var(--text-muted); font-size: 0.8rem; }
.hint-arrow { color: var(--partial-border); font-size: 0.8rem; font-weight: 700; }

/* Badges */
.class-badge  { font-size: 0.7rem; padding: 3px 8px; border-radius: 20px; font-weight: 500; }
.rarity-stars { color: var(--gold); font-size: 0.75rem; letter-spacing: -1px; }
.attr-badge   { font-size: 0.72rem; font-weight: 500; white-space: nowrap; }
.gender-icon  { font-size: 0.78rem; }
.align-text   { font-size: 0.7rem; text-align: center; color: var(--text-secondary); line-height: 1.3; }
.np-tar-text  { font-size: 0.72rem; font-weight: 600; color: var(--text-primary); }
.np-badge { font-size: 0.72rem; font-weight: 500; padding: 3px 8px; border-radius: 4px; }

.attr-sky   { color: #64b5f6; }
.attr-earth { color: #a5d6a7; }
.attr-human { color: #ce93d8; }
.attr-star  { color: var(--gold); }
.attr-beast { color: #ef9a9a; }

.np-buster { background: rgba(220,53,69,.2); color: #ff5252; border: 1px solid rgba(255,82,82,.4); }
.np-arts   { background: rgba(13,110,253,.2); color: #64b5f6; border: 1px solid rgba(100,181,246,.4); }
.np-quick  { background: rgba(25,135,84,.2);  color: #81c784; border: 1px solid rgba(129,199,132,.4); }

/* Row locked (unlimited hard mode: beyond maxGuesses cap) */
.row-over-limit {
  opacity: 0.2;
  pointer-events: none;
  filter: grayscale(1);
}

/* ========== HINT ROWS ==========*/
.hint-row {
  margin-bottom: 6px;
}

/* Locked: greyed out, cannot interact */
.hint-row-locked {
  opacity: 0.38;
  filter: grayscale(0.8);
}

/* Active: user has reached this row, can reveal */
.hint-row-active {
  opacity: 1;
  animation: hintPulse 1.8s ease-in-out 2;
}

@keyframes hintPulse {
  0%, 100% { filter: drop-shadow(0 0 0px transparent); }
  50%       { filter: drop-shadow(0 0 8px rgba(201,168,76,0.45)); }
}

/* Used: hint was clicked but row not guessed yet */
.hint-row-used { opacity: 0.75; }

/* Label cell in hint row */
.hint-label-cell {
  flex-direction: row !important;
  justify-content: flex-start !important;
  align-items: center !important;
  gap: 10px;
  background: rgba(201, 168, 76, 0.04);
  border: 1px dashed rgba(201, 168, 76, 0.3) !important;
}

.hint-label-text { display: flex; flex-direction: column; gap: 2px; }

.hint-row-icon { font-size: 1.3rem; line-height: 1; }
.hint-row-title  { font-family: var(--font-title); font-size: 0.7rem; font-weight: 700; color: var(--gold); letter-spacing: 1px; }
.hint-row-sub    { font-size: 0.58rem; color: var(--text-muted); }

/* Normal hint cell (locked dim dot) */
.hint-cell {
  cursor: default;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.hint-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
}

/* Clickable when active */
.hint-cell.hint-clickable {
  cursor: pointer;
  background: rgba(201, 168, 76, 0.06);
  border: 1px dashed rgba(201, 168, 76, 0.45);
  transition: all 0.2s ease;
}
.hint-cell.hint-clickable .hint-dot {
  background: rgba(201, 168, 76, 0.5);
  box-shadow: 0 0 4px rgba(201, 168, 76, 0.4);
}
.hint-cell.hint-clickable:hover {
  background: rgba(201, 168, 76, 0.14);
  border-color: var(--gold);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(201, 168, 76, 0.2);
}

/* Revealed */
.hint-cell.hint-revealed {
  background: rgba(67, 160, 71, 0.1);
  border: 1px solid var(--correct-border);
  cursor: default;
  animation: revealPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes revealPop {
  from { transform: scale(0.85); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

/* Other cells when one is already revealed (max reached) */
.hint-cell.hint-spent {
  opacity: 0.25;
  cursor: not-allowed;
}

.hint-check { font-size: 0.65rem; color: var(--correct-border); font-weight: 700; }

/* Mobile */
@media (max-width: 768px) {
  .grid-row {
    grid-template-columns: 130px repeat(7, minmax(64px, 1fr));
    min-width: 630px;
  }
  .header-row .cell { font-size: 0.55rem; padding: 6px 4px; }
  .cell { padding: 6px 4px; font-size: 0.72rem; }
  .cell-servant {
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
  }
  .hint-label-cell { flex-direction: column !important; align-items: center !important; }
  .servant-name { font-size: 0.65rem; }
  .hint-row-sub { display: none; }
}
</style>
