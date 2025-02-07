# Getting Started with the AI Chat Server

This project is a simple Express server that integrates with Google's Gemini AI and Groq's AI services to provide a chat interface. Below are the steps to get started with the project.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Google Generative AI](https://ai.google.dev/)
- [Groq](https://groq.com/)
- [Express.js](https://expressjs.com/)

## Installation

1. **Change Directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory of your project and add the following environment variables:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   PORT=3000
   ```

   Replace `your_gemini_api_key_here` and `your_groq_api_key_here` with your actual API keys. If you don't have these keys, you can obtain them from the respective service providers.

## Running the Server

To start the server, run the following command:

```bash
npm start
```

The server will start and listen on the port specified in the `.env` file (default is `3000`). You should see a message in the console indicating that the server is running:

```
Server running at http://localhost:3000
```