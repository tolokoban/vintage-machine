import { BasikValue } from "@/types";

export type TestCase = [name: string, children: Array<TestCase | TestItem>];

export interface TestItem {
  name: string;
  code: string[];
  vars: Record<string, BasikValue>;
}

export function isTestCase(data: TestCase | TestItem): data is TestCase {
  return Array.isArray(data);
}

export function isTestItem(data: TestCase | TestItem): data is TestItem {
  return !Array.isArray(data);
}

export const TEST_CASES: TestCase = [
  "expression",
  [
    [
      "atomic",
      [
        [
          "number",
          [
            { name: "positive integer", code: ["$a = 666"], vars: { $a: 666 } },
            {
              name: "positive integer (with +)",
              code: ["$a = +666"],
              vars: { $a: 666 },
            },
            {
              name: "negative integer",
              code: ["$a = -666"],
              vars: { $a: -666 },
            },
            {
              name: "positive float",
              code: ["$a = 27.11"],
              vars: { $a: 27.11 },
            },
            {
              name: "positive float (with +)",
              code: ["$a = +27.11"],
              vars: { $a: 27.11 },
            },
            {
              name: "negative float",
              code: ["$a = -27.11"],
              vars: { $a: -27.11 },
            },
            {
              name: "positive hexa",
              code: ["$a = #ff"],
              vars: { $a: 255 },
            },
            {
              name: "negative hexa",
              code: ["$a = -#ff"],
              vars: { $a: -255 },
            },
          ],
        ],
        [
          "string",
          [
            { name: "empty", code: ['$a = ""'], vars: { $a: "" } },
            {
              name: "hello world",
              code: ['$a = "Hello world!"'],
              vars: { $a: "Hello world!" },
            },
            {
              name: "multi-line",
              code: ['$a = "hello', 'world"'],
              vars: { $a: `hello\nworld` },
            },
          ],
        ],
        [
          "list",
          [
            { name: "empty", code: ["$a = []"], vars: { $a: [] } },
            {
              name: "empty with spaces",
              code: ["$a = [\n \t\n\r\r  ]"],
              vars: { $a: [] },
            },
            { name: "inline", code: ["$a = [1,2,3]"], vars: { $a: [1, 2, 3] } },
            {
              name: "inline with spaces",
              code: ["$a = [1,  2,3   ]"],
              vars: { $a: [1, 2, 3] },
            },
          ],
        ],
      ],
    ],
    [
      "binary operator",
      [
        [
          "with number",
          [
            { name: "addition", code: ["$a = 7+3"], vars: { $a: 10 } },
            { name: "substraction", code: ["$a = 7-3"], vars: { $a: 4 } },
            {
              name: "substraction with hexa",
              code: ["$a = 7-#3"],
              vars: { $a: 4 },
            },
            { name: "multiplication", code: ["$a = 7*3"], vars: { $a: 21 } },
            { name: "division", code: ["$a = 26/2"], vars: { $a: 13 } },
          ],
        ],
      ],
    ],
  ],
];
