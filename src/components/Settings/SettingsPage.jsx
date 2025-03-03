import { useState, useEffect } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import TopicSelection from "./TopicSelection";
import ProblemSet from "./ProblemSet";
import DifficultySelection from "./DifficultySelection";
import NumSelection from "./NumSelection";
import EnableDisableExt from "./EnableDisableExt";
import ProblemStatusSelector from "./ProblemStatusSelector";

const SettingsPage = ({ setOpenSetting }) => {
  const [disable, setDisable] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [numProblems, setNumProblems] = useState(1);
  const [problemSet, setProblemSet] = useState("all");
  const [problemType, setProblemType] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [problemStatus, setProblemStatus] = useState("all");

  const isDailyProblemSet = problemSet === "Leetcode Daily Challenge";
  const isDisabled = isDailyProblemSet ;

  const [leetCodeProblemSolved, setLeetCodeProblemSolved] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(
      "leetCodeProblemSolved",
      ({ leetCodeProblemSolved }) => {
        setLeetCodeProblemSolved(leetCodeProblemSolved);
      }
    );
  }, []);

   // Load saved preferences from Chrome storage
   useEffect(() => {
    chrome?.storage?.sync.get(["disable", "selectedTags", "numProblems", "problemSet", "problemType", "difficulty", "problemStatus"], (result) => {
      setDisable(result.disable ?? false);
      setSelectedTags(result.selectedTags ?? []);
      setNumProblems(result.numProblems ?? 1);
      setProblemSet(result.problemSet ?? "");
      setProblemType(result.problemType ?? "");
      setDifficulty(result.difficulty ?? "");
      setProblemStatus(result.problemStatus ?? "all"); // Set default to "all"
    });
  }, []);

  // Save preferences to Chrome storage whenever they change
  useEffect(() => {
    chrome?.storage?.sync.set({ disable, selectedTags, problemSet, problemType, difficulty, problemStatus });
  }, [disable, selectedTags, problemSet, problemType, difficulty, problemStatus]);
  // console.log("numProblems", numProblems)

  return (
    <>
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-300">
        <button
          onClick={() => setOpenSetting(false)}
          className="flex items-center text-sm text-blue-500 hover:text-blue-600"
        >
          <IoArrowBackSharp size={18} />
          <span className="ml-1 font-semibold">Back to Home</span>
        </button>
        <h1 className="text-xl font-bold text-gray-800">Settings</h1>
      </div>

      <div className ="flex flex-col gap-4">
        <EnableDisableExt />
        <NumSelection numProblems={numProblems} setNumProblems={setNumProblems} disabled={isDailyProblemSet} />
        <ProblemSet problemSet={problemSet} setProblemSet={setProblemSet} leetCodeProblemSolved={leetCodeProblemSolved}/>
        <DifficultySelection difficulty={difficulty} setDifficulty={setDifficulty} disabled={isDisabled} leetCodeProblemSolved={leetCodeProblemSolved}/>
        <TopicSelection selectedTags={selectedTags} setSelectedTags={setSelectedTags} disabled={isDisabled} leetCodeProblemSolved={leetCodeProblemSolved}/>
        <ProblemStatusSelector problemStatus={problemStatus} setProblemStatus={setProblemStatus}/>
      </div>
    </>
  );
};

export default SettingsPage;
