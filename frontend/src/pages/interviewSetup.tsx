import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function InterviewSetup() {
  const [personality, setPersonality] = useState("friendly");
  const [difficulty, setDifficulty] = useState("easy");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Interview Setup</h1>

        {/* Personality */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Interviewer Personality</label>
          <select
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="friendly">Friendly</option>
            <option value="neutral">Neutral</option>
            <option value="strict">Strict</option>
            <option value="mentor">Mentor-like</option>
          </select>
        </div>

        {/* Difficulty */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Difficulty Level</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Submit */}
        <button
          onClick={() => navigate("/interview-room")}
          className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}