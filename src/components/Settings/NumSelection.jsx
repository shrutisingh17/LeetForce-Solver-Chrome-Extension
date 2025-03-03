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
  
  //   const handleNormalChange = (e) => {
  //     setNumProblems(Number(e.target.value));
  //   };
    
  // const setNewGoal = async (e) => {
  //   const newGoal = Number(e.target.value);
  //   setNumProblems(newGoal);
  //   await chrome.storage.sync.set({ numProblems: newGoal });
  //   updateStorage();
  // };
  
  const setNewGoal = async (e) => {
    const newGoal = Number(e.target.value);
    setNumProblems(newGoal);
    await chrome.storage.sync.set({ numProblems: newGoal });
    
    // Update storage only if goalAchieved is true
    if (goalAchieved) {
      updateStorage();
      // chrome.storage.sync.get(["problemName", "problemURL"], (result) => {
      //   setProblemName(result.problemName ?? "");
      //   setProblemURL(result.problemURL ?? "");
      //   // setGoalAchieved(false); 
      // });
    }
  };

  // const setNewGoal = async (e) => {
  //   const newGoal = Number(e.target.value);
  //   setNumProblems(newGoal);
  //   await chrome.storage.sync.set({ numProblems: newGoal });
  
  //   if (goalAchieved) {
  //     setGoalAchieved(false); // Ensure re-render happens first
  //   }
  // };
  
  // // Trigger updateStorage only after goalAchieved changes
  // useEffect(() => {
  //   if (!goalAchieved) {
  //     updateStorage();
  //   }
  // }, [goalAchieved]);
  
  
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
  