export const getProblemUrl = async () => {
  const result = await chrome.storage.sync.get("problemURL");
  return result.problemURL;
};
export const getProblemName = async () => {
  const result = await chrome.storage.sync.get("problemName");
  return result.problemName;
};

export const getProblemSet = async () => {
  const result = await chrome.storage.sync.get("problemSets");
  return result.problemSets ?? "all";
};

export const getDifficulty = async () => {
  const result = await chrome.storage.sync.get("difficulty");
  return result.difficulty ?? "all";
};

export const getIncludePremium = async () => {
  const result = await chrome.storage.sync.get("includePremium");
  return Boolean(result.includePremium) ?? false;
};

export const getProblemSolved = async () => {
  const result = await chrome.storage.sync.get("leetCodeProblemSolved");
  return Boolean(result.leetCodeProblemSolved) ?? false;
};

export const getSolvedProblems = async () => {
  const result = await chrome.storage.sync.get("solvedProblems");
  return result.solvedProblems ?? [];
};

export const getNumProblem = async () => {
  const result = await chrome.storage.sync.get("numProblems");
  return (result.numProblems);
};

export const getEnableRedirectOnEveryProblem = async () => {
  const result = await chrome.storage.sync.get("enableRedirectOnEveryProblem");
  return !(result.enableRedirectOnEveryProblem);
};

export const initiateLoading = async () => {
  await chrome.storage.sync.set({ loading: true });
};

export const stopLoading = async () => {
  await chrome.storage.sync.set({ loading: false });
};

export async function updateProblem(problem, isSolved) {
  // console.log('Storing Problem:', problem.name, problem.url);
  return Promise.all([
    chrome.storage.sync.set({ problemURL: problem.url }),
    chrome.storage.sync.set({ problemName: problem.name }),
    chrome.storage.sync.set({ leetCodeProblemSolved: isSolved }),
    chrome.storage.sync.get(null, function(items) {
      console.log(items); // Logs all stored key-value pairs
  })
  
  ]);
}

export async function updateSolvedProblems(solvedProblems){
  // console.log('solvedProblems:', solvedProblems)
  await chrome.storage.sync.set({ solvedProblems: solvedProblems })
}
export async function updateStreak() {

    const [_, lastCompletion] = await Promise.all([
      chrome.storage.sync.set({ leetCodeProblemSolved: true }),
      // Since the function is responsible for tracking streaks, it assumes that when it's called, the problem has been solved, so it directly updates "leetCodeProblemSolved" as true.
      // updateProblemSolvedState(true),
      getLastCompletion()
    ]);
    const now = new Date();

    if (lastCompletion.toDateString() === now.toDateString()) return;

    const [bestStreak, currentStreak] = await Promise.all([
      chrome.storage.sync.get("bestStreak"),
      chrome.storage.sync.get("currentStreak"),
    ]);
    console.log(bestStreak);
    console.log(currentStreak);

    const newStreak = (Number(currentStreak.currentStreak) || 0) + 1;
    const best = Number(bestStreak.bestStreak) || 0;

    await chrome.storage.sync.set({ currentStreak: newStreak });
    await chrome.storage.sync.set({ lastCompleted: now.toDateString() });
    if (newStreak > best) {
      await chrome.storage.sync.set({ bestStreak: newStreak });
    }
}

// Reset problem streaks
export async function resetStreak() {
  await chrome.storage.sync.set({ currentStreak: 0 });
}

// Fetch the last completion date
export async function getLastCompletion() {
  const result = await chrome.storage.sync.get("lastCompleted");
  return result.lastCompleted ? new Date(result.lastCompleted) : new Date(0);
}

// Check if the current submission URL indicates a successful problem submission
export function isSubmissionSuccessURL(url) {
  return url.includes("/submissions/detail/") && url.includes("/check/");
}