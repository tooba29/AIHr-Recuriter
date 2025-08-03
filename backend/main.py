from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import openai
import os
import json
from typing import List, Dict, Any
import io
from datetime import datetime
import re
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Recruitment Automation API", version="1.0.0")

# Add CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Verify OpenAI API key is loaded
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    print("WARNING: OPENAI_API_KEY not found in environment variables!")
    print("Please check your .env file in the backend directory.")
else:
    print(f"OpenAI API key loaded: {openai_api_key[:8]}...")

class CandidateEvaluator:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OpenAI API key not found. Please check your .env file.")
        self.client = openai.OpenAI(api_key=api_key)
    
    def evaluate_candidate(self, job_description: str, candidate_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluate a single candidate against job requirements using GPT
        """
        try:
            # Create a comprehensive prompt for evaluation
            prompt = f"""
            You are a senior talent acquisition specialist with 15+ years of experience in technical and executive recruiting. 
            Your expertise includes identifying top talent, assessing cultural fit, and predicting long-term success.

            EVALUATION TASK:
            Conduct a comprehensive candidate assessment using advanced recruitment methodologies and predictive analytics.

            JOB REQUIREMENTS:
            {job_description}

            CANDIDATE PROFILE:
            {json.dumps(candidate_data, indent=2)}

            EVALUATION FRAMEWORK:
            Analyze the candidate across these weighted dimensions:

            1. TECHNICAL COMPETENCY (30% weight):
               - Hard skills alignment with job requirements
               - Technology stack proficiency and depth
               - Relevant certifications and qualifications
               - Problem-solving capabilities demonstrated

            2. EXPERIENCE RELEVANCE (25% weight):
               - Years of relevant experience vs. job requirements
               - Industry background alignment
               - Project complexity and scale handled
               - Leadership and team management experience
               - Career progression trajectory

            3. CULTURAL & SOFT SKILLS FIT (20% weight):
               - Communication skills and articulation
               - Adaptability and learning agility
               - Teamwork and collaboration indicators
               - Leadership potential and initiative
               - Work style compatibility

            4. GROWTH POTENTIAL (15% weight):
               - Learning curve and skill development capacity
               - Career ambition and goal alignment
               - Innovation and creative thinking indicators
               - Ability to handle increasing responsibilities

            5. RISK ASSESSMENT (10% weight):
               - Job stability and commitment indicators
               - Overqualification or underqualification risks
               - Salary expectations vs. market rates
               - Location and availability considerations

            INTELLIGENT RANKING CRITERIA:
            - Prioritize candidates who exceed minimum requirements in critical areas
            - Consider transferable skills and potential for rapid upskilling
            - Factor in unique value propositions and differentiators
            - Assess long-term retention probability
            - Evaluate immediate productivity potential vs. ramp-up time

            OUTPUT REQUIREMENTS:
            Provide a detailed assessment in JSON format with these exact keys:

            {{
                "match_percentage": integer (0-100, calculated using weighted framework above),
                "confidence_level": integer (0-100, your confidence in this assessment),
                "reasoning": "Comprehensive 3-4 sentence analysis of overall fit",
                "technical_score": integer (0-100),
                "experience_score": integer (0-100),
                "cultural_fit_score": integer (0-100),
                "growth_potential_score": integer (0-100),
                "risk_score": integer (0-100, where 100 = lowest risk),
                "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
                "weaknesses": ["specific concern 1", "specific concern 2"],
                "key_skills_match": ["matched skill 1", "matched skill 2", "matched skill 3"],
                "missing_skills": ["missing skill 1", "missing skill 2"],
                "recommendation": "Highly Recommended|Recommended|Consider with Conditions|Not Recommended",
                "recommendation_rationale": "1-2 sentence explanation of recommendation",
                "interview_focus_areas": ["area to probe 1", "area to probe 2"],
                "onboarding_considerations": "Brief note on integration approach",
                "salary_competitiveness": "Below Market|Market Rate|Above Market|Premium",
                "time_to_productivity": "Immediate|1-2 weeks|1 month|2-3 months|3+ months",
                "retention_risk": "Low|Medium|High",
                "unique_value_proposition": "What makes this candidate stand out"
            }}

            CRITICAL INSTRUCTIONS:
            - Be objective and data-driven in your assessment
            - Consider both explicit qualifications and implicit indicators
            - Factor in market conditions and talent scarcity
            - Provide actionable insights for hiring decision-makers
            - Ensure match_percentage reflects true hiring probability, not just qualification overlap
            - Consider the candidate's trajectory and potential, not just current state
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a world-class senior talent acquisition specialist with expertise in predictive hiring analytics, candidate assessment psychology, and strategic workforce planning. Your evaluations are known for their accuracy and actionable insights. Always respond with valid, complete JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,  # Lower temperature for more consistent, analytical responses
                max_tokens=2000   # Increased for more detailed analysis
            )
            
            # Parse the JSON response
            result = json.loads(response.choices[0].message.content)
            
            # Add metadata
            result["evaluated_at"] = datetime.now().isoformat()
            result["candidate_id"] = candidate_data.get("id", "unknown")
            result["evaluation_version"] = "v2.0_intelligent"
            
            return result
            
        except Exception as e:
            return {
                "match_percentage": 0,
                "confidence_level": 0,
                "reasoning": f"Error evaluating candidate: {str(e)}",
                "technical_score": 0,
                "experience_score": 0,
                "cultural_fit_score": 0,
                "growth_potential_score": 0,
                "risk_score": 0,
                "strengths": [],
                "weaknesses": ["Evaluation failed"],
                "key_skills_match": [],
                "missing_skills": ["Assessment incomplete"],
                "recommendation": "Not Recommended",
                "recommendation_rationale": "Technical evaluation error",
                "interview_focus_areas": [],
                "onboarding_considerations": "N/A",
                "salary_competitiveness": "Unknown",
                "time_to_productivity": "Unknown",
                "retention_risk": "High",
                "unique_value_proposition": "Unable to assess",
                "evaluated_at": datetime.now().isoformat(),
                "candidate_id": candidate_data.get("id", "unknown"),
                "evaluation_version": "v2.0_intelligent",
                "error": True
            }

