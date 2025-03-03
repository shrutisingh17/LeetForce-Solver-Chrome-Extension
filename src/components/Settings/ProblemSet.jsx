import { updateStorage } from "../../background";

const ProblemSet = ({ problemSet, setProblemSet }) => {
  const problemSetOptions = {
    all: "All Leetcode Problems",
    neetCodeAll: "Neetcode All",
    NeetCode150: "Neetcode 150",
    Blind75: "Blind 75",
    "lg-5htp6xyg": "LeetCode Curated SQL 70",
    "lg-79h8rn6": "Top 100 Liked Questions",
    "lg-wpwgkgt": "Top Interview Questions",
    "lg-o9exaktc": "Tayomide's Questions",
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between">
      <label
        className="text-base font-semibold mb-2 md:mb-0 md:mr-4"
        htmlFor="problemSet"
      >
        Problem Set
      </label>
      <select
        id="problemSet"
        value={problemSet}
        onChange={(e) => {
          setProblemSet(e.target.value);
          updateStorage();
        }}
        className="select py-1 text-sm"
      >
        {Object.keys(problemSetOptions).map((key) => (
          <option key={key} value={key}>
            {problemSetOptions[key]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProblemSet;



// import { updateStorage } from '../../../public/background';
// const ProblemSet = ({ problemSet, setProblemSet }) => {
 
//   const problemSetOptions = [
//     { id: "all", name: "All Leetcode Problems" },
//     { id: "lg-5htp6xyg", name: "LeetCode Curated SQL 70" },
//     { id: "lg-79h8rn6", name: "Top 100 Liked Questions" },
//     { id: "lg-wpwgkgt", name: "Top Interview Questions" },
//     { id: "lg-o9exaktc", name: "Tayomide's Questions" },
//     // Add more options as needed
//   ];
  
//     return (
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
//         <label className="text-base font-semibold mb-2 md:mb-0 md:mr-4" htmlFor="problemSet">
//           Problem Set
//         </label>
//         <select
//           id="problemSet"
//           value={problemSet}
//           onChange={(e) => {
//             setProblemSet(e.target.value);
//             updateStorage(e.target.value);
//           }}
//           className="select"
//         >
//           {problemSetOptions.map(set => (
//             <option key={set} value={set}>{set.name}</option>
//           ))}
//         </select>
//       </div>
//     );
//   };
  
//   export default ProblemSet;
  