// Phonics data: letter → { sound, word, emoji }

export type PhonicsEntry = {
  sound: string;   // phonetic description / IPA approximation spoken via TTS
  word: string;    // example word
  emoji: string;   // visual cue emoji
};

export const PHONICS: Record<string, PhonicsEntry> = {
  A: { sound: "Ah", word: "Apple", emoji: "🍎" },
  B: { sound: "Buh", word: "Ball", emoji: "⚽" },
  C: { sound: "Kuh", word: "Cat", emoji: "🐱" },
  D: { sound: "Duh", word: "Dog", emoji: "🐶" },
  E: { sound: "Eh", word: "Egg", emoji: "🥚" },
  F: { sound: "Fff", word: "Fish", emoji: "🐟" },
  G: { sound: "Guh", word: "Grapes", emoji: "🍇" },
  H: { sound: "Huh", word: "Hat", emoji: "🎩" },
  I: { sound: "Ih", word: "Ice cream", emoji: "🍦" },
  J: { sound: "Juh", word: "Juice", emoji: "🧃" },
  K: { sound: "Kuh", word: "Kite", emoji: "🪁" },
  L: { sound: "Lll", word: "Lion", emoji: "🦁" },
  M: { sound: "Mmm", word: "Moon", emoji: "🌙" },
  N: { sound: "Nnn", word: "Nest", emoji: "🪺" },
  O: { sound: "Oh", word: "Orange", emoji: "🍊" },
  P: { sound: "Puh", word: "Penguin", emoji: "🐧" },
  Q: { sound: "Kwuh", word: "Queen", emoji: "👑" },
  R: { sound: "Rrr", word: "Rainbow", emoji: "🌈" },
  S: { sound: "Sss", word: "Sun", emoji: "☀️" },
  T: { sound: "Tuh", word: "Tiger", emoji: "🐯" },
  U: { sound: "Uh", word: "Umbrella", emoji: "☂️" },
  V: { sound: "Vvv", word: "Violin", emoji: "🎻" },
  W: { sound: "Wuh", word: "Whale", emoji: "🐳" },
  X: { sound: "Ks", word: "X-ray", emoji: "🩻" },
  Y: { sound: "Yuh", word: "Yo-yo", emoji: "🪀" },
  Z: { sound: "Zzz", word: "Zebra", emoji: "🦓" },
};

/** Letter button colors — cycles through 7 warm palette colors */
const PALETTE = [
  "#FCA5A5", // red-300
  "#FDBA74", // orange-300
  "#FDE68A", // yellow-200
  "#86EFAC", // green-300
  "#67E8F9", // cyan-300
  "#A5B4FC", // indigo-300
  "#F9A8D4", // pink-300
];

export function getLetterColor(letter: string): string {
  const idx = letter.toUpperCase().charCodeAt(0) - 65;
  return PALETTE[idx % PALETTE.length];
}

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
