import {
  isSubmissionSuccessURL,
  getProblemName,
  getProblemUrl,
  getProblemSolved,
  resetStreak,
  updateStreak,
  getEnableRedirectOnEveryProblem,
  updateProblem,
  getNumProblem,
  getSolvedProblems,
  updateSolvedProblems,
  getLastCompletion
} from "../utils/utils";

// Rule ID for redirection management
const RULE_ID = 1;

import { generateRandomLeetCodeProblem } from "./problem/problemManager";

console.log('Background script running');

// Send a message to notify the content script that the user solved a problem
export const sendUserSolvedMessage = (languageUsed) => {
  chrome.windows.getCurrent({ populate: true }, (window) => {
    if (window.tabs && window.tabs.length > 0) {
      const activeTab = window.tabs.find(tab => tab.active);
      if (activeTab) {
        console.log(languageUsed, activeTab);
        // chrome.tabs.sendMessage(activeTab.id, {
        //   action: "userSolvedProblem",
        //   language: languageUsed,
        // });
        chrome.tabs.sendMessage(activeTab.id, {
          action: "userSolvedProblem",
          language: languageUsed,
        }, (response) => {
          console.log("Response from content script:", response);
        });
        
      } else {
        console.warn("No active tab found while sending a solved message.");
      }
    } else {
      console.warn("No tabs found in the current window.");
    }
  });
};

// Function to send a message indicating the problem was not solved
// export const sendUserFailedMessage = () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, {
//       action: "userFailedProblem",
//     });
//   });
// };

// Send a message to notify the content script that the user failed a problem
export const sendUserFailedMessage = () => {
  chrome.windows.getCurrent({ populate: true }, (window) => {
    if (window.tabs && window.tabs.length > 0) {
      const activeTab = window.tabs.find(tab => tab.active);
      if (activeTab) {
        chrome.tabs.sendMessage(activeTab.id, {
          action: "userFailedProblem",
        });
      } else {
        console.warn("No active tab found while sending a failed message.");
      }
    } else {
      console.warn("No tabs found in the current window.");
    }
  });
};





const state = {
  leetcodeProblemSolved: false,
  leetCodeProblem: {
    name: null,
    url: null,
  },
  solvedProblemCount: 0,  //trackig no of ques done
  lastSubmissionDate: new Date(0),
  solvedListenerActive: false,
  lastAttemptedUrl: null,
  urlListener: null, // Define your listener function here
  HTcurrentStreak: 0,
};

 // Function to handle additional problem redirection
// export const handleAdditionalProblemRedirect = async (problemUrl) => {
//   const enableRedirectOnEveryProblem = await getEnableRedirectOnEveryProblem();
//   if (enableRedirectOnEveryProblem) await setRedirectRule(problemUrl);
// };


// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === "getProblems") {
//     // Return the fetched problems
//     sendResponse({ problems: fetchedProblems });
//   }
// });

// Function to update the problem state and storage
export const updateProblemState = async (problem) => {
  await updateProblem(problem, state.leetcodeProblemSolved);
};


// Function to update storage and manage problem redirection
export const updateStorage = async () => {
  console.log("calling next question");
  try {
    const enableRedirectOnEveryProblem = await getEnableRedirectOnEveryProblem();
    const problem = await generateRandomLeetCodeProblem();
    state.leetcodeProblemSolved = false;
    if (problem) {
      await updateProblemState(problem);
      if (!state.leetcodeProblemSolved && enableRedirectOnEveryProblem) {
        await setRedirectRule(problem.url);
      }
    }
  } catch (error) {
    throw new Error("Error generating random problem: " + error);
  }
};  

async function onMessageReceived(message, sender, sendResponse) {
  console.log(message)
  switch (message.action) {
    case "fetchingProblem":
      console.log("Fetching problem started.");
      break;
    case "problemFetched":
      console.log("Fetching problem completed.");
      break;
    case "getProblemStatus":
      sendResponse({
        problemSolved: state.leetcodeProblemSolved,
        problem: state.leetCodeProblem,
      });
      break;
    case "openTab":
        console.log("Opening tab:", message.url);
        chrome.tabs.create({ url: message.url });
        break;
    case "userClickedSubmit":
        state.lastSubmissionDate = new Date()

        // state.solvedListenerActive = true
        // console.log(
        //   "User clicked submit, adding listener",
        //   state.solvedListenerActive
        // )
        // chrome.webRequest.onCompleted.addListener(checkIfUserSolvedProblem, {
        //   urls: ["*://leetcode.com/submissions/detail/*/check/"]
        // })
        if (!state.solvedListenerActive) {
          state.solvedListenerActive = true;
          console.log(
              "User clicked submit, adding listener",
              state.solvedListenerActive
            )
          chrome.webRequest.onCompleted.removeListener(checkIfUserSolvedProblem);  // Remove existing listeners before adding a new one.
          chrome.webRequest.onCompleted.addListener(checkIfUserSolvedProblem, {
            urls: ["*://leetcode.com/submissions/detail/*/check/"],
          });
        }
        break
    default:
      console.warn("Unknown message action:", message.action);
      break;
  }
}
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "openTab") {
//     chrome.tabs.create({ url: request.url });
//   }
// });

let activeTabUrl = "";

//chrome.tabs.query ensures that the URL of the active tab is retrieved immediately when the extension starts.
const updateActiveTabUrl = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url) {
    activeTabUrl = tab.url;
  } else {
    console.warn("No active tab URL available.");
  }
};

//When a tab finishes loading (status: 'complete') and is active, it updates activeTabUrl with the URL of that tab.
const handleTabUpdate = async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    activeTabUrl = tab.url;
  }
};

