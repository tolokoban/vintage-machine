import { Kernel } from "@/kernel";
import { BasikAssembly } from "./asm";

export function createBasikAssembly(kernel: Kernel) {
  const asm = new BasikAssembly(kernel);
  return asm as {
    execute(code: string): Promise<void>;
  };
}
