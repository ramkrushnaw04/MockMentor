

const { DataTypes } = require("sequelize");
const sequelize = require("../config");

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
    unique: true, 
  },
});

// Associations
Problem.hasMany(TestCase, { foreignKey: "problemId", as: "testCases" });
TestCase.belongsTo(Problem, { foreignKey: "problemId" });

// Many-to-Many: Problems <-> Tags
Problem.belongsToMany(Tag, { through: "ProblemTags", as: "tags" });
Tag.belongsToMany(Problem, { through: "ProblemTags", as: "problems" });

module.exports = { Problem, TestCase, Tag };