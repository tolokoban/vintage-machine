import { BasikValue } from "@/types"

export type TestCase = [name: string, children: Array<TestCase | TestCaseItem>]

export interface TestCaseItem {
    code: string[]
    vars: Record<string, BasikValue>
}

export const TEST_CASES: TestCase = [
    "Var assignement",
    [{ code: ["$a = 666"], vars: { $a: 666 } }],
]
