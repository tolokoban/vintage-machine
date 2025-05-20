export class Music {
    private readonly frequencies: Record<string, number> = {}
    private notes: Note[] = []
    private index = 0
    private timeout: number = 0
    private playing = false

    constructor() {
        for (let octave = 0; octave < 10; octave++) {
            for (const base of Object.keys(NOTES)) {
                const freq5 = NOTES[base as keyof typeof NOTES]
                const key = `${base}${octave}`
                this.frequencies[key] = freq5 * Math.pow(2, octave - 5)
            }
        }
        console.log("🚀 [music] this.frequencies =", this.frequencies) // @FIXME: Remove this line written on 2025-05-19 at 20:04
    }

    play(score: string) {
        this.notes = parseScore(score)
        console.log("🚀 [music] score, notes =", score, this.notes) // @FIXME: Remove this line written on 2025-05-19 at 20:05
        this.playing = true
        this.index = 0
        setTimeout(this.next)
        return this.notes.reduce((prv, cur) => prv + cur.duration, 0)
    }

    stop() {
        this.playing = false
        clearTimeout(this.timeout)
        this.timeout = 0
    }

    private readonly next = () => {
        if (!window.AudioContext || !this.playing) return

        clearTimeout(this.timeout)
        const note = this.notes[this.index % this.notes.length]
        console.log("🚀 [music] note =", note) // @FIXME: Remove this line written on 2025-05-19 at 20:05
        this.index++
        const duration = note.duration
        this.timeout = setTimeout(
            this.next,
            duration * 1000
        ) as unknown as number

        const fade = Math.min(0.2, duration / 10)
        const ctx = new window.AudioContext()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = "sine"
        osc.frequency.setValueAtTime(
            this.frequencies[note.note] ?? 0,
            ctx.currentTime
        )
        osc.connect(gain)
        gain.connect(ctx.destination)
        gain.gain.exponentialRampToValueAtTime(0.000001, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(
            note.volume,
            ctx.currentTime + fade
        )
        gain.gain.exponentialRampToValueAtTime(
            note.volume,
            ctx.currentTime + duration - fade
        )
        gain.gain.exponentialRampToValueAtTime(
            0.000001,
            ctx.currentTime + duration
        )

        osc.start()
        osc.stop(ctx.currentTime + duration)
    }
}

function parseScore(score: string) {
    const notes: Note[] = []
    let duration = 1 / 4
    let cursor = 0
    let volume = 0.5
    while (cursor < score.length) {
        RX_VOLUME.lastIndex = -1
        const matchVolume = RX_VOLUME.exec(score.slice(cursor))
        if (matchVolume) {
            volume = Number(matchVolume[0].slice(1)) / 10
            cursor += matchVolume[0].length
            continue
        }
        RX_DURATION.lastIndex = -1
        const matchDuration = RX_DURATION.exec(score.slice(cursor))
        if (matchDuration) {
            duration = 1 / Number(matchDuration[0].slice(1))
            cursor += matchDuration[0].length
            continue
        }
        RX_NOTE.lastIndex = -1
        const matchNote = RX_NOTE.exec(score.slice(cursor))
        if (matchNote) {
            cursor += matchNote[0].length
            notes.push({
                note: matchNote[0],
                volume,
                duration,
            })
            continue
        }
        cursor++
    }
    return notes
}

interface Note {
    duration: number
    volume: number
    note: string
}

const RX_NOTE = /^(-|[A-G][b#]?[0-9])/g

const RX_DURATION = /^:[1-9][0-9]*/g

const RX_VOLUME = /^@[1-9]/g

// Octave 5.
const NOTES = {
    Cb: 493.88,
    C: 523.25,
    "C#": 554.37,
    Db: 554.37,
    D: 587.33,
    "D#": 622.25,
    Eb: 622.25,
    E: 659.26,
    "E#": 698.46,
    Fb: 659.26,
    F: 698.46,
    "F#": 739.99,
    Gb: 739.99,
    G: 783.99,
    "G#": 830.61,
    Ab: 415.3 * 2,
    A: 440.0 * 2,
    "A#": 466.16 * 2,
    Bb: 466.16 * 2,
    B: 493.88 * 2,
    "B#": 523.25 * 2,
}
