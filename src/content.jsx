import React from "react";
import ReactDOM from "react-dom";
import CongratulationsModal from './Modal/CongratulationsModal';

// const root = document.createElement("div");
// document.body.appendChild(root);
// ReactDOM.render(<CongratulationsModal />, root);

const shadowHost = document.createElement("div");
document.body.appendChild(shadowHost);
const shadowRoot = shadowHost.attachShadow({ mode: "open" });

const modalContainer = document.createElement("div");
shadowRoot.appendChild(modalContainer);

// Inject Tailwind into Shadow DOM
const tailwindLink = document.createElement("link");
tailwindLink.rel = "stylesheet";
tailwindLink.href = "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
shadowRoot.appendChild(tailwindLink);

// Render inside Shadow DOM
tailwindLink.onload = () => {
  ReactDOM.render(<CongratulationsModal />, modalContainer);
};

// Alternative: Use Shadow DOM (Prevents Conflicts)
// If styles are still being overridden, wrap the modal inside a Shadow DOM, which isolates styles:




// // content.js
// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import CongratulationsModal from './Modal/CongratulationsModal';

// console.log('Content script running');

// document.addEventListener("DOMContentLoaded", () => {
//     console.log("Content script loaded");
//     // Your code here
// });

// // Send a message when the submit button is clicked
// function handleClick(event) {
//   let currentTarget = event.target;
//   while (currentTarget) {
//     if (currentTarget.matches('button[data-e2e-locator="console-submit-button"]')) {
//       chrome.runtime.sendMessage({ action: "userClickedSubmit" }, (response) => {
//         console.log("Response from background:", response);
//       });
//       break; // Exit loop once the match is found
//     }
//     currentTarget = currentTarget.parentElement;
//   }
// }

// document.addEventListener('click', handleClick);


// // Create a div element to serve as the root for the React app
// const appRoot = document.createElement('div');
// appRoot.id = 'root';
// appRoot.style.position = 'fixed'; // Prevents layout shifts
// appRoot.style.zIndex = '9999'; // Ensures it's visible above other elements
// document.documentElement.appendChild(appRoot);


// // Render the Congratulations component when the success message is received
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log("Message received in content script:", message);
//   if (message.action === "userSolvedProblem") {
//     console.log("Dispatching event with detail:", message.language);
//     window.dispatchEvent(new CustomEvent("userSolvedProblem", { detail: message.language }));

//     sendResponse({ status: "received" }); // ✅ Send a response back

//     // Render the Congratulations component
//     const root = createRoot(document.getElementById('root'));
//     root.render(<CongratulationsModal />);
//   }
//   return true;
// });