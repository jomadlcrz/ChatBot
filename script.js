const resetButton = document.getElementById("resetChat");
const geminiModel = document.getElementById("geminiModel");
const groqModel = document.getElementById("groqModel");
const modelDropdown = document.getElementById("modelDropdown"); // Dropdown to show selected model

document.addEventListener("DOMContentLoaded", function () {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  const icon = darkModeToggle.querySelector("i"); // Get the icon inside the toggle button

  // Load theme from localStorage
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
    icon.classList.remove("fa-moon"); // Remove moon icon
    icon.classList.add("fa-sun"); // Add sun icon
  }

  darkModeToggle.addEventListener("click", function () {
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
      icon.classList.remove("fa-moon"); // Remove moon icon
      icon.classList.add("fa-sun"); // Add sun icon
    } else {
      localStorage.setItem("darkMode", "disabled");
      icon.classList.remove("fa-sun"); // Remove sun icon
      icon.classList.add("fa-moon"); // Add moon icon
    }
  });
});

// Load the selected model from localStorage (if it exists), default to 'gemini'
let selectedModel = localStorage.getItem("selectedModel") || "gemini";

// Set the model dropdown text based on the stored value
modelDropdown.textContent =
  selectedModel === "gemini" ? "ChatBot (Gemini)" : "ChatBot (Groq)";

// Handle model selection
geminiModel.addEventListener("click", () => {
  selectedModel = "gemini"; // Select Gemini model
  modelDropdown.textContent = "ChatBot (Gemini)";
  localStorage.setItem("selectedModel", "gemini"); // Store selection in localStorage
});

groqModel.addEventListener("click", () => {
  selectedModel = "groq"; // Select Groq model
  modelDropdown.textContent = "ChatBot (Groq)";
  localStorage.setItem("selectedModel", "groq"); // Store selection in localStorage
});

// Reset chat when button is clicked
resetButton.addEventListener("click", () => {
  localStorage.removeItem("conversationHistory"); // Clear local storage
  conversationHistory = []; // Reset chat history array
  chatBox.innerHTML = ""; // Clear UI chat messages
  displayWelcomeMessageIfNeeded(); // Show welcome message again

  // Abort the ongoing fetch request if any
  if (abortController) {
    abortController.abort();
  }
});

const chatBox = document.getElementById("chatBox"),
  userInput = document.getElementById("userInput"),
  sendButton = document.getElementById("sendButton");

// Initialize markdown-it

const addMessage = (content, sender) => {
  let msg = document.createElement("div");
  msg.classList.add(
    "message",
    sender === "user" ? "user-message" : "bot-message"
  );

  if (sender === "user") {
    // Replace newlines with <br> tags for user messages
    msg.innerHTML = content.replace(/\n/g, "<br>");
  } else {
    // Render Markdown for bot messages
    const normalizedContent = content.replace(/\n{2,}/g, "\n"); // Normalize multiple newlines
    msg.innerHTML = md.render(normalizedContent);

    // Add copy label and button to each code block
    msg.querySelectorAll("pre code").forEach((codeBlock) => {
      // Create a container for the label and copy button
      const codeContainer = document.createElement("div");
      codeContainer.classList.add("code-container");

      // Extract the language from the code block's class
      let languageClass = Array.from(codeBlock.classList).find((cls) =>
        cls.startsWith("language-")
      );
      let language = languageClass
        ? languageClass.replace("language-", "")
        : "Code";

      // Fallback: If no language class is found, try to detect the language using hljs
      if (language === "Code") {
        const detectedLanguage = hljs.highlightAuto(
          codeBlock.textContent
        ).language;
        language = detectedLanguage ? detectedLanguage : "Code";
      }

      // Create the label
      const label = document.createElement("div");
      label.classList.add("code-label");
      label.textContent = language; // Set the label to the detected language

      // Create the copy button
      const copyButton = document.createElement("button");
      copyButton.classList.add("copy-code-btn");
      copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy'; // Font Awesome copy icon + text
      copyButton.title = "Copy code";

      // Append label and copy button to the container
      codeContainer.appendChild(label);
      codeContainer.appendChild(copyButton);

      // Wrap the code block in the container
      codeBlock.parentNode.insertBefore(codeContainer, codeBlock);
      codeContainer.appendChild(codeBlock);

      // Initialize Clipboard.js for this button
      const clipboard = new ClipboardJS(copyButton, {
        text: () => codeBlock.textContent,
      });

      // Change button text and icon on successful copy
      clipboard.on("success", (e) => {
        e.clearSelection();
        copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!'; // Change to checkmark and "Copied!"
        setTimeout(() => {
          copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy'; // Revert to original state
        }, 2000); // Revert after 2 seconds
      });

      clipboard.on("error", (e) => {
        console.error("Failed to copy text:", e.action);
      });

      // Ensure syntax highlighting is applied after adding the code block to the DOM
      hljs.highlightElement(codeBlock);
    });
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
};

const md = window
  .markdownit({
    breaks: true, // Preserve single newlines as <br> tags
    linkify: true, // Autoconvert URL-like text to links
    typographer: true, // Enable some language-neutral replacement + quotes beautification

    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            '<pre><code class="hljs language-' +
            lang +
            '">' +
            hljs.highlight(str, { language: lang }).value +
            "</code></pre>"
          );
        } catch (__) {}
      }
      return (
        '<pre><code class="hljs">' + md.utils.escapeHtml(str) + "</code></pre>"
      );
    },
  })
  .use(window.markdownitEmoji)
  .use(window.markdownitSub)
  .use(window.markdownitSup)
  .use(window.markdownitMark)
  .use(window.markdownitFootnote);
