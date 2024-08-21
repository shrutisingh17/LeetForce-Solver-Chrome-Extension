import {
  getProblemUrl,
  getProblemSolved,
  updateStreak,
  getEnableRedirectOnEveryProblem,
  updateProblem,
  getNumProblem
} from "../utils/utils";

// Rule ID for redirection management
const RULE_ID = 1;

import { generateRandomLeetCodeProblem } from "../src/problem/problemManager";

export const isSubmissionSuccessURL = (url) =>
  url.includes("/submissions/detail/") && url.includes("/check/");

// Function to send a message indicating the problem was solved
export const sendUserSolvedMessage = (languageUsed) => {
  chrome.windows.getCurrent({ populate: true }, (window) => {
    if (window.tabs && window.tabs.length > 0) {
      const activeTab = window.tabs.find(tab => tab.active);
      if (activeTab) {
        console.log(languageUsed, activeTab);
        chrome.tabs.sendMessage(activeTab.id, {
          action: "userSolvedProblem",
          language: languageUsed,
        });
      } else {
        console.warn("No active tab found.");
      }
    } else {
      console.warn("No tabs found in the current window.");
    }
  });
};


// Function to send a message indicating the problem was not solved
export const sendUserFailedMessage = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "userFailedProblem",
    });
  });
};

const state = {
  leetcodeProblemSolved: false,
  leetCodeProblem: {
    name: null,
    url: null,
  },
  solvedQuestions: 0,
  lastSubmissionDate: new Date(0),
  solvedListenerActive: false,
  lastAttemptedUrl: null,
  urlListener: null, // Define your listener function here
  HTcurrentStreak: 0,
};


 // Function to handle additional problem redirection
export const handleAdditionalProblemRedirect = async (problemUrl) => {
  const { enableRedirectOnEveryProblem } = await chrome.storage.sync.get(
    "enableRedirectOnEveryProblem"
  );
  if (enableRedirectOnEveryProblem) await setRedirectRule(problemUrl);
};



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
  try {
    const { enableRedirectOnEveryProblem } = await chrome.storage.sync.get(
      "enableRedirectOnEveryProblem"
    );
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
      case "userClickedSubmit":
        state.lastSubmissionDate = new Date()
        state.solvedListenerActive = true
        console.log(
          "User clicked submit, adding listener",
          state.solvedListenerActive
        )
        chrome.webRequest.onCompleted.addListener(checkIfUserSolvedProblem, {
          urls: ["*://leetcode.com/submissions/detail/*/check/"]
        })
        break
    default:
      console.warn("Unknown message action:", message.action);
      break;
  }
}

let activeTabUrl = "";
const handleTabUpdate = async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    activeTabUrl = tab.url;
  }
};

chrome.tabs.onUpdated.addListener(handleTabUpdate);

const checkIfUserSolvedProblem = async (details) => {
  
  // if (await storage.getProblemSolved()) return;
  if (!activeTabUrl) {
    console.warn("No active tab URL available.");
    return;
  }

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
      console.log(data);

      if (data.state === "STARTED" || data.state === "PENDING") {
        if (!state.solvedListenerActive) {
          state.solvedListenerActive = true;
          chrome.webRequest.onCompleted.addListener(checkIfUserSolvedProblem, {
            urls: ["*://leetcode.com/submissions/detail/*/check/"],
          });
        }
        return;
      }
      // if (data.status_msg !== "Accepted") {
      //   sendUserFailedMessage();
      //   return;
      // }
      if (
        data.status_msg === "Accepted" &&
        data.state === "SUCCESS" &&
        !data.code_answer
      ) {
        // await storage.updateStreak();
        state.leetcodeProblemSolved = true;
        chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: [RULE_ID],
        });
        console.log("Rule removed on success");
        chrome.webRequest.onCompleted.removeListener(checkIfUserSolvedProblem);
        sendUserSolvedMessage(data?.lang);
      }else{
        sendUserFailedMessage();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

// Continue with your logic

export async function handleRedirectRule() {
  const { enableRedirectOnEveryProblem } = await chrome.storage.sync.get(
    "enableRedirectOnEveryProblem"
  );
  
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

// Added correct initialization for listeners and alarms
// chrome.runtime.onInstalled.addListener(async () => {
//   await updateStorage();
//   // await tryResetStreak();
//   // await toggleUrlListener(await getHyperTortureMode()); // Correct function call
// });

// Need to add these listeners to global scope so that when the workers become inactive, they are set again
chrome.runtime.onMessage.addListener(onMessageReceived);





    // case "userClickedSubmit":
    //   state.lastSubmissionDate = new Date();
    //   state.solvedListenerActive = true;
    //   console.log(
    //     "User clicked submit, adding listener",
    //     state.solvedListenerActive
    //   );
    //   chrome.webRequest.onCompleted.addListener(checkIfUserSolvedProblem, {
    //     urls: ["*://leetcode.com/submissions/detail/*/check/"],
    //   });
    //   break;

    // if (data.status_msg === "Accepted" && data.state === "SUCCESS" && !data.code_answer) {
    //   // await storage.updateStreak();
    //   solvedQuestions++;
    //   state.leetcodeProblemSolved = true;
    //   chrome.declarativeNetRequest.updateDynamicRules({
    //     removeRuleIds: [RULE_ID],
    //   });
    //   console.log("Rule removed on success");
    //   chrome.webRequest.onCompleted.removeListener(checkIfUserSolvedProblem);
    // }
    
    // let currentURL = "";
  // try {
  //   const [activeTab] = await new Promise((resolve) => {
  //     chrome.tabs.query({ active: true, currentWindow: true }, resolve);
  //   });

  //   currentURL = activeTab.url;
  // } catch (error) {
  //   console.error("Error getting active tab:", error);
  //   return;
  // }  
  // const problemUrl = await getProblemUrl();

  // const sameUrl =
  //   problemUrl === currentURL || problemUrl + "description/" === currentURL;