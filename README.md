# FGOdle (Fate/Grand Order Wordle)

A Wordle-like guessing game specifically tailored for Fate/Grand Order (FGO) servants! Test your knowledge by guessing today's servant or playing infinitely in Unlimited Mode.

## 🌟 Features

- **Daily Mode** — A new servant every day, shared globally. Your progress and streak are saved locally.
- **Unlimited Mode** — Guess randomly selected servants endlessly with selectable difficulty (Easy / Normal / Hard).
- **Hint Rows** *(Daily only)* — Rows 5 and 8 are special hint rows. Row 5 lets you peek at 1 cell; row 8 lets you reveal up to 3 cells — giving you a fighting chance on your toughest guesses.
- **Reveal Animation** — Every submitted guess triggers a smooth card-flip animation column by column, just like the classic Wordle.
- **Detailed Clues** — Comprehensive visual hints: Rarity, Class, NP Card, NP Type, Attribute, Alignment, and Gender.
- **Share Your Result** — Generate a shareable image of your results, complete with a QR code linking back to FGOdle.
- **Battle Records** — Track your win rate, current streak, best streak, and guess distribution over time. Accessible via the chart icon in the navbar or from the result screen.
- **Class Filter Chips** — Quickly narrow your servant search by class (Saber, Archer, Lancer, and more) using the scrollable chip bar above the search input.
- **Yesterday's Servant** — Check what servant was featured the previous day inside Battle Records.
- **Light / Dark Mode** — Toggle between a dark mode and a warm light mode using the moon/sun icon in the navbar. Preference is saved locally.
- **Always Up to Date** — Servant data is synchronized automatically from the JP server using GitHub Actions and the Atlas Academy API.
- **Mobile Responsive** — Fully scrollable grid works on any screen size.

## 🎮 Game Modes

| Mode | Guesses | Description |
|------|---------|-------------|
| **Daily** | 8 | A new servant every day, shared globally. Includes Hint Rows at rows 5 and 8. |
| **Unlimited — Easy** | 12 | Relaxed challenge with random servants |
| **Unlimited — Normal** | 8 | Standard challenge |
| **Unlimited — Hard** | 5 | Test your knowledge to the limit |

## 🧭 How to Play

1. The game picks a mystery FGO servant each day (or randomly in Unlimited mode).
2. Type in the search box and select a servant to make your guess.
3. Use the **Class Filter Chips** above the search box to narrow results by class.
4. After each guess, all 7 attribute cells reveal their results:
   - 🟩 **Green** — Correct! This attribute matches.
   - 🟧 **Orange** — Close! (Rarity only, within ±1 star)
   - ⬛ **Grey** — Wrong. This attribute doesn't match.
5. In **Daily Mode**, rows 5 and 8 are special **Hint Rows** — tap a cell to reveal the answer's exact value for that column before guessing.
6. After the game ends, view your **Battle Records** (chart icon) to see win rate, streaks, and guess distribution.

## 🚀 Technologies

- **Vue 3** (Composition API, `<script setup>`)
- **Vite** (Build Tool)
- **TypeScript**
- **Pinia** (State Management)
- **GitHub Actions** (CI/CD, Automated Data Preprocessing)
- **html2canvas & qrcode.vue** (For sharing results)

## 🛠️ Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Run the preprocessor to fetch the newest data from Atlas API:
   ```bash
   npm run preprocess
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## 📜 Credits

- **Data Source**: [Atlas Academy API](https://api.atlasacademy.io/) — Provides the extensive FGO databases.
- **Game Concept**: Inspired by the original Wordle and various fandom iterations.
- **Animations**: GIFs provided via [Tenor](https://tenor.com/).
- **Original Developer**: [vermilion10](https://github.com/vermilion10)
