import { parser } from "./syntax.grammar"
import {
    LRLanguage,
    LanguageSupport,
    indentNodeProp,
    foldNodeProp,
    foldInside,
    delimitedIndent,
} from "@codemirror/language"
import { styleTags, tags as t } from "@lezer/highlight"

export const BasikLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [
            indentNodeProp.add({
                Application: delimitedIndent({ closing: "}", align: false }),
            }),
            foldNodeProp.add({
                Application: foldInside,
            }),
            styleTags({
                Var: t.variableName,
                Num: t.number,
                String: t.string,
                Func: t.keyword,
                LineComment: t.lineComment,
            }),
        ],
    }),
    languageData: {
        commentTokens: { line: "REM " },
    },
})

export function basik() {
    return new LanguageSupport(BasikLanguage)
}
