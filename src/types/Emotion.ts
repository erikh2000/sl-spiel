enum Emotion {
  NEUTRAL,
  AFRAID,
  AMUSED,
  ANGRY,
  CONFUSED,
  EVIL,
  HAPPY,
  IRRITATED,
  SAD,
  SUSPICIOUS,
  THINKING
}

export const emotionNames:string[] = [ // Must match membership/order of above.
  'NEUTRAL','AFRAID','AMUSED','ANGRY','CONFUSED','EVIL','HAPPY','IRRITATED','SAD','SUSPICIOUS','THINKING'
];

export default Emotion;