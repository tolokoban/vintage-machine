import { ViewPanel, ViewStrip } from "@tolokoban/ui"
import {
    isTestCase,
    isTestItem,
    TEST_CASES,
    TestCase,
    TestItem,
} from "./_testcases"

import styles from "./page.module.css"
import React from "react"
import { Kernel } from "@/kernel"
import { BasikValue } from "@/types"
import { createBasikAssembly } from "@/basik/asm"
import { formatBasik } from "@/components/WorkBench/PanelEditor/Editor/formatter"

interface TestResult {
    item: TestItem
    pass: boolean
    /**
     * The vars we got.
     */
    vars: Record<string, BasikValue>
}

export default function Page() {
    const results = useResults()
    useActions(results)

    return (
        <ViewStrip
            className={styles.page}
            template="*1"
            orientation="column"
            position="absolute"
            fullsize
        >
            <ViewPanel
                padding="M"
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                color="primary-1"
            >
                <b>Test suite</b>
            </ViewPanel>
            <ViewPanel padding="M" overflow="auto" color="neutral-1">
                <ul>
                    <ViewTestCase
                        testCase={TEST_CASES}
                        gid="0"
                        results={results}
                    />
                </ul>
            </ViewPanel>
        </ViewStrip>
    )
}

function useActions(results: Map<string, TestResult>) {
    const [, setCount] = React.useState(-1)
    const actions = React.useMemo(() => {
        const actions: Array<() => Promise<void>> = []
        crawlActions(TEST_CASES, actions, results, "0")
        console.log("🚀 [page] actions =", actions) // @FIXME: Remove this line written on 2025-05-15 at 15:45
        return actions
    }, [results])
    React.useEffect(() => {
        const job = async () => {
            for (let i = 0; i < actions.length; i++) {
                await actions[i]()
                setCount(i)
            }
        }
        job()
    }, [actions, results])
}

function crawlActions(
    testCase: TestCase,
    actions: Array<() => Promise<void>>,
    results: Map<string, TestResult>,
    gid: string
) {
    const [, children] = testCase
    const childrenCases = children.filter(isTestCase)
    const childrenItems = children.filter(isTestItem)
    let index = 0
    for (const testItem of childrenItems) {
        const id = `${gid}/${index++}`
        actions.push(async () => {
            const result: TestResult = {
                item: testItem,
                pass: false,
                vars: {},
            }
            const canvas = globalThis.document.createElement("canvas")
            const kernel = new Kernel(canvas, new Image())
            try {
                const asm = createBasikAssembly(kernel)
                await asm.execute(testItem.code.join("\n"))
                for (const key of kernel.allVarNames) {
                    result.vars[`$${key.toLowerCase()}`] = kernel.getVar(key)
                }
            } catch (ex) {
                const msg =
                    ex instanceof Error
                        ? ex.message
                        : JSON.stringify(ex, null, "  ")
                result.vars["@ERROR"] = msg
            }
            results.set(id, result)
            result.pass = true
            for (const key of Object.keys(testItem.vars)) {
                const exp = testItem.vars[key]
                const got = result.vars[key]
                const typeExp = typeof exp
                const typeGot = typeof got
                if (typeExp !== typeGot) {
                    result.vars["@ERROR"] =
                        `${key} was expected to be of type ${typeExp}, but we got ${typeGot}!`
                    result.pass = false
                    break
                }
                if (JSON.stringify(exp) !== JSON.stringify(got)) {
                    result.vars["@ERROR"] =
                        `${key} was expected to be ${exp}, but we got ${got}!`
                    result.pass = false
                    break
                }
            }
            kernel.delete()
            console.log(result)
        })
    }
    index = 0
    for (const testCase of childrenCases) {
        const id = `${gid}/${index++}`
        crawlActions(testCase, actions, results, id)
    }
}

function useResults() {
    const refResults = React.useRef<Map<string, TestResult> | null>(null)
    if (!refResults.current) refResults.current = new Map<string, TestResult>()
    return refResults.current as Map<string, TestResult>
}

function ViewTestCase({
    testCase,
    gid,
    results,
}: {
    testCase: TestCase
    gid: string
    results: Map<string, TestResult>
}) {
    const [name, children] = testCase
    const childrenCases = children.filter(isTestCase)
    const childrenItems = children.filter(isTestItem)

    return (
        <li>
            <div>{name}</div>
            <ul>
                {childrenItems.map((testItem, index) => (
                    <ViewTestItem
                        key={`${testItem}#${index}/I`}
                        testItem={testItem}
                        gid={`${gid}/${index}`}
                        results={results}
                    />
                ))}
            </ul>
            <ul>
                {childrenCases.map((testCase, index) => {
                    const [name] = testCase
                    return (
                        <ViewTestCase
                            key={`${name}#${index}/C`}
                            testCase={testCase}
                            gid={`${gid}/${index}`}
                            results={results}
                        />
                    )
                })}
            </ul>
        </li>
    )
}

function ViewTestItem({
    testItem,
    gid,
    results,
}: {
    testItem: TestItem
    gid: string
    results: Map<string, TestResult>
}) {
    const result = results.get(gid)
    const className = !result
        ? styles.wait
        : result.pass
          ? styles.pass
          : styles.fail

    if (!result) return
    return (
        <li>
            <details>
                <summary className={className}>{testItem.name}</summary>
                <div>
                    <pre>{testItem.code.join("\n")}</pre>
                    <div>
                        Expected:
                        <ul>
                            {Object.keys(testItem.vars).map(key => (
                                <li key={key}>
                                    {key}:{" "}
                                    <code>
                                        {JSON.stringify(testItem.vars[key])}
                                    </code>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        Got:
                        <ul>
                            {Object.keys(result.vars).map(key => (
                                <li key={key}>
                                    {key}:{" "}
                                    <code>
                                        {JSON.stringify(result.vars[key])}
                                    </code>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </details>
        </li>
    )
}
