import React, { useEffect, useState } from 'react';
import { IoSettingsSharp } from "react-icons/io5";

const HomePage = ({ setOpenSetting }) => {

  const [problemName, setProblemName] = useState('');
  const [problemURL, setProblemURL] = useState('');

  useEffect(() => {
    chrome?.storage?.sync.get(["problemName","problemURL"], (result) => {
      setProblemName(result.problemName ?? "");
      setProblemURL(result.problemURL ?? "")
    });
  }, []);
  
  return (
    <>
      <div className="flex justify-between items-center py-2 px-4 bg-white shadow-md rounded-lg">
        <div className="flex flex-col">
          <span className="text-gray-800 text-lg font-semibold">
            Your LeetCode Extension:{" "}
          </span>
          <span className="text-gray-500 text-sm font-semibold">
            Because Procrastination is an Art!
          </span>
        </div>
        <button onClick={() => setOpenSetting(true)}>
          <IoSettingsSharp size={24} className="text-gray-600" />
        </button>
      </div>
      <div className="flex flex-col items-center my-4">
        <span className="mb-2 text-xl font-semibold">{problemName}</span>
        <button 
         onClick={() => chrome.tabs.create({ url: problemURL })}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
          Solve It
        </button>
      </div>

      <div className="p-4 flex justify-between bg-white shadow-md rounded-lg">
        <div className="text-center">
          <span className="block text-gray-600 text-lg font-medium">
            Current Streak
          </span>
          <span className="block text-2xl font-bold text-blue-500">streak</span>
        </div>
        <div className="text-center">
          <span className="block text-gray-600 text-lg font-medium">
            Best Streak
          </span>
          <span className="block text-2xl font-bold text-green-500">
            streak
          </span>
        </div>
      </div>
    </>
  );
};

export default HomePage;

// const fetchLeetCodeData = async (username) => {
//   const query = {
//     query: `
//       {
//         matchedUser(username: "${username}") {
//           username
//           submitStats: submitStatsGlobal {
//             acSubmissionNum {
//               difficulty
//               count
//               submissions
//             }
//           }
//         }
//       }
//     `
//   };

//   try {
//     const response = await axios.post('http://localhost:3000/api/graphql', query, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     throw error;
//   }
// };

// Example usage:
// fetchLeetCodeData('_Shruti_Singh')
//   .then(data => console.log(data))
//   .catch(error => console.error(error));
