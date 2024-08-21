
// export const getStoredProblem = async () => {
//   try {
//     const result = await chrome.storage.sync.get(['problemName', 'problemURL']);
//     return { name: result.problemName, url: result.problemURL };
//   } catch (error) {
//     console.error('Error fetching stored problem:', error);
//     return null;
//   }
// };


// Utility functions for accessing chrome storage
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

export const initiateLoading = async () => {
  await chrome.storage.sync.set({ loading: true });
};

export const stopLoading = async () => {
  await chrome.storage.sync.set({ loading: false });
};

export const getNumProblem = async () => {
  const result = await chrome.storage.sync.get("numProblems");
  return (result.numProblems);
};

export const getEnableRedirectOnEveryProblem = async () => {
  const result = await chrome.storage.sync.get("enableRedirectOnEveryProblem");
  return !(result.enableRedirectOnEveryProblem);
};

export async function updateProblem(problem, isSolved) {
  // console.log('Storing Problem:', problem.name, problem.url);
  return Promise.all([
    chrome.storage.sync.set({ problemURL: problem.url }),
    chrome.storage.sync.set({ problemName: problem.name }),
    chrome.storage.sync.set({ problemDate: new Date().toDateString() }),
    chrome.storage.sync.set({ leetCodeProblemSolved: isSolved }),
    chrome.storage.sync.get(null, function(items) {
      var allKeys = Object.keys(items);
      console.log(allKeys);
  })
  ]);
}

// Update whether the problem redirection is enabled
export async function updateEnableRedirectOnEveryProblem(enabled) {
  await chrome.storage.sync.set({ enableRedirectOnEveryProblem: enabled });
}
// updateEnableRedirectOnEveryProblem(false);

// Update the permissions enabled state
export async function updatePermissions(enabled) {
  await chrome.storage.sync.set({ permissionsEnabled: enabled });
}

// Manage problem streaks based on the mode
export async function updateStreak() {

    const [_, lastCompletion] = await Promise.all([
      chrome.storage.sync.set({ leetCodeProblemSolved: true }),
      getLastCompletion()
    ]);
    const now = new Date();

    if (lastCompletion.toDateString() === now.toDateString()) return;

    const [bestStreak, currentStreak] = await Promise.all([
      chrome.storage.sync.get("bestStreak"),
      chrome.storage.sync.get("currentStreak"),
    ]);

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

export async function resetHyperTortureStreak() {
  await chrome.storage.sync.set({ HT_currentStreak: 0 });
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

// Send a message to notify the content script that the user solved a problem
export function sendUserSolvedMessage(languageUsed) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "userSolvedProblem",
      language: languageUsed,
    });
  });
}

// Send a message to notify the content script that the user failed a problem
export function sendUserFailedMessage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "userFailedProblem",
    });
  });
}


// Update the problem solved state in storage
// async function updateProblemSolvedState(isSolved) {
//   await chrome.storage.sync.set({ leetCodeProblemSolved: isSolved });
// }


// Update problem details and solved state
// export async function updateProblem(problem, isSolved) {
//   console.log('Storing Problem:', problem.name, problem.url);
//   return Promise.all([
//     chrome.storage.sync.set({ problemURL: problem.url }),
//     chrome.storage.sync.set({ problemName: problem.name }),
//     chrome.storage.sync.set({ problemDate: new Date().toDateString() }),
//     updateProblemSolvedState(isSolved),
//   ]);
// }

// export const getHyperTortureMode = async () => {
//   const result = await chrome.storage.sync.get("hyperTortureMode");
//   return !!result.hyperTortureMode;
// };

// export async function updateStreak() {
//   if (await getHyperTortureMode()) {
//     const [HT_bestStreak, HT_currentStreak] = await Promise.all([
//       chrome.storage.sync.get("HT_bestStreak"),
//       chrome.storage.sync.get("HT_currentStreak"),
//     ]);

//     const HT_newStreak = (Number(HT_currentStreak.HT_currentStreak) || 0) + 1;
//     const HT_best = Number(HT_bestStreak.HT_bestStreak) || 0;

//     await chrome.storage.sync.set({ HT_currentStreak: HT_newStreak });
//     if (HT_newStreak > HT_best) {
//       await chrome.storage.sync.set({ HT_bestStreak: HT_newStreak });
//     }
//   } else {
//     const [_, lastCompletion] = await Promise.all([
//       chrome.storage.sync.set({ leetCodeProblemSolved: true }),
//       getLastCompletion()
//     ]);
//     const now = new Date();

//     if (lastCompletion.toDateString() === now.toDateString()) return;

//     const [bestStreak, currentStreak] = await Promise.all([
//       chrome.storage.sync.get("bestStreak"),
//       chrome.storage.sync.get("currentStreak"),
//     ]);

//     const newStreak = (Number(currentStreak.currentStreak) || 0) + 1;
//     const best = Number(bestStreak.bestStreak) || 0;

//     await chrome.storage.sync.set({ currentStreak: newStreak });
//     await chrome.storage.sync.set({ lastCompleted: now.toDateString() });
//     if (newStreak > best) {
//       await chrome.storage.sync.set({ bestStreak: newStreak });
//     }
//   }
// }