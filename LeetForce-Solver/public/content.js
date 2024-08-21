// chrome.runtime.sendMessage({ action: "userClickedSubmit" });
document.addEventListener("DOMContentLoaded", () => {
    console.log("Content script loaded");
    // Your code here
});

// // Content script code
// Send a message when the submit button is clicked
function handleClick(event) {
  let currentTarget = event.target;
  while (currentTarget) {
    if (currentTarget.matches('button[data-e2e-locator="console-submit-button"]')) {
      chrome.runtime.sendMessage({ action: "userClickedSubmit" }, (response) => {
        console.log("Response from background:", response);
      });
      break; // Exit loop once the match is found
    }
    currentTarget = currentTarget.parentElement;
  }
}

document.addEventListener('click', handleClick);

// Listen for the message from the background script
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "userSolvedProblem") {
//     // Dispatch a custom event to React to handle showing the modal
//     window.dispatchEvent(new CustomEvent("userSolvedProblem", { detail: message.language }));
//   }
// });
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in content script:", message); // Debugging line
    if (message.action === "userSolvedProblem") {
      console.log("Dispatching event with detail:", message.language); // Debugging line
      window.dispatchEvent(new CustomEvent("userSolvedProblem", { detail: message.language }));
    }
  });
  


//   window.addEventListener('unload', () => {
//     document.removeEventListener('click', handleClick);
//   });

// chrome.runtime.sendMessage({ action: "userClickedSubmit" }, (response) => {
//     console.log("Response from background:", response);
// });

