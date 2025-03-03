import {
  getProblemListFromLeetCodeAPI,
  getLeetCodeProblemFromProblemSet,
} from "./problemFetcher.js";

// {category: 'Stack', href: 'https://leetcode.com/problems/min-stack/', text: 'Min Stack', difficulty: 'Medium', isPremium: false}


export async function generateRandomLeetCodeProblem() {
  try {
    const { problemSet, difficulty, selectedTags, problemStatus } =
      await chrome.storage.sync.get(["problemSet", "difficulty", "selectedTags", "problemStatus"]);

    const solvedProblems = (await chrome.storage.sync.get("solvedProblems"))
      .solvedProblems || [];

    let leetCodeProblems;

    if (problemSet === "all" || problemSet.startsWith("lg")) {
      leetCodeProblems = await getProblemListFromLeetCodeAPI(
        difficulty,
        problemSet,
        selectedTags
      );
    } else {
      leetCodeProblems = await getLeetCodeProblemFromProblemSet(difficulty, problemSet);
    }
    console.log("Fetched Problems:", leetCodeProblems); // ✅ Log Here

    const filteredProblems = leetCodeProblems?.filter((problem) => {
      const problemTitle = problem.text || problem.title; // Handle both cases
      if (problemStatus === "unsolved") {
        return !solvedProblems.includes(problemTitle);
      } else if (problemStatus === "solved") {
        return solvedProblems.includes(problemTitle);
      }
      return true; // No filtering for "all"
    });

    if (!filteredProblems || filteredProblems.length === 0) {
      console.log("No problems match the selected filters.");
      return { url: "", name: "No problems match the selected filters." };
    }

    const randomIndex = Math.floor(Math.random() * filteredProblems?.length);
    const randomProblem = filteredProblems[randomIndex];

    // Creating the Problem Link
    //for neetcode problems - href and text
    const randomProblemURL = randomProblem.href  
      ? randomProblem.href
      : `https://leetcode.com/problems/${randomProblem.titleSlug}/`;
    const randomProblemName = randomProblem.text || randomProblem.title || "Unknown Problem";

    return { url: randomProblemURL, name: randomProblemName };
  } catch (error) {
    console.error("Error generating random problem", error);
    return null;
  } finally {
    await chrome.storage.sync.set({ loading: false });
  }
}