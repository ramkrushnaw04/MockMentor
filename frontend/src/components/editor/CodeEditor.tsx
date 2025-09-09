import { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { fetchProblemStatement } from "../../api/fetchProblemStatement";
import { runSampleCases, submitProblem } from "../../api/evaluateCode";

import useDarkMode from "../../hooks/useDarkMode";

import type {
    editorConfigType,
    resultsType
} from "../../config/types";

import {
    languages
} from "../../config/constants";

const CodeEditor = () => {
    const [editorConfig, setEditorConfig] = useState<editorConfigType>({
        language: "C++",
        languageCode: "cpp",
        languageId: 54,
        fontSize: 14,
    })
    const [code, setCode] = useState(`#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a+b;
    return 0;
}`);
    const [problem, setProblem] = useState<any>(null);
    const [results, setResults] = useState<resultsType[]>([]);
    const [activeTab, setActiveTab] = useState(0);

    const { isDark, toggleDarkMode } = useDarkMode();
    const problemId = "1"; 

    useEffect(() => {
        (async function () {
            const res = await fetchProblemStatement(problemId);
            setProblem(res);
        })();
    }, []);

    const handleRun = async () => {
        if (!problem) return;
        const userOutput = await runSampleCases(
            code,
            problem.testCases.map((tc: any) => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
            editorConfig.languageId
        );
        setResults(userOutput);
    };

    const handleSubmit = async () => {
        if (!problem) return;
        const userOutput = await submitProblem(
            code,
            editorConfig.languageId,
            problemId
        );
        setResults(userOutput);
    }

    return (
        <div className="w-screen h-screen flex bg-gray-950 dark:bg-gray-50 text-gray-200 dark:text-gray-900">
            {/* Left side: problem */}
            <div className="w-1/2 h-full overflow-y-auto p-6 bg-gray-900 dark:bg-gray-100 border-r border-gray-800 dark:border-gray-300">
                {problem && (
                    <div className="space-y-5">
                        <h2 className="text-2xl font-bold text-white dark:text-gray-900">{problem.title}</h2>
                        <p><b>Statement:</b> {problem.statement}</p>
                        <p><b>Input Format:</b> {problem.inputFormat}</p>
                        <p><b>Output Format:</b> {problem.outputFormat}</p>
                        <p><b>Constraints:</b> {problem.constraints}</p>
                        <p>
                            <b>Difficulty:</b>{" "}
                            <span
                                className={`px-2 py-1 rounded text-white ${problem.difficulty === "Easy"
                                    ? "bg-green-600"
                                    : problem.difficulty === "Medium"
                                        ? "bg-yellow-600"
                                        : "bg-red-600"
                                    }`}
                            >
                                {problem.difficulty}
                            </span>
                        </p>

                        <div>
                            <h3 className="font-semibold text-white dark:text-gray-900">Tags</h3>
                            <div className="flex gap-2 flex-wrap mt-2">
                                {problem.tags.map((tag: any) => (
                                    <span
                                        key={tag.id}
                                        className="px-3 py-1 text-sm bg-blue-800 dark:bg-blue-200 text-blue-200 dark:text-blue-900 rounded-full"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right side: editor + test case tabs */}
            <div className="h-full w-1/2 flex flex-col bg-gray-950 dark:bg-gray-50">
            
                <div className="flex flex-row gap-4">

                    <select
                        value={editorConfig.language}
                        onChange={(e) => {
                            const selected = languages.find((lang) => lang.name === e.target.value);
                            if (selected) {
                                setEditorConfig((prev) => ({
                                    ...prev,
                                    language: selected.name,
                                    languageId: selected.id,
                                    languageCode: selected.languageCode
                                }));

                                setCode(selected.snippet);
                            }
                        }}
                        className="px-2 py-1 w-32 rounded bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900"
                    >
                        {languages.map((lang) => (
                            <option key={lang.id} value={lang.name}>
                                {lang.name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={toggleDarkMode}
                        className="px-4 py-2 w-32 rounded bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900"
                    >
                        {isDark ? "Dark Mode" : "Light Mode"}
                    </button>
                </div>

                <MonacoEditor
                    height="55%"
                    theme={isDark ? "vs-dark" : "light"}
                    language={editorConfig.languageCode}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    options={{
                        minimap: { enabled: false },
                        fontSize: editorConfig.fontSize,
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                        lineNumbers: "on",
                        folding: true,
                        selectOnLineNumbers: true,
                        matchBrackets: "always",
                    }}
                />

                {/* Tabs + Buttons */}
                <div className="bg-gray-900 dark:bg-gray-100 border-t border-gray-800 dark:border-gray-300 flex items-center justify-between px-4">
                    <div className="flex">
                        {problem?.testCases.map((tc: any, idx: number) => (
                            <button
                                key={tc.id}
                                className={`px-4 py-2 text-sm ${activeTab === idx
                                    ? "border-b-2 border-yellow-500 text-yellow-400"
                                    : "text-gray-400 hover:text-gray-200 dark:text-gray-600 dark:hover:text-gray-900"
                                    }`}
                                onClick={() => setActiveTab(idx)}
                            >
                                Case {idx + 1}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="bg-yellow-600 hover:bg-yellow-500 px-4 py-1 rounded text-white"
                            onClick={handleRun}
                        >
                            Run
                        </button>
                        <button 
                            className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded text-white"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>

                {/* Active test case output */}
                <div className="flex-1 bg-gray-900 dark:bg-gray-100 p-4">
                    {problem ? (
                        <div
                            className={`p-4 rounded ${results[activeTab]?.passed
                                ? "bg-green-900 text-green-300 dark:bg-green-200 dark:text-green-900"
                                : "bg-gray-800 text-gray-300 dark:bg-gray-200 dark:text-gray-900"
                                }`}
                        >
                            <p><b>Input:</b> {problem.testCases[activeTab]?.input}</p>
                            <p><b>Expected:</b> {problem.testCases[activeTab]?.expectedOutput}</p>
                            <p><b>Got:</b> {results[activeTab]?.got || "Not run yet"}</p>
                            <p>
                                <b>Status:</b>{" "}
                                {results[activeTab]
                                    ? results[activeTab]?.passed
                                        ? "Passed ✅"
                                        : "Failed ❌"
                                    : "Not run yet"}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-400 dark:text-gray-700 text-sm">
                            Select a test case and click Run.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;