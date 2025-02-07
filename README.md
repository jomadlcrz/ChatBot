# ChatBot

A simple web-based ChatBot interface built with HTML, CSS, and JavaScript. This project is designed for demonstration purposes and provides a basic framework for a chatbot interaction.

![ChatBot Screenshot](images/screenshot.png)

## Features
- **Responsive Design**: Works on both desktop and mobile devices.
- **Markdown Support**: Uses `markdown-it` to render Markdown-formatted responses.
- **Reset Chat**: Allows users to reset the conversation with a single click.
- **Dynamic Input Area**: Automatically adjusts the textarea height based on user input.

## Technologies Used
- **HTML5**: Structure of the web page.
- **CSS3**: Styling and layout.
- **JavaScript**: Logic and interactivity.
- **Bootstrap**: Responsive design and pre-built components.
- **jQuery**: Simplified DOM manipulation.
- **Markdown-it**: Markdown rendering for chatbot responses.

## Setup Instructions

### Prerequisites
- A modern web browser (e.g., Chrome, Firefox, Edge).
- Basic knowledge of HTML, CSS, and JavaScript.

### Steps to Run the Project
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/jomadlcrz/ChatBot-with-Groq-or-Gemini-API-Key.git
   cd chatbot-project
   ```

2. **Open the Project**:
   - Open the `index.html` file in your browser.

3. **Customize the ChatBot**:
   - Modify the `script.js` file to add your chatbot logic.
   - Update the `style.css` file to customize the appearance.

4. **Run Locally**:
   - If you have a local server (e.g., `http-server` or `live-server`), you can serve the project for better testing:
     ```bash
     npx http-server
     ```

## File Structure
```
chatbot-project/
├── index.html          # Main HTML file
├── style.css           # Custom CSS styles
├── script.js           # JavaScript logic for the chatbot
├── images/             # Folder for images (e.g., favicon, screenshots)
│   └── favicon.ico     # Favicon for the website
├── README.md           # Project documentation
```

## How It Works
- The user types a message in the input area and clicks the send button (or presses Enter).
- The message is displayed in the chat box.
- The chatbot processes the input (you can add your logic in `script.js`) and responds.
- The chat can be reset using the reset icon (⟲) in the header.

## Customization
- **Add ChatBot Logic**: Update the `script.js` file to integrate your chatbot's backend or API.
- **Change Styling**: Modify `style.css` to match your preferred design.
- **Update Favicon**: Replace `images/favicon.ico` with your own favicon.

## License
This project is open-source and available under the [MIT License](LICENSE).

## Disclaimer
This ChatBot is for demonstration purposes only. It does not include advanced AI or natural language processing capabilities.