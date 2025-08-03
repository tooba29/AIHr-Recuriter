# RecruitAI Backend

FastAPI backend for the RecruitAI recruitment automation system.

## Features

- FastAPI web framework
- OpenAI GPT-4 integration
- Excel file processing
- Candidate evaluation engine
- CORS enabled for frontend integration

## Setup

1. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
copy env.example .env
# Edit .env and add your OpenAI API key
```

4. Run the server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- API docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)

## Dependencies

- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `pandas`: Data processing
- `openpyxl`: Excel file handling
- `openai`: OpenAI API client
- `python-multipart`: File upload support 