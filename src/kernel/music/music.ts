export class Music {}

function parseScore(score: string) {
    let octave = 0
    let duration = 1 / 4
}

const RX_NOTE = /^[A-G][b#]?[0-9]/g

// Octave 4 until B, then octave 5 from C (Do).
const NOTES = {
    Ab: 415.3,
    A: 440.0,
    "A#": 466.16,
    Bb: 466.16,
    B: 493.88,
    "B#": 523.25,
    Cb: 523.25,
    C: 523.25,
    "C#": 554.37,
    Db: 554.37,
    D: 587.33,
    "D#": 622.25,
    Eb: 622.25,
    E: 659.26,
    "E#": 698.46,
    Fb: 698.46,
    F: 698.46,
    "F#": 739.99,
    Gb: 739.99,
    G: 783.99,
    "G#": 830.61,
}
