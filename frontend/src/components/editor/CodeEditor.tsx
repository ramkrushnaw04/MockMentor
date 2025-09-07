"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Moon, Sun, Code, Play, RotateCcw } from "lucide-react"
import MonacoEditor from "@monaco-editor/react"

import { evaluateCode } from "../../api/evaluateCode"

const LANGUAGES = [
    { label: "C++", value: "cpp", id: 54 },
    { label: "C", value: "c", id: 50 },
    { label: "Python", value: "python", id: 71 },
    { label: "Java", value: "java", id: 62 },
    { label: "JavaScript", value: "javascript", id: 93 },
]

const SAMPLE_PROBLEM = {
    title: "Two Sum",
    difficulty: "Easy",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
        {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
        },
        {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]",
            explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
        },
    ],
    constraints: [
        "2 ≤ nums.length ≤ 10⁴",
        "−10⁹ ≤ nums[i] ≤ 10⁹",
        "−10⁹ ≤ target ≤ 10⁹",
        "Only one valid answer exists.",
    ],
}

const TEST_CASES = [
    { input: "[2,7,11,15], 9", expected: "[0,1]", status: "pending" },
    { input: "[3,2,4], 6", expected: "[1,2]", status: "pending" },
    { input: "[3,3], 6", expected: "[0,1]", status: "pending" },
]

// Custom Button component
const Button = ({
    children,
    onClick,
    disabled = false,
    variant = "default",
    size = "default",
    className = "",
}: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    variant?: "default" | "outline"
    size?: "default" | "sm" | "icon"
    className?: string
}) => {
    const baseClasses =
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

    const variantClasses = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    }

    const sizeClasses = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        icon: "h-10 w-10",
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        >
            {children}
        </button>
    )
}

// Custom Card components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>{children}</div>
)

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
)

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`p-6 pt-0 ${className}`}>{children}</div>
)

// Custom Select components
const Select = ({
    value,
    onValueChange,
    children,
}: {
    value: string
    onValueChange: (value: string) => void
    children: React.ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(child as any, {
                        value,
                        onValueChange,
                        isOpen,
                        setIsOpen,
                    })
                    : child,
            )}
        </div>
    )
}

const SelectTrigger = ({
    children,
    className = "",
    value,
    isOpen,
    setIsOpen,
}: {
    children: React.ReactNode
    className?: string
    value?: string
    isOpen?: boolean
    setIsOpen?: (open: boolean) => void
}) => (
    <button
        onClick={() => setIsOpen?.(!isOpen)}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 dark:text-white ${className}`}
    >
        {children}
        <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    </button>
)

const SelectValue = ({ value }: { value?: string }) => {
    const languages = LANGUAGES.find((lang) => lang.value === value)
    return <span className="text-slate-900 dark:text-white">{languages?.label || "Select language"}</span>
}

const SelectContent = ({
    children,
    isOpen,
    setIsOpen,
    onValueChange,
}: {
    children: React.ReactNode
    isOpen?: boolean
    setIsOpen?: (open: boolean) => void
    onValueChange?: (value: string) => void
}) => {
    if (!isOpen) return null

    return (
        <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md border border-slate-200 dark:border-slate-700 shadow-md">
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(child as any, {
                        onValueChange,
                        setIsOpen,
                    })
                    : child,
            )}
        </div>
    )
}

const SelectItem = ({
    children,
    value,
    onValueChange,
    setIsOpen,
}: {
    children: React.ReactNode
    value: string
    onValueChange?: (value: string) => void
    setIsOpen?: (open: boolean) => void
}) => (
    <div
        onClick={() => {
            onValueChange?.(value)
            setIsOpen?.(false)
        }}
        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
    >
        {children}
    </div>
)

// Custom Badge component
const Badge = ({
    children,
    variant = "default",
    className = "",
}: {
    children: React.ReactNode
    variant?: "default" | "secondary"
    className?: string
}) => {
    const variantClasses = {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    }

    return (
        <div
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantClasses[variant]} ${className}`}
        >
            {children}
        </div>
    )
}

