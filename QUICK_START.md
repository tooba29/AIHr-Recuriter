# 🚀 Quick Start Guide

Get RecruitAI running in 5 minutes!

## Prerequisites
- Python 3.8+
- Node.js 16+
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

## Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
copy env.example .env
# Edit .env and add your OpenAI API key:
# OPENAI_API_KEY=your_actual_api_key_here

# Start backend
python main.py
```

Backend will be running at: `http://localhost:8000`

## Step 2: Frontend Setup (2 minutes)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend will be running at: `http://localhost:3000`

## Step 3: Test the Application (1 minute)

1. Open `http://localhost:3000` in your browser
2. Enter a job description (e.g., "Software Engineer with Python and React experience")
3. Upload the provided `Responses - Test.xlsx` file
4. Click "Evaluate Candidates"
5. View your results!

## 🎉 You're Done!

The application is now running and ready to streamline your recruitment process.

## Next Steps

- Review the full [README.md](README.md) for detailed documentation
- Check out the API docs at `http://localhost:8000/docs`
- Customize evaluation criteria in the backend
- Deploy to production when ready

## Need Help?

- Check the troubleshooting section in README.md
- Ensure your OpenAI API key is valid and has credits
- Make sure both backend and frontend are running simultaneously 