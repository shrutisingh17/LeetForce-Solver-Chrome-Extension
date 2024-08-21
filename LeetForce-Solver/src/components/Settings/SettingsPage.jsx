import { useState, useEffect } from "react";
import { MdOutlineCheckBoxOutlineBlank, MdOutlineCheckBox } from "react-icons/md";
import { IoArrowBackSharp } from "react-icons/io5";
import TopicSelection from "./TopicSelection";
import ProblemSet from "./ProblemSet";
import DifficultySelection from "./DifficultySelection";
import ProblemTypeSelection from "./ProblemTypeSelection";
import NumSelection from "./NumSelection";
import EnableDisableExt from "./EnableDiableExt";

const SettingsPage = ({ setOpenSetting }) => {
  const [disable, setDisable] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [numProblems, setNumProblems] = useState(1);
  const [problemSet, setProblemSet] = useState("all");
  const [problemType, setProblemType] = useState("");
  const [difficulty, setDifficulty] = useState("all");

  const isDailyProblemSet = problemSet === "Leetcode Daily Challenge";
  const isDisabled = isDailyProblemSet ;

  const [leetCodeProblemSolved, setLeetCodeProblemSolved] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(
      "leetCodeProblemSolved",
      ({ leetCodeProblemSolved }) => {
        setLeetCodeProblemSolved(leetCodeProblemSolved);
        // console.log(leetCodeProblemSolved);
      }
    );
  }, []);

   // Load saved preferences from Chrome storage
   useEffect(() => {
    chrome?.storage?.sync.get(["disable", "selectedTags", "numProblems", "problemSet", "problemType", "difficulty"], (result) => {
      setDisable(result.disable ?? false);
      setSelectedTags(result.selectedTags ?? []);
      setNumProblems(result.numProblems ?? 1);
      setProblemSet(result.problemSet ?? "");
      setProblemType(result.problemType ?? "");
      setDifficulty(result.difficulty ?? "");
    });
  }, []);

  // Save preferences to Chrome storage whenever they change
  useEffect(() => {
    chrome?.storage?.sync.set({ disable,selectedTags, numProblems, problemSet, problemType, difficulty, });
  }, [disable, selectedTags, numProblems, problemSet, problemType, difficulty]);

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

      {/* <div className="flex flex-row items-center justify-between mb-6">
        <span className="text-base font-semibold">Disable this extension</span>
        <button
          onClick={() => setDisable(!disable)}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-200 focus:outline-none"
        >
          {!disable ? (
            <MdOutlineCheckBoxOutlineBlank size={24} className="text-gray-600" />
          ) : (
            <MdOutlineCheckBox size={24} className="text-green-600" />
          )}
        </button>
      </div> */}
      <EnableDisableExt />
      <ProblemSet problemSet={problemSet} setProblemSet={setProblemSet} leetCodeProblemSolved={leetCodeProblemSolved}/>
      <NumSelection numProblems={numProblems} setNumProblems={setNumProblems} disabled={isDailyProblemSet} />
      <ProblemTypeSelection problemType={problemType} setProblemType={setProblemType} disabled={isDisabled} />
      <DifficultySelection difficulty={difficulty} setDifficulty={setDifficulty} disabled={isDisabled} leetCodeProblemSolved={leetCodeProblemSolved}/>
      <TopicSelection selectedTags={selectedTags} setSelectedTags={setSelectedTags} disabled={isDisabled} leetCodeProblemSolved={leetCodeProblemSolved}/>
    </>
  );
};

export default SettingsPage;
