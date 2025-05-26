import { make } from "./_common"
import { argsAreAnys } from "@/basik/guards"
import { Kernel } from "@/kernel/kernel"

export const makeSeed = (kernel: Kernel) =>
    make("SEED", argsAreAnys(0, 0), () => kernel.random.seed)