// Function to render markdown in chat
function renderMarkdown(text) {
  return md.render(text);
}

// Example usage: Convert user or bot response with Markdown
function addMessageToChat(message, isBot = false) {
  const chatBox = document.getElementById("chatBox");
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message", isBot ? "bot" : "user");

  messageElement.innerHTML = renderMarkdown(message);
  chatBox.appendChild(messageElement);

  // Re-run highlight.js after adding content
  document.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightElement(block);
  });
}

// Keep track of the conversation history for continuous conversation
let conversationHistory = [];
let abortController; // Declare AbortController

// Function to add message with Markdown parsing (except for user messages)

// Function to load chat history from local storage
const loadChatHistory = () => {
  const savedHistory = JSON.parse(localStorage.getItem("conversationHistory"));
  if (savedHistory) {
    savedHistory.forEach((message) => {
      addMessage(message.content, message.role);
      conversationHistory.push(message);
    });
  }
};

// Function to save chat history to local storage
const saveChatHistory = () => {
  localStorage.setItem(
    "conversationHistory",
    JSON.stringify(conversationHistory)
  );
};

// Function to handle sending a message
const sendMessage = () => {
  let message = userInput.value.trim();
  if (!message) return;
  addMessage(message, "user");
  userInput.value = "";
  userInput.style.height = "100px"; // Adjusted height
  sendButton.disabled = true;

  // Add the user message to the conversation history
  conversationHistory.push({ role: "user", content: message });
  saveChatHistory(); // Save chat history to local storage

  // Show "Thinking..." message before the response
  const thinkingMessage = document.createElement("div");
  thinkingMessage.classList.add("message", "thinking-message");
  thinkingMessage.textContent = "Thinking... 💬";
  chatBox.appendChild(thinkingMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Create a new AbortController for each request
  abortController = new AbortController();
  const { signal } = abortController;

  // Send the conversation history and selected model to the backend
  fetch("https://server-alpha-lilac.vercel.app/chat", {
    // http://localhost:3000/chat or backend URL sample https://example.com/chat
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: conversationHistory,
      api: selectedModel, // Include the selected model (Gemini or Groq)
    }),
    signal: signal, // Attach the signal to fetch request
  })
    .then((response) => response.json())
    .then((res) => {
      console.log(res); // Log the response to inspect its structure
      // Remove Thinking... message after response
      thinkingMessage.remove();

      // Check if the response has the expected message
      if (res && res.response) {
        const botResponse = res.response || "Unexpected response format.";
        addMessage(botResponse, "bot");
        conversationHistory.push({ role: "assistant", content: botResponse });
        saveChatHistory(); // Save updated chat history to local storage
      } else {
        addMessage("Error: Unexpected response format.", "bot");
      }
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        console.log("Fetch request was aborted");
      } else {
        thinkingMessage.remove();
        const errorMsg = document.createElement("div");
        errorMsg.classList.add("message", "bot-message", "error-message");
        errorMsg.textContent = "Error: Could not reach AI service.";
        chatBox.appendChild(errorMsg);
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    });
};

// Function to remove the welcome message once the user sends a message
const removeWelcomeMessage = () => {
  const welcomeMessage = document.querySelector(".welcome-message");
  if (welcomeMessage) {
    welcomeMessage.remove();
  }
};

// Function to check if the chat history is empty before displaying welcome message
const displayWelcomeMessageIfNeeded = () => {
  if (conversationHistory.length === 0) {
    let welcomeMsg = document.createElement("div");
    welcomeMsg.classList.add("message", "bot-message", "welcome-message");
    welcomeMsg.innerHTML = "How can I help you today?";
    chatBox.appendChild(welcomeMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};

// Load chat history from local storage
loadChatHistory();
displayWelcomeMessageIfNeeded();

// Handle user input
userInput.addEventListener("input", () => {
  userInput.style.height = "100px"; // Adjusted height for better input area
  userInput.style.height = Math.min(userInput.scrollHeight, 250) + "px";
  sendButton.disabled = !userInput.value.trim();
});

userInput.addEventListener("keydown", (e) => {
  if (window.innerWidth <= 768) return;

  if (e.key === "Enter") {
    if (e.shiftKey) return;
    e.preventDefault();
    removeWelcomeMessage();
    sendMessage();
  }
});

sendButton.addEventListener("click", () => {
  removeWelcomeMessage();
  sendMessage();
});