export default function DSAPlatform() {
    const [isDark, setIsDark] = useState(false)
    const [language, setLanguage] = useState("cpp")
    const [code, setCode] = useState(`#include <iostream>

int main() {
    std::cout << "Hello World!";
    return 0;
}`)
    const [output, setOutput] = useState("")
    const [isRunning, setIsRunning] = useState(false)
    const [testResults, setTestResults] = useState(TEST_CASES)

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme")
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
            setIsDark(true)
            document.documentElement.classList.add("dark")
        }
    }, [])

    const toggleTheme = () => {
        setIsDark(!isDark)
        if (!isDark) {
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            document.documentElement.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }

    const runCode = () => {
        setIsRunning(true)
        setOutput("Running code...")
        const languageId = LANGUAGES.find((lang) => lang.value === language)?.id || -1;
        evaluateCode(code, language, languageId);

        // Simulate code execution
        setTimeout(() => {
            setOutput(`Compilation successful!
Test Case 1: PASSED
Test Case 2: PASSED
Test Case 3: PASSED

Runtime: 4ms (Beats 95.2% of submissions)
Memory: 11.2MB (Beats 87.4% of submissions)`)

            setTestResults((prev) => prev.map((test) => ({ ...test, status: "passed" })))
            setIsRunning(false)
        }, 2000)
    }

    const resetCode = () => {
        setCode(`#include <iostream>

int main() {
    std::cout << "Hello World!";
    return 0;
}`)
        setOutput("")
        setTestResults(TEST_CASES)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
            {/* Header */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Code className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">Mock Mentor</span>
                            <Badge variant="secondary" className="ml-2">
                                DSA Practice
                            </Badge>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {LANGUAGES.map((lang) => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={toggleTheme}
                                className="hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
                            >
                                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left Panel - Problem Description */}
                    <div className="flex flex-col space-y-4">
                        <Card className="flex-1 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {SAMPLE_PROBLEM.title}
                                    </CardTitle>
                                    <Badge
                                        variant="secondary"
                                        className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                    >
                                        {SAMPLE_PROBLEM.difficulty}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Problem Description</h3>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{SAMPLE_PROBLEM.description}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Examples</h3>
                                    <div className="space-y-4">
                                        {SAMPLE_PROBLEM.examples.map((example, index) => (
                                            <div key={index} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                                                <div className="space-y-2">
                                                    <div>
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">Input: </span>
                                                        <code className="text-sm bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded">
                                                            {example.input}
                                                        </code>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">Output: </span>
                                                        <code className="text-sm bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded">
                                                            {example.output}
                                                        </code>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">Explanation: </span>
                                                        <span className="text-sm text-slate-600 dark:text-slate-400">{example.explanation}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Constraints</h3>
                                    <ul className="space-y-1">
                                        {SAMPLE_PROBLEM.constraints.map((constraint, index) => (
                                            <li key={index} className="text-sm text-slate-600 dark:text-slate-400">
                                                • {constraint}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Test Cases */}
                        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Test Cases</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {testResults.map((test, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Test Case {index + 1}
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">Input: {test.input}</div>
                                            </div>
                                            <Badge
                                                variant={test.status === "passed" ? "default" : "secondary"}
                                                className={test.status === "passed" ? "bg-green-500 hover:bg-green-600" : ""}
                                            >
                                                {test.status === "passed" ? "PASSED" : "PENDING"}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Panel - Code Editor and Output */}
                    <div className="flex flex-col space-y-4">
                        {/* Code Editor */}
                        <Card className="flex-1 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Code Editor</CardTitle>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={resetCode}
                                            className="hover:bg-slate-100 dark:hover:bg-slate-700 bg-transparent text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
                                        >
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            Reset
                                        </Button>
                                        <Button
                                            onClick={runCode}
                                            disabled={isRunning}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            {isRunning ? "Running..." : "Run Code"}
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="h-[700px] border-t border-slate-200/50 dark:border-slate-700/50">
                                    <MonacoEditor
                                        height="100%"
                                        theme={isDark ? "vs-dark" : "light"}
                                        language={language}
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
                                </div>
                            </CardContent>
                        </Card>

                        {/* Output Panel */}
                        <Card className="h-48 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Output</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-32 overflow-y-auto">
                                    {output ? (
                                        <pre className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap font-mono">
                                            {output}
                                        </pre>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                                            Run your code to see the output here
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
