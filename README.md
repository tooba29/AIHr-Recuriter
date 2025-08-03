# RecruitAI - Intelligent Recruitment Automation

A comprehensive recruitment automation application built with FastAPI backend and React frontend that streamlines the early stages of recruitment by intelligently filtering, scoring, and shortlisting candidates based on job-specific requirements.

## 🚀 Features

- **Intelligent Candidate Evaluation**: Uses GPT-4 to evaluate candidates against job requirements
- **Percentage Matching**: Provides accurate match scores (0-100%) for each candidate
- **Detailed Reasoning**: Generates comprehensive evaluation reasoning for each score
- **Multilingual Support**: Handles resumes and responses in various languages
- **Modern UI**: Beautiful, responsive React frontend with drag-and-drop file upload
- **Real-time Processing**: Fast evaluation with progress tracking
- **Comprehensive Results**: Detailed breakdown of strengths, weaknesses, and recommendations
- **Sorting & Filtering**: Advanced filtering and sorting options for results
- **Excel Integration**: Easy upload of candidate data in .xlsx/.xls format

## 🏗️ Architecture

### Backend (FastAPI)
- **File Processing**: Handles Excel file uploads and data extraction
- **GPT Integration**: Leverages OpenAI GPT-4 for intelligent candidate evaluation
- **Scoring Engine**: Calculates match percentages and generates recommendations
- **RESTful API**: Clean API endpoints for frontend integration

### Frontend (React + TypeScript)
- **Modern UI**: Built with Tailwind CSS for responsive design
- **File Upload**: Drag-and-drop interface for Excel files
- **Real-time Updates**: Loading states and progress indicators
- **Results Display**: Comprehensive candidate evaluation results with sorting/filtering

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- OpenAI API Key
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Office_Assignment
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment:
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Set up environment variables:
```bash
# Copy the example environment file
copy env.example .env

# Edit .env and add your OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
```

### 4. Running the Application

Start the backend server:
```bash
cd backend
python main.py
```
The API will be available at: `http://localhost:8000`

In a new terminal, start the frontend:
```bash
cd frontend
npm start
```
The application will be available at: `http://localhost:3000`

## 📊 Usage

1. **Enter Job Description**: Provide detailed job requirements, skills, and qualifications
2. **Upload Candidate Data**: Drag-and-drop or select an Excel file (.xlsx/.xls) containing candidate information
3. **Process Evaluation**: Click "Evaluate Candidates" to start the AI-powered analysis
4. **Review Results**: View detailed results including:
   - Match percentages for each candidate
   - Comprehensive reasoning for scores
   - Strengths and weaknesses analysis
   - Skill matching breakdown
   - Recommendation categories

## 📁 File Format

The Excel file should contain candidate data with columns such as:
- Name/Candidate Name
- Email
- Phone
- Experience
- Skills
- Education
- Previous Companies
- Any other relevant information

The system automatically processes all columns and uses them for evaluation.

## 🎨 Key Features Explained

### Intelligent Scoring
- **Match Percentage**: 0-100% match score based on job requirements
- **Recommendation Categories**: 
  - Highly Recommended (80%+)
  - Recommended (60-79%)
  - Consider (40-59%)
  - Not Recommended (<40%)

### Comprehensive Analysis
- **Strengths**: Key qualifications that align with the role
- **Weaknesses**: Areas where candidates may not fully meet requirements
- **Skill Matching**: Specific skills that match job requirements
- **Detailed Reasoning**: AI-generated explanation for each score

### Advanced Filtering & Sorting
- Filter by recommendation level
- Sort by rank, name, or recommendation
- Expandable candidate details
- Summary statistics dashboard

## 🔧 API Endpoints

### POST `/evaluate-candidates`
Evaluates candidates against job requirements.

**Parameters:**
- `job_description` (form-data): Job requirements and qualifications
- `file` (form-data): Excel file with candidate data

**Response:**
```json
{
  "success": true,
  "job_description": "...",
  "summary": {
    "total_candidates": 10,
    "average_match": 67.5,
    "highest_match": 95,
    "lowest_match": 23,
    "highly_recommended": 2,
    "recommended": 4,
    "consider": 3,
    "not_recommended": 1
  },
  "candidates": [...]
}
```

### POST `/test-gpt`
Tests GPT integration.

## 🌐 Multilingual Support

The application handles multilingual input through GPT-4's natural language processing capabilities:
- Supports resumes in multiple languages
- Accurate interpretation regardless of language
- Consistent evaluation criteria across languages

## 🚨 Error Handling

- File format validation
- OpenAI API error handling
- Network timeout management
- User-friendly error messages

## 🔒 Security Considerations

- API key protection through environment variables
- File type validation
- Input sanitization
- CORS configuration for development

## 📈 Future Enhancements

- Batch processing for large candidate pools
- Custom evaluation criteria
- Integration with ATS systems
- Advanced analytics and reporting
- Resume parsing improvements
- Database storage for historical data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section below
2. Review API documentation
3. Create an issue in the repository

## 🔧 Troubleshooting

### Common Issues

**Backend Issues:**
- Ensure OpenAI API key is correctly set in `.env`
- Check Python version compatibility
- Verify all dependencies are installed

**Frontend Issues:**
- Clear browser cache
- Check console for JavaScript errors
- Ensure backend is running on port 8000

**File Upload Issues:**
- Verify file format (.xlsx or .xls)
- Check file size limits
- Ensure file contains valid data

### API Key Setup
1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Copy `env.example` to `.env` in the backend directory
3. Replace `your_openai_api_key_here` with your actual API key
4. Restart the backend server

---

Built with ❤️ using FastAPI, React, and OpenAI GPT-4 