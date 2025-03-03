import axios from "axios";

export async function getProblemListFromLeetCodeAPI(difficulty, problemSet, selectedTags) {
  
const formattedProblemSet = problemSet.startsWith("lg-")
  ? problemSet.replace("lg-", "") // Remove "lg-"
  : problemSet;

  // console.log("Final Filters Applied:", filters);
  try {
        const query = `
        query problemsetQuestionList {
          problemsetQuestionList: questionList(
            categorySlug: ""
            limit: -1
            skip: 0
           
            filters: {
              ${difficulty && difficulty !== "all" ? `difficulty: ${difficulty}` : ""}
              ${formattedProblemSet?.length ? `listId: "${formattedProblemSet}"` : ""}
              ${
                formattedProblemSet === "all" && selectedTags?.length
                  ? `tags: [${selectedTags.map(slug => `"${slug}"`).join(", ")}]`
                  : ""
              }
            }
          ) {
            questions: data {
              acRate
              difficulty
              freqBar
              frontendQuestionId: questionFrontendId
              isFavor
              paidOnly: isPaidOnly
              status
              title
              titleSlug
              topicTags {
                name
                id
                slug
              }
              hasSolution
              hasVideoSolution
            }
          }
        }
      `;      
  
      const body = { query };
  
      const response = await axios.post(
        "http://localhost:3000/api/graphql",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = response.data;
      const leetCodeProblems = responseData.data.problemsetQuestionList.questions;
      // console.log(leetCodeProblems)

      const filteredLeetCodeProblems = leetCodeProblems.filter(
        (problem) => !problem.paidOnly
      );
      
      return filteredLeetCodeProblems;
    } catch (error) {
      console.log(error.toString());
      return [];
    }
  }
  
  export async function getLeetCodeProblemFromProblemSet(difficulty, problemSet) {
    try {
      const includePremium = await chrome.storage.sync.get("includePremium");
      const problemSetURLs = {
        neetCodeAll: "/leetcode-problems/neetCodeAll.json",
        NeetCode150: "/leetcode-problems/neetCode150.json",
        Blind75: "/leetcode-problems/blind75.json",
      };
      const res = await fetch(chrome.runtime.getURL(problemSetURLs[problemSet]));
      const leetCodeProblems = await res.json();
      
      const filteredLeetCodeProblems = leetCodeProblems.filter((problem) => {
        if (!problem.href.endsWith("/")) {
          problem.href += "/";
        }
        return (
          (includePremium || !problem.isPremium) &&
          (difficulty === "all" ||
            problem.difficulty.toLowerCase() === difficulty.toLowerCase())
        );
      });

      return filteredLeetCodeProblems;

    } catch (error) {
      console.error(error);
      return null;
    }
  }
  