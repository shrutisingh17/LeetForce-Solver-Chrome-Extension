import React, { useEffect, useState } from 'react';
import { IoSettingsSharp } from "react-icons/io5";
import { updateStorage } from '../background';

const HomePage = ({ setOpenSetting }) => {

  const [problemName, setProblemName] = useState('');
  const [problemURL, setProblemURL] = useState('');
  const [currentStreak, setCurrentStreak] = useState('');
  const [bestStreak, setBestStreak] = useState('');
  const [goalAchieved, setGoalAchieved] = useState(false);


  useEffect(() => {
    chrome.storage.sync.get(["problemName", "problemURL", "currentStreak", "bestStreak", "numProblems", "leetCodeProblemSolved"], (result) => {
      setProblemName(result.problemName ?? "");
      setProblemURL(result.problemURL ?? "");
      setCurrentStreak(result.currentStreak);
      setBestStreak(result.bestStreak);
      setGoalAchieved(result.leetCodeProblemSolved);
    });
  }, []);

  const handleSolveAnotherProblem = async () => {
    updateStorage();
  }

  useEffect(() => {
    const handleStorageChange = (changes, namespace) => {
      if (namespace === "sync") {
        if (changes.problemName) {
          setProblemName(changes.problemName.newValue ?? "");
        }
        if (changes.problemURL) {
          setProblemURL(changes.problemURL.newValue ?? "");
        }
        if (changes.leetCodeProblemSolved) {
          setGoalAchieved(changes.leetCodeProblemSolved.newValue ?? false);
        }
      }
    };
  
    // Add listener for storage changes
    chrome.storage.onChanged.addListener(handleStorageChange);
  
    // Fetch initial values
    chrome.storage.sync.get(["problemName", "problemURL", "leetCodeProblemSolved"], (result) => {
      setProblemName(result.problemName ?? "");
      setProblemURL(result.problemURL ?? "");
      setGoalAchieved(result.leetCodeProblemSolved ?? false);
    });
      return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);
  
  return (
    <>
      <div className=" flex justify-between items-center py-2 px-4 bg-white shadow-md rounded-lg">
        <div className="flex flex-col">
          <span className="text-gray-800 text-lg font-semibold">
            Your LeetCode Extension:{" "}
          </span>
          <span className="text-gray-500 text-sm font-semibold">
            LeetForce - Stop escaping, start solving!
          </span>
        </div>

        <button onClick={() => setOpenSetting(true)}>
          <IoSettingsSharp size={24} className="text-gray-600" />
        </button>
      </div>

      {goalAchieved ? (
        <div className="flex flex-col items-center my-4">
          <span className="my-2 text-xl font-semibold text-green-600">
            You’ve reached today’s goal!
          </span>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSolveAnotherProblem}
              className="px-4 py-2 rounded-lg shadow-md bg-blue-500 text-white hover:bg-blue-600"
            >
              Solve Another Problem
            </button>
            <button
              onClick={() => setOpenSetting(true)}
              className="px-4 py-2 rounded-lg shadow-md bg-gray-500 text-white hover:bg-gray-600"
            >
              Set New Goal
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center my-4">
          <span className="my-2 text-xl font-semibold">{problemName}</span>
          <button
            onClick={() => problemURL && chrome.tabs.create({ url: problemURL })}
            disabled={!problemURL}
            className={`mt-2 mb-3 px-4 py-2 rounded-lg shadow-md bg-blue-500 text-white text-base
            ${!problemURL ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600"}`}
          >
            Solve It
          </button>
        </div>
      )}

      <div className="p-4 flex justify-between bg-white shadow-md rounded-lg">
        <div className="text-center">
          <span className="block text-gray-600 text-lg font-medium">
            Current Streak
          </span>
          <span className="block text-2xl font-bold text-blue-500">{currentStreak}</span>
        </div>
        <div className="text-center">
          <span className="block text-gray-600 text-lg font-medium">
            Best Streak
          </span>
          <span className="block text-2xl font-bold text-green-500">
            {bestStreak}
          </span>
        </div>

      </div>
    </>
  );
};

export default HomePage;