import React, { useState } from 'react';
import { JobDescriptionForm } from './components/JobDescriptionForm';
import { FileUpload } from './components/FileUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Header } from './components/Header';
import axios from 'axios';
import './App.css';

export interface CandidateEvaluation {
  candidate: {
    id: string;
    row_number: number;
    [key: string]: any;
  };
  evaluation: {
    match_percentage: number;
    confidence_level?: number;
    reasoning: string;
    technical_score?: number;
    experience_score?: number;
    cultural_fit_score?: number;
    growth_potential_score?: number;
    risk_score?: number;
    strengths: string[];
    weaknesses: string[];
    key_skills_match: string[];
    missing_skills?: string[];
    recommendation: string;
    recommendation_rationale?: string;
    interview_focus_areas?: string[];
    onboarding_considerations?: string;
    salary_competitiveness?: string;
    time_to_productivity?: string;
    retention_risk?: string;
    unique_value_proposition?: string;
    evaluated_at: string;
    candidate_id: string;
    evaluation_version?: string;
    error?: boolean;
  };
  rank: number;
}

export interface EvaluationResults {
  success: boolean;
  job_description: string;
  summary: {
    total_candidates: number;
    average_match: number;
    highest_match: number;
    lowest_match: number;
    highly_recommended: number;
    recommended: number;
    consider: number;
    not_recommended: number;
  };
  candidates: CandidateEvaluation[];
  processed_at: string;
}

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<EvaluationResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJobDescriptionChange = (description: string) => {
    setJobDescription(description);
    setError(null);
  };

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    if (!file) {
      setError('Please upload a candidate file');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('job_description', jobDescription);
      formData.append('file', file);

      const response = await axios.post(`${API_BASE_URL}/evaluate-candidates`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutes timeout for GPT processing
      });

      setResults(response.data);
    } catch (err: any) {
      console.error('Error evaluating candidates:', err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The evaluation is taking longer than expected.');
      } else {
        setError('Failed to evaluate candidates. Please check your backend server and OpenAI API key.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setJobDescription('');
    setFile(null);
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {!results ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Job Description Section */}
            <div className="space-y-6">
              <JobDescriptionForm
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                disabled={loading}
              />
            </div>

            {/* File Upload Section */}
            <div className="space-y-6">
              <FileUpload
                file={file}
                onChange={handleFileChange}
                disabled={loading}
              />

              {/* Submit Button */}
              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !jobDescription.trim() || !file}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    loading || !jobDescription.trim() || !file
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <LoadingSpinner size="sm" />
                      <span>Evaluating Candidates...</span>
                    </div>
                  ) : (
                    'Evaluate Candidates'
                  )}
                </button>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Evaluation Results</h2>
              <button
                onClick={handleReset}
                className="btn-secondary"
              >
                New Evaluation
              </button>
            </div>
            
            <ResultsDisplay results={results} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