updateActiveTabUrl();

chrome.tabs.onUpdated.addListener(handleTabUpdate);

const checkIfUserSolvedProblem = async (details) => {
  // if (await storage.getProblemSolved()) return;
  if (!activeTabUrl) {
    console.warn("No active tab URL available.");
    return;
  }
  // console.log(state.solvedProblemCount, noOfProbToSolve);

  const problemUrl = await getProblemUrl();
  const sameUrl = problemUrl === activeTabUrl || problemUrl + "description/" === activeTabUrl;
  if (!sameUrl) {
    return;
  }

  if (state.solvedListenerActive) {
    state.solvedListenerActive = false;
    chrome.webRequest.onCompleted.removeListener(checkIfUserSolvedProblem);
  }
  if (isSubmissionSuccessURL(details.url)) {
    try {
      const response = await fetch(details.url);
      const data = await response.json();

      if (data.state === "STARTED" || data.state === "PENDING") {
        if (!state.solvedListenerActive) {
          state.solvedListenerActive = true;
          chrome.webRequest.onCompleted.addListener(checkIfUserSolvedProblem, {
            urls: ["*://leetcode.com/submissions/detail/*/check/"],
          });
        }
        return;
      }
      if (data.status_msg !== "Accepted") {
        sendUserFailedMessage();
        return;
      }
      if (
        data.status_msg === "Accepted" &&
        data.state === "SUCCESS" &&
        !data.code_answer
      ) {
        const noOfProbToSolve = await getNumProblem();
        state.solvedProblemCount += 1;
        await chrome.storage.sync.set({ solvedProblemCount: state.solvedProblemCount });

        if (state.solvedProblemCount < noOfProbToSolve){
          await updateStorage();  // Call your function to load the next question
        }

        sendUserSolvedMessage(data?.lang);

        const solvedProblems = new Set(await getSolvedProblems());  //Convert solvedProblems to a Set → This automatically removes duplicates.
        const problemName = await getProblemName();
        solvedProblems.add(problemName);
        await updateSolvedProblems([...solvedProblems]); // Ensures unique entries

        // await updateStorage(); 

        console.log(state.solvedProblemCount ,noOfProbToSolve);

        if (state.solvedProblemCount >= noOfProbToSolve) {
          state.leetcodeProblemSolved = true;  // Mark session as complete
          chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [RULE_ID],
          });
          console.log("Rule removed after",  state.solvedProblemCount, "successes");
          chrome.webRequest.onCompleted.removeListener(checkIfUserSolvedProblem);
          await updateStreak();
          
          state.solvedProblemCount = 0; 
          await chrome.storage.sync.set({ solvedProblemCount: state.solvedProblemCount}); // Reset counter for next session
          await chrome.storage.sync.set({ numProblems: 1 });

          console.log('completed')
        } else {
          console.log(`Solved ${ state.solvedProblemCount} times, still listening...`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

export async function handleRedirectRule() {
  const enableRedirectOnEveryProblem = await getEnableRedirectOnEveryProblem();
  
  if (enableRedirectOnEveryProblem) {
    const problemUrl = await getProblemUrl();
    await setRedirectRule(problemUrl);
  } else {
    try {
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [RULE_ID],
      });
      console.log("Redirect rule removed");
    } catch (error) {
      console.error("Error removing redirect rule:", error);
    }
  }
}

// Set up a redirect rule for problem solving
async function setRedirectRule(redirectUrl) {
  const redirectRule = {
    id: RULE_ID,
    priority: 1,
    action: {
      type: "redirect",
      redirect: { url: redirectUrl },
    },
    condition: {
      urlFilter: "*://*/*",
      excludedInitiatorDomains: [
        "leetcode.com",
        "www.leetcode.com",
        "developer.chrome.com",
      ],
      resourceTypes: ["main_frame"],
    },
  };

  try {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [RULE_ID],
      addRules: [redirectRule],
    });
    // console.log(chrome.declarativeNetRequest.getDynamicRules);
    console.log("Redirect rule updated");
  } catch (error) {
    console.error("Error updating redirect rule:", error);
  }
}

async function tryResetStreak() {
  const lastCompletion = await getLastCompletion();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if the user missed a day
  if (lastCompletion.getDate() < yesterday.getDate()) {
    await resetStreak();
    return true;
  }
  return false;
}

// This function calculates the milliseconds remaining until midnight.

// It gets the current time (Date.now()) and the next midnight's 
// timestamp, then subtracts the two to find the time left until midnight. ⏳
const getMsUntilMidnight = () => {
  const currentTime = Date.now()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  return midnight.getTime() - currentTime
}


// Added correct initialization for listeners and alarms
chrome.runtime.onInstalled.addListener(async () => {
  await updateStorage();
  await tryResetStreak();
});

// the alarm will trigger exactly at 0 milliseconds left (midnight).
chrome.alarms.get("midnightAlarm", (alarm) => {
  if (alarm) return
  const msUntilMidnight = getMsUntilMidnight()
  const oneDayInMinutes = 60 * 24
  chrome.alarms.create("midnightAlarm", {
    when: Date.now() + msUntilMidnight,
    periodInMinutes: oneDayInMinutes  //repeating every 24hrs
  })
})

chrome.alarms.onAlarm.addListener(async () => {
  await updateStorage();
  await tryResetStreak();
  await chrome.storage.sync.set({ solvedProblemCount: 0 });
})


// Need to add these listeners to global scope so that when the workers become inactive, they are set again
chrome.runtime.onMessage.addListener(onMessageReceived);