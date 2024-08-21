import { useState, useEffect } from 'react'
import './App.css'
import HomePage from './components/HomePage'
import SettingsPage from './components/Settings/SettingsPage'
import axios from 'axios'
import CongratulationsModal from '../public/Modal/CongratulationsModal '

function App() {
  const [openSetting, setOpenSetting] = useState(false);

  return (
    <div className='w-96 p-6 m-2 bg-gray-50 min-h-screen rounded-lg shadow-2xl'>
      <CongratulationsModal />  
      {openSetting ? <SettingsPage setOpenSetting = {setOpenSetting} /> :
      <HomePage setOpenSetting = {setOpenSetting} />
      }
    </div>
  )
}

export default App


// async function fetchProblemOfTheDay() {
//   const query = `
//     query questionOfToday {
//       activeDailyCodingChallengeQuestion {
//         date
//         userStatus
//         link
//         question {
//           acRate
//           difficulty
//           questionFrontendId
//           title
//           titleSlug
//           hasVideoSolution
//           hasSolution
//           topicTags {
//             name
//             id
//             slug
//           }
//         }
//       }
//     }
//   `;
//   try {
//     const response = await axios.post("http://localhost:3000/api/graphql", {
//       query,
//     });
//     setProblem(response.data.data.activeDailyCodingChallengeQuestion.question);
//   } catch (error) {
//     console.error('Error fetching problem of the day:', error);
//     throw error;
//   }
// } 
// async function fetchRandomQuestion(difficulty, tags) {
//   //If difficulty or tags are not selected, those fields are simply omitted from the filters object, 
//   const filters = {};
//   if (difficulty) {
//     filters.difficulty = difficulty;
//   }
//   if (tags && tags.length > 0) {
//     filters.tags = tags;
//   }

//   // Step 1: Fetch the total number of questions
//   const totalQuery = {
//     query: `
//         query problemsetQuestionList($categorySlug: String, $filters: QuestionListFilterInput) {
//             problemsetQuestionList: questionList(categorySlug: $categorySlug, filters: $filters) {
//                 total: totalNum
//                 questions: data {
//                     difficulty
//                     frontendQuestionId: questionFrontendId
//                     title
//                     titleSlug
//                     topicTags {
//                         name
//                         id
//                         slug
//                     }
//                 }
//             }
//         }
//     `,
//     variables: {
//       categorySlug: "",
//       filters: filters,
//     },
//   };

//   try {
//     const totalResponse = await axios.post(
//       "http://localhost:3000/api/graphql",
//       totalQuery,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // console.log('Total Response:', totalResponse.data.data.problemsetQuestionList.questions.length);
//     const totalQuestions =
//       totalResponse.data.data.problemsetQuestionList.questions.length;

//     if (totalQuestions === 0) {
//       return null; // No questions available
//     }

//     // Step 2: Generate a random skip value
//     const randomSkip = Math.floor(Math.random() * totalQuestions);

//     // Step 3: Fetch a random question using the random skip value
//     const query = {
//       query: `
//               query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
//                 problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
//                   total: totalNum
//                   questions: data {
//                     difficulty
//                     frontendQuestionId: questionFrontendId
//                     title
//                     titleSlug
//                     topicTags {
//                       name
//                       id
//                       slug
//                     }
//                   }
//                 }
//               }
//           `,
//       variables: {
//         categorySlug: "",
//         skip: randomSkip,
//         limit: 1,
//         filters: filters,
//       },
//     };

//     const response = await axios.post(
//       "http://localhost:3000/api/graphql",
//       query,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log(response.data.data.problemsetQuestionList.questions[0].title)
//   } catch (error) {
//     console.error("Error fetching random question:", error);
//     return null;
//   }
// }