import React, { useEffect, useState } from "react";

// Ensure that the configuration matches your target URL
const messages = {
  java: { message: "Java language message" },
  python: { message: "Python language message" },
  // Add other languages as needed
};

const CongratulationsModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [language, setLanguage] = useState("");

  // useEffect(() => {
  //   const handleClick = (event) => {
  //     let currentTarget = event.target;
  //     while (currentTarget) {
  //       if (
  //         currentTarget.matches(
  //           'button[data-e2e-locator="console-submit-button"]'
  //         )
  //       ) {
  //         chrome.runtime.sendMessage({ action: "userClickedSubmit" });
  //       }
  //       currentTarget = currentTarget.parentElement;
  //     }
  //   };

  //   const handleMessage = (message, sender, sendResponse) => {
  //     if (message.action === "userSolvedProblem") {
  //       setShowModal(true);
  //       setLanguage(message.language);
  //     }
  //   };

  //   document.addEventListener("click", handleClick);
  //   chrome.runtime.onMessage.addListener(handleMessage);

  //   return () => {
  //     document.removeEventListener("click", handleClick);
  //     chrome.runtime.onMessage.removeListener(handleMessage);
  //   };
  // }, []);

  useEffect(() => {
    const handleCustomEvent = (event) => {
      setLanguage(event.detail);
      setShowModal(true);
    };

    window.addEventListener("userSolvedProblem", handleCustomEvent);

    return () => {
      window.removeEventListener("userSolvedProblem", handleCustomEvent);
    };
  }, []);


  return (
    showModal && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-w-sm">
          <h1 className="text-2xl font-bold mb-4">Congratulations! You've solved the problem!</h1>
          <h3 className="text-lg mb-4">{messages[language]?.message}</h3>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default CongratulationsModal;



// import React, { useEffect, useState } from "react";

// const CongratulationsModal = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [language, setLanguage] = useState("");

//   useEffect(() => {
//     const handleUserSolvedProblem = (event) => {
//       console.log("Custom event received:", event.detail);
//       setShowModal(true);
//       setLanguage(event.detail);
//     };
  
//     window.addEventListener("userSolvedProblem", handleUserSolvedProblem);
  
//     return () => {
//       window.removeEventListener("userSolvedProblem", handleUserSolvedProblem);
//     };
//   }, []);
  

//   return (
//     showModal && (
//       <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-w-sm">
//           <h1 className="text-2xl font-bold mb-4">Congratulations! You've solved the problem!</h1>
//           <h3 className="text-lg mb-4">You solved it using {language}!</h3>
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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

