import { useEffect, useState } from "react";
import { updateStorage } from "../../background";

const NumSelection = ({ numProblems, setNumProblems, disabled }) => {
  const [goalAchieved, setGoalAchieved] = useState(false);
  

  useEffect(() => {
    chrome.storage.sync.get(["leetCodeProblemSolved", "solvedProblemCount"], (result) => {
      setGoalAchieved(result.leetCodeProblemSolved ?? false);
      console.log(result.solvedProblemCount);
    });
  }, []);
  
  const setNewGoal = async (e) => {
    const newGoal = Number(e.target.value);
    setNumProblems(newGoal);
    await chrome.storage.sync.set({ numProblems: newGoal });
    
    if (goalAchieved) {
      updateStorage();
    }
  };
  
  return (
      <div className={`flex justify-between items-center ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
        <div className="flex flex-col">
          <span className="text-base font-semibold text-gray-800">Choose Number of Problems:</span>
          <span className="text-sm text-gray-600">Select the number of problems to tackle at once:</span>
        </div>
        <select
          value={numProblems}
          onChange={setNewGoal} 
          // onChange={(e) => setNumProblems(e.target.value)}
          className="select py-1 text-sm"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
    );
  };
  
  export default NumSelection;
  
