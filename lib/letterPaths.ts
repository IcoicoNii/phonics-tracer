// Letter path data for all 26 uppercase + 26 lowercase letters.
// Coordinate space: 300 × 360 px (scales via CSS).
// Each checkpoint is (x, y) within that space.
// hitRadius: how close the pointer must be to "hit" a checkpoint (px).
// resetThreshold: how far off-path before a soft-reset triggers (px).

export type Checkpoint = { x: number; y: number };
export type Stroke = {
  id: number;
  label: string;
  checkpoints: Checkpoint[];
  hitRadius: number;
  resetThreshold: number;
};
export type LetterPath = {
  letter: string;
  case: "uppercase" | "lowercase";
  strokes: Stroke[];
};

// ─── UPPERCASE ───────────────────────────────────────────────────────────────

const A_upper: LetterPath = {
  letter: "A", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Left leg",
      checkpoints: [
        { x: 150, y: 30 }, { x: 115, y: 100 }, { x: 80, y: 175 },
        { x: 55, y: 240 }, { x: 30, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Right leg",
      checkpoints: [
        { x: 150, y: 30 }, { x: 185, y: 100 }, { x: 220, y: 175 },
        { x: 245, y: 240 }, { x: 270, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 3, label: "Crossbar",
      checkpoints: [
        { x: 80, y: 185 }, { x: 115, y: 185 }, { x: 150, y: 185 },
        { x: 185, y: 185 }, { x: 220, y: 185 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const B_upper: LetterPath = {
  letter: "B", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Spine",
      checkpoints: [
        { x: 70, y: 30 }, { x: 70, y: 100 }, { x: 70, y: 170 },
        { x: 70, y: 240 }, { x: 70, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Top bump",
      checkpoints: [
        { x: 70, y: 30 }, { x: 140, y: 40 }, { x: 200, y: 70 },
        { x: 210, y: 110 }, { x: 190, y: 150 }, { x: 130, y: 165 }, { x: 70, y: 165 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 3, label: "Bottom bump",
      checkpoints: [
        { x: 70, y: 165 }, { x: 140, y: 165 }, { x: 210, y: 185 },
        { x: 230, y: 230 }, { x: 205, y: 275 }, { x: 140, y: 305 }, { x: 70, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const C_upper: LetterPath = {
  letter: "C", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Arc",
      checkpoints: [
        { x: 230, y: 75 }, { x: 195, y: 42 }, { x: 150, y: 28 },
        { x: 100, y: 38 }, { x: 62, y: 75 }, { x: 45, y: 130 },
        { x: 45, y: 185 }, { x: 55, y: 240 }, { x: 80, y: 280 },
        { x: 118, y: 308 }, { x: 162, y: 315 }, { x: 205, y: 302 },
        { x: 235, y: 275 },
      ],
      hitRadius: 34, resetThreshold: 50,
    },
  ],
};

const D_upper: LetterPath = {
  letter: "D", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Spine",
      checkpoints: [
        { x: 70, y: 30 }, { x: 70, y: 110 }, { x: 70, y: 190 },
        { x: 70, y: 270 }, { x: 70, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Bump",
      checkpoints: [
        { x: 70, y: 30 }, { x: 140, y: 35 }, { x: 205, y: 70 },
        { x: 235, y: 130 }, { x: 240, y: 185 }, { x: 225, y: 245 },
        { x: 195, y: 285 }, { x: 145, y: 308 }, { x: 70, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const E_upper: LetterPath = {
  letter: "E", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Spine",
      checkpoints: [
        { x: 70, y: 30 }, { x: 70, y: 110 }, { x: 70, y: 190 },
        { x: 70, y: 270 }, { x: 70, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Top bar",
      checkpoints: [
        { x: 70, y: 30 }, { x: 130, y: 30 }, { x: 200, y: 30 }, { x: 240, y: 30 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 3, label: "Middle bar",
      checkpoints: [
        { x: 70, y: 170 }, { x: 130, y: 170 }, { x: 190, y: 170 }, { x: 215, y: 170 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 4, label: "Bottom bar",
      checkpoints: [
        { x: 70, y: 310 }, { x: 130, y: 310 }, { x: 200, y: 310 }, { x: 240, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const F_upper: LetterPath = {
  letter: "F", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Spine",
      checkpoints: [
        { x: 70, y: 30 }, { x: 70, y: 110 }, { x: 70, y: 190 },
        { x: 70, y: 270 }, { x: 70, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Top bar",
      checkpoints: [
        { x: 70, y: 30 }, { x: 135, y: 30 }, { x: 200, y: 30 }, { x: 240, y: 30 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 3, label: "Middle bar",
      checkpoints: [
        { x: 70, y: 170 }, { x: 135, y: 170 }, { x: 195, y: 170 }, { x: 215, y: 170 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const G_upper: LetterPath = {
  letter: "G", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Arc + shelf",
      checkpoints: [
        { x: 230, y: 75 }, { x: 195, y: 42 }, { x: 150, y: 28 },
        { x: 100, y: 38 }, { x: 62, y: 75 }, { x: 45, y: 130 },
        { x: 45, y: 185 }, { x: 55, y: 240 }, { x: 80, y: 280 },
        { x: 118, y: 308 }, { x: 162, y: 315 }, { x: 205, y: 302 },
        { x: 235, y: 270 }, { x: 245, y: 230 }, { x: 245, y: 185 },
        { x: 185, y: 185 }, { x: 150, y: 185 },
      ],
      hitRadius: 34, resetThreshold: 50,
    },
  ],
};

const H_upper: LetterPath = {
  letter: "H", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Left leg",
      checkpoints: [
        { x: 60, y: 30 }, { x: 60, y: 110 }, { x: 60, y: 190 },
        { x: 60, y: 270 }, { x: 60, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Crossbar",
      checkpoints: [
        { x: 60, y: 170 }, { x: 110, y: 170 }, { x: 150, y: 170 },
        { x: 190, y: 170 }, { x: 240, y: 170 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 3, label: "Right leg",
      checkpoints: [
        { x: 240, y: 30 }, { x: 240, y: 110 }, { x: 240, y: 190 },
        { x: 240, y: 270 }, { x: 240, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const I_upper: LetterPath = {
  letter: "I", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Top bar",
      checkpoints: [
        { x: 80, y: 30 }, { x: 120, y: 30 }, { x: 150, y: 30 },
        { x: 180, y: 30 }, { x: 220, y: 30 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Stem",
      checkpoints: [
        { x: 150, y: 30 }, { x: 150, y: 110 }, { x: 150, y: 190 },
        { x: 150, y: 270 }, { x: 150, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 3, label: "Bottom bar",
      checkpoints: [
        { x: 80, y: 310 }, { x: 120, y: 310 }, { x: 150, y: 310 },
        { x: 180, y: 310 }, { x: 220, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const J_upper: LetterPath = {
  letter: "J", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Top bar",
      checkpoints: [
        { x: 100, y: 30 }, { x: 150, y: 30 }, { x: 200, y: 30 }, { x: 230, y: 30 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Hook",
      checkpoints: [
        { x: 195, y: 30 }, { x: 195, y: 110 }, { x: 195, y: 200 },
        { x: 195, y: 260 }, { x: 180, y: 295 }, { x: 150, y: 315 },
        { x: 110, y: 312 }, { x: 80, y: 290 }, { x: 70, y: 265 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const K_upper: LetterPath = {
  letter: "K", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Spine",
      checkpoints: [
        { x: 65, y: 30 }, { x: 65, y: 110 }, { x: 65, y: 190 },
        { x: 65, y: 270 }, { x: 65, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Upper diagonal",
      checkpoints: [
        { x: 240, y: 30 }, { x: 200, y: 75 }, { x: 160, y: 120 },
        { x: 130, y: 155 }, { x: 65, y: 175 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 3, label: "Lower diagonal",
      checkpoints: [
        { x: 120, y: 175 }, { x: 155, y: 215 }, { x: 190, y: 255 },
        { x: 220, y: 290 }, { x: 245, y: 315 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const L_upper: LetterPath = {
  letter: "L", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Spine",
      checkpoints: [
        { x: 75, y: 30 }, { x: 75, y: 110 }, { x: 75, y: 190 },
        { x: 75, y: 270 }, { x: 75, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Base",
      checkpoints: [
        { x: 75, y: 310 }, { x: 130, y: 310 }, { x: 185, y: 310 },
        { x: 235, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const M_upper: LetterPath = {
  letter: "M", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Left leg",
      checkpoints: [
        { x: 40, y: 310 }, { x: 40, y: 220 }, { x: 40, y: 130 },
        { x: 40, y: 60 }, { x: 40, y: 30 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Left diagonal down",
      checkpoints: [
        { x: 40, y: 30 }, { x: 80, y: 90 }, { x: 110, y: 145 },
        { x: 140, y: 180 }, { x: 150, y: 195 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 3, label: "Right diagonal up",
      checkpoints: [
        { x: 150, y: 195 }, { x: 170, y: 155 }, { x: 200, y: 110 },
        { x: 230, y: 65 }, { x: 260, y: 30 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 4, label: "Right leg",
      checkpoints: [
        { x: 260, y: 30 }, { x: 260, y: 110 }, { x: 260, y: 190 },
        { x: 260, y: 270 }, { x: 260, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const N_upper: LetterPath = {
  letter: "N", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Left leg",
      checkpoints: [
        { x: 55, y: 310 }, { x: 55, y: 225 }, { x: 55, y: 145 },
        { x: 55, y: 70 }, { x: 55, y: 30 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Diagonal",
      checkpoints: [
        { x: 55, y: 30 }, { x: 100, y: 95 }, { x: 145, y: 158 },
        { x: 195, y: 230 }, { x: 245, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 3, label: "Right leg",
      checkpoints: [
        { x: 245, y: 310 }, { x: 245, y: 225 }, { x: 245, y: 145 },
        { x: 245, y: 70 }, { x: 245, y: 30 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const O_upper: LetterPath = {
  letter: "O", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Circle",
      checkpoints: [
        { x: 150, y: 28 }, { x: 200, y: 38 }, { x: 235, y: 75 },
        { x: 248, y: 130 }, { x: 248, y: 185 }, { x: 235, y: 240 },
        { x: 200, y: 278 }, { x: 150, y: 310 }, { x: 100, y: 302 },
        { x: 62, y: 268 }, { x: 45, y: 225 }, { x: 43, y: 170 },
        { x: 50, y: 115 }, { x: 72, y: 68 }, { x: 112, y: 38 },
        { x: 150, y: 28 },
      ],
      hitRadius: 34, resetThreshold: 50,
    },
  ],
};

const P_upper: LetterPath = {
  letter: "P", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Spine",
      checkpoints: [
        { x: 65, y: 30 }, { x: 65, y: 110 }, { x: 65, y: 190 },
        { x: 65, y: 270 }, { x: 65, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Bump",
      checkpoints: [
        { x: 65, y: 30 }, { x: 140, y: 35 }, { x: 210, y: 65 },
        { x: 230, y: 110 }, { x: 215, y: 155 }, { x: 160, y: 180 },
        { x: 95, y: 180 }, { x: 65, y: 180 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const Q_upper: LetterPath = {
  letter: "Q", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Circle",
      checkpoints: [
        { x: 150, y: 28 }, { x: 200, y: 38 }, { x: 235, y: 75 },
        { x: 248, y: 130 }, { x: 248, y: 185 }, { x: 235, y: 240 },
        { x: 200, y: 278 }, { x: 150, y: 310 }, { x: 100, y: 302 },
        { x: 62, y: 268 }, { x: 45, y: 225 }, { x: 43, y: 170 },
        { x: 50, y: 115 }, { x: 72, y: 68 }, { x: 112, y: 38 },
        { x: 150, y: 28 },
      ],
      hitRadius: 34, resetThreshold: 50,
    },
    {
      id: 2, label: "Tail",
      checkpoints: [
        { x: 190, y: 255 }, { x: 220, y: 285 }, { x: 250, y: 318 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const R_upper: LetterPath = {
  letter: "R", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Spine",
      checkpoints: [
        { x: 65, y: 30 }, { x: 65, y: 110 }, { x: 65, y: 190 },
        { x: 65, y: 270 }, { x: 65, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Bump",
      checkpoints: [
        { x: 65, y: 30 }, { x: 140, y: 35 }, { x: 210, y: 65 },
        { x: 230, y: 110 }, { x: 215, y: 155 }, { x: 160, y: 180 },
        { x: 95, y: 180 }, { x: 65, y: 180 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 3, label: "Leg",
      checkpoints: [
        { x: 130, y: 180 }, { x: 170, y: 225 }, { x: 210, y: 275 },
        { x: 245, y: 315 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const S_upper: LetterPath = {
  letter: "S", case: "uppercase",
  strokes: [
    {
      id: 1, label: "S-curve",
      checkpoints: [
        { x: 225, y: 65 }, { x: 195, y: 40 }, { x: 155, y: 28 },
        { x: 110, y: 33 }, { x: 75, y: 60 }, { x: 60, y: 100 },
        { x: 75, y: 140 }, { x: 115, y: 165 }, { x: 155, y: 178 },
        { x: 195, y: 200 }, { x: 220, y: 238 }, { x: 215, y: 278 },
        { x: 188, y: 305 }, { x: 150, y: 318 }, { x: 108, y: 312 },
        { x: 75, y: 292 }, { x: 60, y: 268 },
      ],
      hitRadius: 34, resetThreshold: 50,
    },
  ],
};

const T_upper: LetterPath = {
  letter: "T", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Top bar",
      checkpoints: [
        { x: 40, y: 30 }, { x: 95, y: 30 }, { x: 150, y: 30 },
        { x: 205, y: 30 }, { x: 260, y: 30 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Stem",
      checkpoints: [
        { x: 150, y: 30 }, { x: 150, y: 110 }, { x: 150, y: 190 },
        { x: 150, y: 270 }, { x: 150, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const U_upper: LetterPath = {
  letter: "U", case: "uppercase",
  strokes: [
    {
      id: 1, label: "U-curve",
      checkpoints: [
        { x: 60, y: 30 }, { x: 60, y: 110 }, { x: 60, y: 200 },
        { x: 60, y: 250 }, { x: 75, y: 285 }, { x: 105, y: 308 },
        { x: 150, y: 318 }, { x: 195, y: 308 }, { x: 225, y: 285 },
        { x: 240, y: 250 }, { x: 240, y: 200 }, { x: 240, y: 110 },
        { x: 240, y: 30 },
      ],
      hitRadius: 34, resetThreshold: 50,
    },
  ],
};

const V_upper: LetterPath = {
  letter: "V", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Left diagonal",
      checkpoints: [
        { x: 40, y: 30 }, { x: 80, y: 120 }, { x: 115, y: 210 },
        { x: 140, y: 270 }, { x: 150, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Right diagonal",
      checkpoints: [
        { x: 260, y: 30 }, { x: 220, y: 120 }, { x: 185, y: 210 },
        { x: 160, y: 270 }, { x: 150, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const W_upper: LetterPath = {
  letter: "W", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Left down",
      checkpoints: [
        { x: 30, y: 30 }, { x: 55, y: 120 }, { x: 75, y: 220 }, { x: 85, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Left up",
      checkpoints: [
        { x: 85, y: 310 }, { x: 105, y: 225 }, { x: 130, y: 140 }, { x: 150, y: 185 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 3, label: "Right down",
      checkpoints: [
        { x: 150, y: 185 }, { x: 170, y: 140 }, { x: 195, y: 225 }, { x: 215, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 4, label: "Right up",
      checkpoints: [
        { x: 215, y: 310 }, { x: 225, y: 220 }, { x: 245, y: 120 }, { x: 270, y: 30 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const X_upper: LetterPath = {
  letter: "X", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Left-to-right diagonal",
      checkpoints: [
        { x: 45, y: 30 }, { x: 90, y: 95 }, { x: 130, y: 155 },
        { x: 175, y: 220 }, { x: 220, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Right-to-left diagonal",
      checkpoints: [
        { x: 255, y: 30 }, { x: 210, y: 95 }, { x: 170, y: 155 },
        { x: 125, y: 220 }, { x: 80, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const Y_upper: LetterPath = {
  letter: "Y", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Left arm",
      checkpoints: [
        { x: 40, y: 30 }, { x: 80, y: 90 }, { x: 115, y: 148 }, { x: 150, y: 185 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Right arm",
      checkpoints: [
        { x: 260, y: 30 }, { x: 220, y: 90 }, { x: 185, y: 148 }, { x: 150, y: 185 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 3, label: "Stem",
      checkpoints: [
        { x: 150, y: 185 }, { x: 150, y: 235 }, { x: 150, y: 285 }, { x: 150, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const Z_upper: LetterPath = {
  letter: "Z", case: "uppercase",
  strokes: [
    {
      id: 1, label: "Top bar",
      checkpoints: [
        { x: 50, y: 30 }, { x: 110, y: 30 }, { x: 175, y: 30 }, { x: 250, y: 30 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 2, label: "Diagonal",
      checkpoints: [
        { x: 250, y: 30 }, { x: 210, y: 90 }, { x: 168, y: 150 },
        { x: 128, y: 210 }, { x: 80, y: 270 }, { x: 50, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
    {
      id: 3, label: "Bottom bar",
      checkpoints: [
        { x: 50, y: 310 }, { x: 110, y: 310 }, { x: 175, y: 310 }, { x: 250, y: 310 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

// ─── LOWERCASE ───────────────────────────────────────────────────────────────

const a_lower: LetterPath = {
  letter: "a", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Circle",
      checkpoints: [
        { x: 185, y: 130 }, { x: 165, y: 108 }, { x: 140, y: 100 },
        { x: 112, y: 105 }, { x: 90, y: 125 }, { x: 78, y: 158 },
        { x: 80, y: 195 }, { x: 98, y: 225 }, { x: 125, y: 242 },
        { x: 157, y: 243 }, { x: 185, y: 230 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Right stem",
      checkpoints: [
        { x: 185, y: 130 }, { x: 185, y: 175 }, { x: 185, y: 220 }, { x: 185, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const b_lower: LetterPath = {
  letter: "b", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Stem",
      checkpoints: [
        { x: 80, y: 30 }, { x: 80, y: 110 }, { x: 80, y: 175 },
        { x: 80, y: 220 }, { x: 80, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Bump",
      checkpoints: [
        { x: 80, y: 148 }, { x: 118, y: 115 }, { x: 158, y: 105 },
        { x: 195, y: 118 }, { x: 215, y: 152 }, { x: 215, y: 195 },
        { x: 195, y: 228 }, { x: 158, y: 245 }, { x: 118, y: 242 }, { x: 80, y: 225 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const c_lower: LetterPath = {
  letter: "c", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Arc",
      checkpoints: [
        { x: 200, y: 125 }, { x: 178, y: 105 }, { x: 150, y: 97 },
        { x: 118, y: 102 }, { x: 93, y: 122 }, { x: 78, y: 155 },
        { x: 78, y: 192 }, { x: 90, y: 225 }, { x: 115, y: 244 },
        { x: 148, y: 250 }, { x: 178, y: 240 }, { x: 202, y: 220 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const d_lower: LetterPath = {
  letter: "d", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Circle",
      checkpoints: [
        { x: 195, y: 148 }, { x: 172, y: 115 }, { x: 140, y: 100 },
        { x: 105, y: 108 }, { x: 80, y: 135 }, { x: 70, y: 172 },
        { x: 75, y: 208 }, { x: 98, y: 235 }, { x: 130, y: 248 },
        { x: 162, y: 244 }, { x: 190, y: 225 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Tall stem",
      checkpoints: [
        { x: 195, y: 30 }, { x: 195, y: 110 }, { x: 195, y: 175 },
        { x: 195, y: 220 }, { x: 195, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const e_lower: LetterPath = {
  letter: "e", case: "lowercase",
  strokes: [
    {
      id: 1, label: "e-curve",
      checkpoints: [
        { x: 78, y: 170 }, { x: 100, y: 170 }, { x: 140, y: 170 },
        { x: 185, y: 170 }, { x: 210, y: 165 }, { x: 218, y: 148 },
        { x: 210, y: 125 }, { x: 188, y: 108 }, { x: 155, y: 98 },
        { x: 118, y: 103 }, { x: 90, y: 122 }, { x: 76, y: 155 },
        { x: 78, y: 192 }, { x: 92, y: 224 }, { x: 118, y: 243 },
        { x: 152, y: 250 }, { x: 185, y: 240 }, { x: 208, y: 220 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const f_lower: LetterPath = {
  letter: "f", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Hook + stem",
      checkpoints: [
        { x: 205, y: 62 }, { x: 188, y: 40 }, { x: 162, y: 30 },
        { x: 138, y: 35 }, { x: 122, y: 55 }, { x: 118, y: 85 },
        { x: 118, y: 140 }, { x: 118, y: 200 }, { x: 118, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Crossbar",
      checkpoints: [
        { x: 75, y: 152 }, { x: 115, y: 152 }, { x: 155, y: 152 }, { x: 185, y: 152 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const g_lower: LetterPath = {
  letter: "g", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Circle",
      checkpoints: [
        { x: 200, y: 138 }, { x: 178, y: 108 }, { x: 148, y: 98 },
        { x: 115, y: 105 }, { x: 90, y: 128 }, { x: 78, y: 162 },
        { x: 82, y: 200 }, { x: 102, y: 230 }, { x: 132, y: 248 },
        { x: 165, y: 248 }, { x: 194, y: 232 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Descender",
      checkpoints: [
        { x: 200, y: 138 }, { x: 200, y: 185 }, { x: 200, y: 240 },
        { x: 200, y: 285 }, { x: 188, y: 315 }, { x: 165, y: 330 },
        { x: 135, y: 330 }, { x: 110, y: 318 }, { x: 95, y: 300 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const h_lower: LetterPath = {
  letter: "h", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Left stem",
      checkpoints: [
        { x: 80, y: 30 }, { x: 80, y: 110 }, { x: 80, y: 175 },
        { x: 80, y: 220 }, { x: 80, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Arch",
      checkpoints: [
        { x: 80, y: 148 }, { x: 108, y: 115 }, { x: 145, y: 100 },
        { x: 182, y: 108 }, { x: 205, y: 138 }, { x: 210, y: 175 },
        { x: 210, y: 215 }, { x: 210, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const i_lower: LetterPath = {
  letter: "i", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Stem",
      checkpoints: [
        { x: 150, y: 115 }, { x: 150, y: 165 }, { x: 150, y: 210 }, { x: 150, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Dot",
      checkpoints: [
        { x: 150, y: 65 }, { x: 150, y: 75 },
      ],
      hitRadius: 28, resetThreshold: 44,
    },
  ],
};

const j_lower: LetterPath = {
  letter: "j", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Hook + stem",
      checkpoints: [
        { x: 165, y: 115 }, { x: 165, y: 175 }, { x: 165, y: 240 },
        { x: 165, y: 285 }, { x: 150, y: 315 }, { x: 122, y: 328 },
        { x: 95, y: 320 }, { x: 80, y: 300 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Dot",
      checkpoints: [
        { x: 165, y: 65 }, { x: 165, y: 75 },
      ],
      hitRadius: 28, resetThreshold: 44,
    },
  ],
};

const k_lower: LetterPath = {
  letter: "k", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Stem",
      checkpoints: [
        { x: 80, y: 30 }, { x: 80, y: 110 }, { x: 80, y: 175 },
        { x: 80, y: 220 }, { x: 80, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Upper kick",
      checkpoints: [
        { x: 205, y: 105 }, { x: 172, y: 138 }, { x: 140, y: 168 }, { x: 80, y: 185 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 3, label: "Lower kick",
      checkpoints: [
        { x: 122, y: 185 }, { x: 155, y: 215 }, { x: 185, y: 242 }, { x: 210, y: 250 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const l_lower: LetterPath = {
  letter: "l", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Stem",
      checkpoints: [
        { x: 150, y: 30 }, { x: 150, y: 110 }, { x: 150, y: 190 },
        { x: 150, y: 248 },
      ],
      hitRadius: 34, resetThreshold: 48,
    },
  ],
};

const m_lower: LetterPath = {
  letter: "m", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Left stem",
      checkpoints: [
        { x: 50, y: 115 }, { x: 50, y: 175 }, { x: 50, y: 220 }, { x: 50, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "First hump",
      checkpoints: [
        { x: 50, y: 130 }, { x: 72, y: 108 }, { x: 100, y: 98 },
        { x: 128, y: 108 }, { x: 145, y: 132 }, { x: 148, y: 175 },
        { x: 148, y: 220 }, { x: 148, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 3, label: "Second hump",
      checkpoints: [
        { x: 148, y: 130 }, { x: 170, y: 108 }, { x: 200, y: 98 },
        { x: 228, y: 108 }, { x: 245, y: 132 }, { x: 248, y: 175 },
        { x: 248, y: 220 }, { x: 248, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const n_lower: LetterPath = {
  letter: "n", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Left stem",
      checkpoints: [
        { x: 70, y: 115 }, { x: 70, y: 175 }, { x: 70, y: 220 }, { x: 70, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Arch",
      checkpoints: [
        { x: 70, y: 130 }, { x: 98, y: 105 }, { x: 132, y: 97 },
        { x: 168, y: 108 }, { x: 190, y: 138 }, { x: 195, y: 175 },
        { x: 195, y: 220 }, { x: 195, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const o_lower: LetterPath = {
  letter: "o", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Circle",
      checkpoints: [
        { x: 150, y: 98 }, { x: 188, y: 108 }, { x: 212, y: 142 },
        { x: 215, y: 178 }, { x: 205, y: 215 }, { x: 180, y: 240 },
        { x: 150, y: 248 }, { x: 118, y: 240 }, { x: 93, y: 215 },
        { x: 82, y: 178 }, { x: 85, y: 142 }, { x: 108, y: 108 },
        { x: 150, y: 98 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const p_lower: LetterPath = {
  letter: "p", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Stem",
      checkpoints: [
        { x: 72, y: 115 }, { x: 72, y: 185 }, { x: 72, y: 248 },
        { x: 72, y: 310 }, { x: 72, y: 340 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Bump",
      checkpoints: [
        { x: 72, y: 138 }, { x: 105, y: 108 }, { x: 140, y: 98 },
        { x: 175, y: 108 }, { x: 200, y: 138 }, { x: 205, y: 175 },
        { x: 196, y: 212 }, { x: 170, y: 238 }, { x: 135, y: 248 },
        { x: 100, y: 240 }, { x: 72, y: 218 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const q_lower: LetterPath = {
  letter: "q", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Circle",
      checkpoints: [
        { x: 205, y: 148 }, { x: 175, y: 110 }, { x: 140, y: 97 },
        { x: 105, y: 105 }, { x: 79, y: 135 }, { x: 70, y: 175 },
        { x: 76, y: 215 }, { x: 100, y: 240 }, { x: 135, y: 252 },
        { x: 170, y: 248 }, { x: 200, y: 228 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Descender",
      checkpoints: [
        { x: 205, y: 115 }, { x: 205, y: 185 }, { x: 205, y: 255 },
        { x: 205, y: 320 }, { x: 205, y: 340 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const r_lower: LetterPath = {
  letter: "r", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Stem",
      checkpoints: [
        { x: 80, y: 115 }, { x: 80, y: 175 }, { x: 80, y: 220 }, { x: 80, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Shoulder",
      checkpoints: [
        { x: 80, y: 130 }, { x: 108, y: 108 }, { x: 140, y: 98 },
        { x: 172, y: 100 }, { x: 195, y: 118 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const s_lower: LetterPath = {
  letter: "s", case: "lowercase",
  strokes: [
    {
      id: 1, label: "S-curve",
      checkpoints: [
        { x: 195, y: 120 }, { x: 175, y: 102 }, { x: 148, y: 95 },
        { x: 118, y: 100 }, { x: 96, y: 120 }, { x: 92, y: 148 },
        { x: 110, y: 168 }, { x: 145, y: 180 }, { x: 178, y: 195 },
        { x: 198, y: 220 }, { x: 192, y: 248 }, { x: 170, y: 265 },
        { x: 140, y: 270 }, { x: 108, y: 264 }, { x: 88, y: 245 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const t_lower: LetterPath = {
  letter: "t", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Stem",
      checkpoints: [
        { x: 150, y: 38 }, { x: 150, y: 115 }, { x: 150, y: 190 },
        { x: 150, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Crossbar",
      checkpoints: [
        { x: 90, y: 148 }, { x: 120, y: 148 }, { x: 150, y: 148 },
        { x: 182, y: 148 }, { x: 210, y: 148 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const u_lower: LetterPath = {
  letter: "u", case: "lowercase",
  strokes: [
    {
      id: 1, label: "U-curve",
      checkpoints: [
        { x: 72, y: 110 }, { x: 72, y: 160 }, { x: 72, y: 205 },
        { x: 80, y: 232 }, { x: 102, y: 250 }, { x: 132, y: 256 },
        { x: 160, y: 248 }, { x: 178, y: 228 }, { x: 182, y: 200 },
        { x: 182, y: 160 }, { x: 182, y: 110 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Right stem",
      checkpoints: [
        { x: 182, y: 110 }, { x: 182, y: 175 }, { x: 182, y: 220 }, { x: 182, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const v_lower: LetterPath = {
  letter: "v", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Left diagonal",
      checkpoints: [
        { x: 68, y: 110 }, { x: 95, y: 165 }, { x: 118, y: 215 }, { x: 138, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Right diagonal",
      checkpoints: [
        { x: 232, y: 110 }, { x: 205, y: 165 }, { x: 180, y: 215 }, { x: 162, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const w_lower: LetterPath = {
  letter: "w", case: "lowercase",
  strokes: [
    {
      id: 1, label: "First down",
      checkpoints: [
        { x: 40, y: 110 }, { x: 55, y: 165 }, { x: 65, y: 220 }, { x: 72, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "First up",
      checkpoints: [
        { x: 72, y: 248 }, { x: 88, y: 200 }, { x: 108, y: 148 }, { x: 128, y: 185 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 3, label: "Second down",
      checkpoints: [
        { x: 128, y: 185 }, { x: 148, y: 148 }, { x: 168, y: 200 }, { x: 178, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 4, label: "Second up",
      checkpoints: [
        { x: 178, y: 248 }, { x: 195, y: 220 }, { x: 212, y: 165 }, { x: 228, y: 110 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const x_lower: LetterPath = {
  letter: "x", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Left-to-right",
      checkpoints: [
        { x: 72, y: 110 }, { x: 105, y: 155 }, { x: 145, y: 200 }, { x: 182, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Right-to-left",
      checkpoints: [
        { x: 182, y: 110 }, { x: 148, y: 155 }, { x: 110, y: 200 }, { x: 72, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const y_lower: LetterPath = {
  letter: "y", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Left arm",
      checkpoints: [
        { x: 72, y: 110 }, { x: 95, y: 158 }, { x: 118, y: 200 }, { x: 138, y: 228 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Right descender",
      checkpoints: [
        { x: 200, y: 110 }, { x: 178, y: 162 }, { x: 155, y: 215 },
        { x: 132, y: 265 }, { x: 108, y: 305 }, { x: 85, y: 328 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

const z_lower: LetterPath = {
  letter: "z", case: "lowercase",
  strokes: [
    {
      id: 1, label: "Top bar",
      checkpoints: [
        { x: 72, y: 110 }, { x: 120, y: 110 }, { x: 172, y: 110 }, { x: 220, y: 110 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 2, label: "Diagonal",
      checkpoints: [
        { x: 220, y: 110 }, { x: 188, y: 155 }, { x: 152, y: 200 }, { x: 115, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
    {
      id: 3, label: "Bottom bar",
      checkpoints: [
        { x: 72, y: 248 }, { x: 118, y: 248 }, { x: 170, y: 248 }, { x: 220, y: 248 },
      ],
      hitRadius: 30, resetThreshold: 44,
    },
  ],
};

// ─── LOOKUP TABLE ─────────────────────────────────────────────────────────────

export const LETTER_PATHS: Record<string, LetterPath> = {
  // Uppercase
  A: A_upper, B: B_upper, C: C_upper, D: D_upper, E: E_upper,
  F: F_upper, G: G_upper, H: H_upper, I: I_upper, J: J_upper,
  K: K_upper, L: L_upper, M: M_upper, N: N_upper, O: O_upper,
  P: P_upper, Q: Q_upper, R: R_upper, S: S_upper, T: T_upper,
  U: U_upper, V: V_upper, W: W_upper, X: X_upper, Y: Y_upper,
  Z: Z_upper,
  // Lowercase
  a: a_lower, b: b_lower, c: c_lower, d: d_lower, e: e_lower,
  f: f_lower, g: g_lower, h: h_lower, i: i_lower, j: j_lower,
  k: k_lower, l: l_lower, m: m_lower, n: n_lower, o: o_lower,
  p: p_lower, q: q_lower, r: r_lower, s: s_lower, t: t_lower,
  u: u_lower, v: v_lower, w: w_lower, x: x_lower, y: y_lower,
  z: z_lower,
};

export function getLetterPath(letter: string): LetterPath | null {
  return LETTER_PATHS[letter] ?? null;
}
