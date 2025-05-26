export class Random {
    /**
     * A random value between 0.0 (included) and 1.0 (excluded).
     */
    get value(): number {
        return Math.random()
    }
}