def process_excel_file(file_content: bytes) -> List[Dict[str, Any]]:
    """
    Process uploaded Excel file and extract candidate data
    """
    try:
        # Read Excel file
        df = pd.read_excel(io.BytesIO(file_content))
        
        # Convert to list of dictionaries
        candidates = []
        for index, row in df.iterrows():
            candidate = {
                "id": f"candidate_{index + 1}",
                "row_number": index + 1
            }
            
            # Add all columns as candidate data
            for col in df.columns:
                candidate[col.lower().replace(" ", "_")] = str(row[col]) if pd.notna(row[col]) else ""
            
            candidates.append(candidate)
        
        return candidates
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing Excel file: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Recruitment Automation API is running"}

@app.post("/evaluate-candidates")
async def evaluate_candidates(
    job_description: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Main endpoint to evaluate candidates against job requirements
    """
    # Validate file type
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Please upload an Excel file (.xlsx or .xls)")
    
    # Check if OpenAI API key is set
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Process Excel file
        candidates = process_excel_file(file_content)
        
        if not candidates:
            raise HTTPException(status_code=400, detail="No candidate data found in the uploaded file")
        
        # Initialize evaluator
        evaluator = CandidateEvaluator()
        
        # Evaluate each candidate
        results = []
        for candidate in candidates:
            evaluation = evaluator.evaluate_candidate(job_description, candidate)
            
            # Combine candidate data with evaluation
            result = {
                "candidate": candidate,
                "evaluation": evaluation
            }
            results.append(result)
        
        # Sort by match percentage (highest first)
        results.sort(key=lambda x: x["evaluation"]["match_percentage"], reverse=True)
        
        # Add ranking
        for i, result in enumerate(results):
            result["rank"] = i + 1
        
        # Calculate summary statistics
        match_percentages = [r["evaluation"]["match_percentage"] for r in results]
        summary = {
            "total_candidates": len(results),
            "average_match": sum(match_percentages) / len(match_percentages),
            "highest_match": max(match_percentages),
            "lowest_match": min(match_percentages),
            "highly_recommended": len([r for r in results if r["evaluation"]["match_percentage"] >= 80]),
            "recommended": len([r for r in results if 60 <= r["evaluation"]["match_percentage"] < 80]),
            "consider": len([r for r in results if 40 <= r["evaluation"]["match_percentage"] < 60]),
            "not_recommended": len([r for r in results if r["evaluation"]["match_percentage"] < 40])
        }
        
        return {
            "success": True,
            "job_description": job_description,
            "summary": summary,
            "candidates": results,
            "processed_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing candidates: {str(e)}")

@app.post("/test-gpt")
async def test_gpt():
    """
    Test endpoint to verify GPT integration
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {"error": "OpenAI API key not configured"}
    
    try:
        client = openai.OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": "Hello, this is a test. Please respond with 'GPT integration working!'"}],
            max_tokens=50
        )
        return {"success": True, "response": response.choices[0].message.content}
    except Exception as e:
        return {"error": f"GPT integration failed: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 