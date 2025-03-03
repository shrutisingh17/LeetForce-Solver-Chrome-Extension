import { useEffect } from "react";
import { updateStorage } from "../../background";

const DifficultySelection = ({ difficulty, setDifficulty, disabled, leetCodeProblemSolved }) => {
  const options = {
    all: "All difficulties",
    EASY: "Easy",
    MEDIUM: "Medium",
    HARD: "Hard",
  };

  const handleChange = async (e) => {
    setDifficulty(e.target.value);
    if (!leetCodeProblemSolved) {
      await updateStorage();
    }
  };

  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <label
        className="text-base font-semibold mb-2 md:mb-0 md:mr-4"
        htmlFor="difficultyLevel"
      >
        Choose the difficulty level for your questions:
      </label>
      <select
        id="difficultyLevel"
        value={difficulty}
        onChange={handleChange}
        className="select py-1 text-sm"
      >
        {Object.keys(options).map((key) => (
          <option key={key} value={key}>
            {options[key]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DifficultySelection;
