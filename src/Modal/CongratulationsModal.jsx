import React, { useEffect, useState } from "react";

const ProgressBar = ({ progress }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => setAnimatedProgress(progress), 100);
  }, [progress]);

  return (
    <div className="m-4 bg-gray-300 rounded-full overflow-hidden">
      <div
        className="h-2 bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 ease-in-out"
        // style={{ width: `${animatedProgress}%` }}
        style={{ transform: `translateX(${animatedProgress - 100}%)` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemax="100"
        aria-valuemin="0"
      ></div>
    </div>
  );
};

const CongratulationsModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [goalProgress, setGoalProgress] = useState(0);
  const [problemName, setProblemName] = useState("");
  const [problemURL, setProblemURL] = useState("");

  useEffect(() => {
    
    // ✅ Handle button click to detect "Submit" button interaction
    const handleClick = (event) => {
      let currentTarget = event.target;
      while (currentTarget) {
        if (
          currentTarget.matches(
            'button[data-e2e-locator="console-submit-button"]'
          )
        ) {
          chrome.runtime.sendMessage(
            { action: "userClickedSubmit" },
            (response) => {
              console.log("Response from background:", response);
            }
          );
          break; // Exit loop once we find the button
        }
        currentTarget = currentTarget.parentElement;
      }
    };

    // ✅ Listen for messages from `content.js` or `background.js`
    const handleMessage = (message, sender, sendResponse) => {
      console.log("Message received in CongratulationsModal:", message);

      if (message.action === "userSolvedProblem") {
        const language = message.language || "an unknown language";
        sendResponse({ status: "received" });
        setShowModal(true);

        // ✅ Fetch latest values from Chrome storage
        chrome.storage.sync.get(
          ["solvedProblemCount", "numProblems", "problemName", "problemURL"],
          (result) => {
            const latestSolved = result.solvedProblemCount || 0;
            const latestNum = result.numProblems || 1;

            console.log("congratulations", latestSolved, latestNum);

            setProblemName(result.problemName ?? "");
            setProblemURL(result.problemURL ?? "");

            const progress = Math.min((latestSolved / latestNum) * 100, 100);
            setGoalProgress(progress);

            const newMessage = {
              main: `Great job! You solved this problem using ${language}.`,
              subtext:
                latestSolved % latestNum === 0 && latestSolved > 0
                  ? "You've reached your goal. Keep up the amazing work!"
                  : `You've solved ${latestSolved} out of ${latestNum} problems. Stay consistent and keep pushing forward!`,
            };

            setMessage(newMessage);            
          }
        );
        return true;
        // setMessage(messages[message.language]?.message || "Congratulations on solving the problem!");
      }
    };

    // Add event listeners
    document.addEventListener("click", handleClick);
    chrome.runtime.onMessage.addListener(handleMessage);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("click", handleClick);
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    showModal && (
      <>
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-w-sm">
            <h1 className="mb-2 text-3xl font-extrabold text-green-600 flex items-center justify-center gap-2">
              Congratulations!
            </h1>
            <span className="mt-4 text-base font-semibold text-blue-600 text-center">
              {message.main}
            </span>
            <br />
            <div className="mt-5">
              <ProgressBar progress={goalProgress} />
              <p className="text-lg text-gray-700 mt-3 text-center">
                {message.subtext}
              </p>
            </div>
            {/* <p className="text-gray-700 mt-3 text-center">{message}</p> */}

            {goalProgress !== 100 && (
              <div className="flex flex-col items-center my-4">
                <p className="text-gray-700 mt-3 text-center">
                  Solve the next question to reach your goal.
                </p>
                <span className="mb-2 text-lg font-bold">
                  {problemName}
                </span>
                <button
                  onClick={() => {
                    chrome.runtime.sendMessage({
                      action: "openTab",
                      url: problemURL,
                    });
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                >
                  Solve It
                </button>
              </div>
            )}
            <button
              className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </>
    )
  );
};

export default CongratulationsModal;

// To prevent cheating, you should track the original goal (numProblems) set at the start of the day and not allow it to be lowered once a problem has been solved.

// Fix: Prevent Streak Manipulation
// Store numProblems in chrome.storage.sync when the day starts (first problem attempt).
// Don't allow numProblems to be decreased once a problem is solved that day.
// Use the stored numProblems value to check if the streak continues instead of the latest modified value.
// This way, users must meet their original goal and can’t lower it to keep their streak after failing to reach their initial goal.

// import React, { useState, useEffect } from "react";

// const messages = {
//   java: { message: "Well done solving with Java!" },
//   python: { message: "Great job solving with Python!" },
//   javascript: { message: "Amazing work using JavaScript!" },
// };

// const CongratulationsModal = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [message, setMessage] = useState("");
//   const [solvedProblemCount, setSolvedProblemCount] = useState(0);
//   const [numProblems, setNumProblems] = useState(1);

//   useEffect(() => {
//     // Fetch solved problems count and milestone
//     chrome?.storage?.sync.get(["numProblems", "solvedProblemCount"], (result) => {
//       const numProblems = result.numProblems;
//       const solved = result.solvedProblemCount;
//       setSolvedProblemCount(solved);
//       setNumProblems(numProblems);
//     });
//   }, []);

//   useEffect(() => {
//     console.log(solvedProblemCount, numProblems);
//   }, [solvedProblemCount, numProblems]);

//   useEffect(() => {
//     const handleCustomEvent = (event) => {
//       const language = event.detail; // Custom event detail containing the language
//       // setMessage(messages[language]?.message || "Congratulations on solving the problem!");
//       // Check milestone
//       if (solvedProblemCount % numProblems === 0 && solvedProblemCount > 0) {
//         setMessage(messages[language]?.message || "Congratulations on solving the problem!");
//         // setShowModal(true);
//       }
//       else{
//         setMessage(`Awesome! You've solved ${solvedProblemCount} out of ${numProblems} problems! Keep going!`);
//         // setShowModal(true);
//       }
//       setShowModal(true);
//     };

//     window.addEventListener("userSolvedProblem", handleCustomEvent);

//     return () => {
//       window.removeEventListener("userSolvedProblem", handleCustomEvent);
//     };
//   }, []);

//   return (
//     showModal && (
//       <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-w-sm">
//           <h1 className="text-2xl font-bold mb-4">Congratulations!</h1>
//           <h3 className="text-lg mb-4">{message}</h3>
//           <button
//             className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
//             onClick={() => setShowModal(false)}
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     )
//   );
// };

// export default CongratulationsModal;

// // A message like: “Great job! You’ve solved all your problems for today!”
// // Current streak details (e.g., “Your current streak: 5 days”).
// // Encouragement (e.g., “Keep up the great work!”).

// const messages = {
//   java: { message: "Well done solving with Java!" },
//   python: { message: "Great job solving with Python!" },
//   javascript: { message: "Amazing work using JavaScript!" },
// };
