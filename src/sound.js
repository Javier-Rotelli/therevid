import * as Tone from "tone";

// SYNTH
const synth = new Tone.DuoSynth({
  vibratoAmount: 0.5,
  vibratoRate: 5,
  harmonicity: 0,
  volume: 5,

  portamento: 0.0,
  voice0: {
    oscillator: {
      type: "square4",
    },
    envelope: {
      attack: 2,
      decay: 1,
      sustain: 0.2,
      release: 2,
    },
    voice1: {
      oscillator: {
        type: "sawtooth",
      },
      filter: {
        Q: 1,
        type: "lowpass",
        rolloff: -24,
      },
      envelope: {
        attack: 0.01,
        decay: 0.25,
        sustain: 0.4,
        release: 1.2,
      },
      filterEnvelope: {
        attack: 0.001,
        decay: 0.05,
        sustain: 0.3,
        release: 2,
        baseFrequency: 100,
        octaves: 4,
      },
    },
  },
}).toDestination();

const synthNotes = [
  "C2",
  "G2",
  "D3",
  "A4",
  "E4",
  "B5",
  "F#5",
  "Gb5",
  "Db6",
  "Ab7",
  "Eb7",
  "Bb7",
  "F8",
];

Tone.Transport.bpm.value = 125;

const saturate = (x) => Math.min(Math.max(0, x), 1);

export function move({ x, y }) {
  // use the x and y values to set the note and vibrato
  const note = synthNotes[Math.round(saturate(y) * (synthNotes.length - 1))];
  synth.setNote(note);
  synth.vibratoAmount.value = saturate(x ^ 10);
}

let oldNote;
export function triggerAttack({ x, y }) {
  // use the x and y values to set the note and vibrato
  const note = synthNotes[Math.round(x * (synthNotes.length - 1))];
  if (note !== oldNote) {
    oldNote = note;
    synth.triggerAttack(note);
  }
  synth.volume;
}

export function volume(x) {
  // use the x and y values to set the volume
  const volume = Math.min(Math.max(0, x), 1) * 50 - 25;
  synth.volume.value = volume;
}
