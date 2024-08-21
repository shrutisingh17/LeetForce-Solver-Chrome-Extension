import {
  getProblemListFromLeetCodeAPI,
  getLeetCodeProblemFromProblemSet,
} from "./problemFetcher.js";

// Function to generate a random LeetCode problem
export async function generateRandomLeetCodeProblem() {
  try {
    const { problemSet, difficulty, selectedTags } =
      await chrome.storage.sync.get([
        "problemSet",
        "difficulty",
        "selectedTags",
      ]);

    if (problemSet === "all"  || problemSet.startsWith("lg")) {
      const leetCodeProblems = await getProblemListFromLeetCodeAPI(
        difficulty,
        problemSet,
        selectedTags
      );

      const randomIndex = Math.floor(Math.random() * leetCodeProblems.length);
      let randomProblem =
        leetCodeProblems[randomIndex];

    //   Ensure it's not a paid problem
      while (randomProblem?.paidOnly) {
        randomProblem =
          leetCodeProblems[
            (leetCodeProblems.length + randomIndex) %
              leetCodeProblems.length
          ];
      }

      const randomProblemURL = `https://leetcode.com/problems/${randomProblem?.titleSlug}/`;
      const randomProblemName = randomProblem?.title;
      
      return { url: randomProblemURL, name: randomProblemName };
    } else {
      return await getLeetCodeProblemFromProblemSet(difficulty, problemSet);
    }
  } catch (error) {
    console.error("Error generating random problem", error);
    return null;
  } finally {
    await chrome.storage.sync.set({ loading: false });
  }
}

// generateRandomLeetCodeProblem();


// updateStorage();
