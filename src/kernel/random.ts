export class Random {
    private _seed = Math.random()
    private increment = 1

    get seed() {
        return this._seed
    }
    set seed(value: number) {
        this._seed = value
        this.increment = 1
    }

    /**
     * A random value between 0.0 (included) and 1.0 (excluded).
     */
    get value(): number {
        this.increment += 0.73554992839
        const rnd =
            43758.5453 *
            Math.sin(12.9898 * this._seed + 78.233 * this.increment)
        return rnd - Math.floor(rnd)
    }
}
