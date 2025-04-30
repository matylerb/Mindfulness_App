# Mindfulness App

90% Vibes, 10% Genius, 100% Alignment

This is a minimal and peaceful React project for a mindfulness app. It is designed to provide a calming user experience.

## Prerequisites

- Node.js and npm installed (for the frontend) -> https://nodejs.org/en/download
- Python installed (for the backend) (version 3.13.1 is the one i'm using)

## Setup Instructions

### Frontend

1. Install the frontend dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser to the provided local development URL.

### Backend

1. Install the backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the backend server:
   ```bash
   python main.py
   ```

## Running the App

1. Ensure both the frontend and backend servers are running.
2. Access the app in your browser at the URL provided by the frontend development server.

## Notes

- The backend requires a `.env` file which is provided you just need to enter your own GROQ API key which can be found at https://console.groq.com/keys 
  ```
  GROQ_API_KEY=your_api_key_here
  ```
  Replace `your_api_key_here` with your actual API key.

- If you encounter any issues, ensure all dependencies are installed and the servers are running on the correct ports.
