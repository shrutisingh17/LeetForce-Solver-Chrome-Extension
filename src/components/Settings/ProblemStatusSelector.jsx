import React from "react";
import { updateStorage } from "../../background";

const ProblemStatusSelector = ({ problemStatus, setProblemStatus }) => {

  const problemStatusOptions = {
    all: "All Problems",
    unsolved: "Unsolved",
    solved: "Solved",
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between">
      <label
        className="text-base font-semibold mb-2 md:mb-0 md:mr-4"
        htmlFor="problemStatus"
      >
        {/* Select the type of problems you'd like to solve: */}
        Choose your problem status
      </label>
      <select
        id="problemStatus"
        value={problemStatus}
        onChange={(e) => {
          setProblemStatus(e.target.value);
          updateStorage();
        }}
        className="select py-1 text-sm"
      >
        {Object.keys(problemStatusOptions).map((key) => (
          <option key={key} value={key}>
            {problemStatusOptions[key]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProblemStatusSelector;
