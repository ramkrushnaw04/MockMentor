

import { DataTypes } from "sequelize"
import sequelize from "../config/databaseConfig"

// Problem model
const Problem = sequelize.define("Problem", {
  title: { type: DataTypes.STRING, allowNull: false },
  statement: { type: DataTypes.TEXT, allowNull: false },
  inputFormat: { type: DataTypes.TEXT, allowNull: false },
  outputFormat: { type: DataTypes.TEXT, allowNull: false },
  constraints: { type: DataTypes.TEXT, allowNull: false },
  difficulty: {
    type: DataTypes.ENUM("Easy", "Medium", "Hard"),
    defaultValue: "Medium",
  },
});

// TestCase model
const TestCase = sequelize.define("TestCase", {
  input: { type: DataTypes.STRING, allowNull: false },
  expectedOutput: { type: DataTypes.STRING, allowNull: false },
  explanation: { type: DataTypes.TEXT, allowNull: true }, // optional
});

// Tag model
const Tag = sequelize.define("Tag", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: "tagNameUnique", 
  },
});

// Associations
Problem.hasMany(TestCase, { foreignKey: "problemId", as: "testCases" });
TestCase.belongsTo(Problem, { foreignKey: "problemId" });

// Many-to-Many: Problems <-> Tags
Problem.belongsToMany(Tag, { through: "ProblemTags", as: "tags" });
Tag.belongsToMany(Problem, { through: "ProblemTags", as: "problems" });

export { Problem, TestCase, Tag };




// types 
export type testCaseType = {
    input: string,
    expectedOutput: string
}

export type tagType = {
    name: string
}

export type problemType = {
    title: string,
    statement: string,
    inputFormat: string,
    outputFormat: string,
    constraints: string,
    difficulty: "Easy" | "Medium" | "Hard",
    testCases: testCaseType[]
    tags: tagType[]
}