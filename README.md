# Mindfulness App

This is a minimal and peaceful React project for a mindfulness app. It is designed to provide a calming user experience.

## Prerequisites

- Node.js and npm installed (for the frontend)
- Python installed (for the backend)

## Setup Instructions

### Frontend

1. Navigate to the `App` directory:
   ```bash
   cd App
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the provided local development URL.

### Backend

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate # On Windows, use `venv\Scripts\activate`
   ```
3. Install the backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   python main.py
   ```

## Running the App

1. Ensure both the frontend and backend servers are running.
2. Access the app in your browser at the URL provided by the frontend development server.

## Notes

- The backend requires a `.env` file with the following content:
  ```
  GROQ_API_KEY=your_api_key_here
  ```
  Replace `your_api_key_here` with your actual API key.

- If you encounter any issues, ensure all dependencies are installed and the servers are running on the correct ports.
