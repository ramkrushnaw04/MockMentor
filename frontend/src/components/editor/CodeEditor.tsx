import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { fetchProblemStatement } from "../../api/fetchProblemStatement";
import { evaluateCode } from "../../api/evaluateCode";

const CodeEditor = () => {
    const [language, setLanguage] = useState<any>({ name: "cpp", id: 54 });
    const [code, setCode] = useState(`#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a+b;
    return 0;
}`);
    const [problem, setProblem] = useState<any>(null);
    const [results, setResults] = useState<
        { input: string; expectedOutput: string; got: string; passed: boolean }[]
    >([]);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        (async function () {
            const res = await fetchProblemStatement("10");
            setProblem(res);
        })();
    }, []);

    const handleRun = async () => {
        if (!problem) return;
        const userOutput = await evaluateCode(
            code,
            problem.testCases.map((tc: any) => ({ input: tc.input, expectedOutput: tc.expectedOutput })),
            language.name,
            language.id
        );
        // console.log(userOutput);
        setResults(userOutput);
    };

    return (
        <div className="w-screen h-screen flex bg-gray-950 text-gray-200">
            {/* Left side: problem */}
            <div className="w-1/2 h-full overflow-y-auto p-6 bg-gray-900 border-r border-gray-800">
                {problem && (
                    <div className="space-y-5">
                        <h2 className="text-2xl font-bold text-white">{problem.title}</h2>
                        <p><b>Statement:</b> {problem.statement}</p>
                        <p><b>Input Format:</b> {problem.inputFormat}</p>
                        <p><b>Output Format:</b> {problem.outputFormat}</p>
                        <p><b>Constraints:</b> {problem.constraints}</p>
                        <p>
                            <b>Difficulty:</b>{" "}
                            <span
                                className={`px-2 py-1 rounded text-white ${
                                    problem.difficulty === "Easy"
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
                            <h3 className="font-semibold text-white">Tags</h3>
                            <div className="flex gap-2 flex-wrap mt-2">
                                {problem.tags.map((tag: any) => (
                                    <span
                                        key={tag.id}
                                        className="px-3 py-1 text-sm bg-blue-800 text-blue-200 rounded-full"
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
            <div className="h-full w-1/2 flex flex-col bg-gray-950">
                <MonacoEditor
                    height="55%"
                    theme="vs-dark"
                    language={language.name}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
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
                <div className="bg-gray-900 border-t border-gray-800 flex items-center justify-between px-4">
                    <div className="flex">
                        {problem?.testCases.map((tc: any, idx: number) => (
                            <button
                                key={tc.id}
                                className={`px-4 py-2 text-sm ${
                                    activeTab === idx
                                        ? "border-b-2 border-yellow-500 text-yellow-400"
                                        : "text-gray-400 hover:text-gray-200"
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
                        <button className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded text-white">
                            Submit
                        </button>
                    </div>
                </div>

                {/* Active test case output */}
                <div className="flex-1 bg-gray-900 p-4">
                    {problem && results.length > 0 ? (
                        <div
                            className={`p-4 rounded ${
                                results[activeTab]?.passed
                                    ? "bg-green-900 text-green-300"
                                    : "bg-red-900 text-red-300"
                            }`}
                        >
                            <p><b>Input:</b> {results[activeTab]?.input}</p>
                            <p><b>Expected:</b> {results[activeTab]?.expectedOutput}</p>
                            <p><b>Got:</b> {results[activeTab]?.got}</p>
                            <p><b>Status:</b> {results[activeTab]?.passed ? "Passed ✅" : "Failed ❌"}</p>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">
                            Select a test case and click Run.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;