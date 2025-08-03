import React, { useState } from 'react';
import { EvaluationResults, CandidateEvaluation } from '../App';

interface ResultsDisplayProps {
  results: EvaluationResults;
}

const getRecommendationColor = (recommendation: string) => {
  switch (recommendation.toLowerCase()) {
    case 'highly recommended':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'recommended':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'consider':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-red-100 text-red-800 border-red-200';
  }
};

const ScoreCircle: React.FC<{ score: number; size?: 'sm' | 'md' | 'lg' }> = ({ 
  score, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-20 h-20 text-base'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full border-4 flex items-center justify-center font-bold ${
      score >= 80 ? 'border-green-500 bg-green-50 text-green-700' :
      score >= 60 ? 'border-blue-500 bg-blue-50 text-blue-700' :
      score >= 40 ? 'border-yellow-500 bg-yellow-50 text-yellow-700' :
      'border-red-500 bg-red-50 text-red-700'
    }`}>
      {score}%
    </div>
  );
};

const CandidateCard: React.FC<{ candidate: CandidateEvaluation; isExpanded: boolean; onToggle: () => void }> = ({
  candidate,
  isExpanded,
  onToggle
}) => {
  const { evaluation, rank } = candidate;
  
  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
              #{rank}
            </div>
            <ScoreCircle score={evaluation.match_percentage} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h4 className="font-semibold text-gray-900">
                {candidate.candidate.name || candidate.candidate.candidate_name || `Candidate ${candidate.candidate.row_number}`}
              </h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRecommendationColor(evaluation.recommendation)}`}>
                {evaluation.recommendation}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              {candidate.candidate.email && (
                <div>Email: {candidate.candidate.email}</div>
              )}
              {candidate.candidate.phone && (
                <div>Phone: {candidate.candidate.phone}</div>
              )}
              {candidate.candidate.experience && (
                <div>Experience: {candidate.candidate.experience}</div>
              )}
              {candidate.candidate.skills && (
                <div>Skills: {candidate.candidate.skills}</div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onToggle}
          className="btn-secondary flex items-center space-x-2"
        >
          <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
          {/* Reasoning */}
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Evaluation Reasoning</h5>
            <p className="text-gray-700 text-sm leading-relaxed">{evaluation.reasoning}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Strengths
              </h5>
              <ul className="space-y-2">
                {evaluation.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                <svg className="w-4 h-4 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Areas for Improvement
              </h5>
              <ul className="space-y-2">
                {evaluation.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Advanced Scoring Metrics */}
          {evaluation.technical_score !== undefined && (
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Detailed Scoring Analysis</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Technical</div>
                  <div className="text-xl font-bold text-blue-800">{evaluation.technical_score}%</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Experience</div>
                  <div className="text-xl font-bold text-purple-800">{evaluation.experience_score}%</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Cultural Fit</div>
                  <div className="text-xl font-bold text-green-800">{evaluation.cultural_fit_score}%</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="text-sm text-orange-600 font-medium">Growth Potential</div>
                  <div className="text-xl font-bold text-orange-800">{evaluation.growth_potential_score}%</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="text-sm text-red-600 font-medium">Risk Score</div>
                  <div className="text-xl font-bold text-red-800">{evaluation.risk_score}%</div>
                </div>
                {evaluation.confidence_level && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600 font-medium">Confidence</div>
                    <div className="text-xl font-bold text-gray-800">{evaluation.confidence_level}%</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Business Intelligence Metrics */}
          {(evaluation.time_to_productivity || evaluation.retention_risk || evaluation.salary_competitiveness) && (
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Business Intelligence</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {evaluation.time_to_productivity && (
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <div className="text-sm text-indigo-600 font-medium">Time to Productivity</div>
                    <div className="text-sm font-bold text-indigo-800">{evaluation.time_to_productivity}</div>
                  </div>
                )}
                {evaluation.retention_risk && (
                  <div className={`p-3 rounded-lg ${
                    evaluation.retention_risk === 'Low' ? 'bg-green-50' :
                    evaluation.retention_risk === 'Medium' ? 'bg-yellow-50' : 'bg-red-50'
                  }`}>
                    <div className={`text-sm font-medium ${
                      evaluation.retention_risk === 'Low' ? 'text-green-600' :
                      evaluation.retention_risk === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>Retention Risk</div>
                    <div className={`text-sm font-bold ${
                      evaluation.retention_risk === 'Low' ? 'text-green-800' :
                      evaluation.retention_risk === 'Medium' ? 'text-yellow-800' : 'text-red-800'
                    }`}>{evaluation.retention_risk}</div>
                  </div>
                )}
                {evaluation.salary_competitiveness && (
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">Salary Expectation</div>
                    <div className="text-sm font-bold text-purple-800">{evaluation.salary_competitiveness}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interview & Onboarding Insights */}
          {((evaluation.interview_focus_areas && evaluation.interview_focus_areas.length > 0) || evaluation.onboarding_considerations || evaluation.unique_value_proposition) && (
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Actionable Insights</h5>
              <div className="space-y-4">
                {evaluation.interview_focus_areas && evaluation.interview_focus_areas.length > 0 && (
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Interview Focus Areas</h6>
                    <div className="flex flex-wrap gap-2">
                      {evaluation.interview_focus_areas.map((area, index) => (
                        <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {evaluation.unique_value_proposition && (
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Unique Value Proposition</h6>
                    <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">{evaluation.unique_value_proposition}</p>
                  </div>
                )}
                {evaluation.onboarding_considerations && (
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Onboarding Considerations</h6>
                    <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">{evaluation.onboarding_considerations}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {evaluation.missing_skills && evaluation.missing_skills.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                <svg className="w-4 h-4 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Skills Gap Analysis
              </h5>
              <div className="flex flex-wrap gap-2">
                {evaluation.missing_skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full border border-orange-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Matching Skills */}
          {evaluation.key_skills_match.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Matching Skills</h5>
              <div className="flex flex-wrap gap-2">
                {evaluation.key_skills_match.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Candidate Raw Data */}
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Complete Profile</h5>
            <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                {JSON.stringify(candidate.candidate, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [expandedCandidates, setExpandedCandidates] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'rank' | 'name' | 'recommendation'>('rank');
  const [filterBy, setFilterBy] = useState<string>('all');

  const toggleCandidateExpansion = (candidateId: string) => {
    const newExpanded = new Set(expandedCandidates);
    if (newExpanded.has(candidateId)) {
      newExpanded.delete(candidateId);
    } else {
      newExpanded.add(candidateId);
    }
    setExpandedCandidates(newExpanded);
  };

  const filteredAndSortedCandidates = React.useMemo(() => {
    let filtered = results.candidates;

    // Apply filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(candidate => 
        candidate.evaluation.recommendation.toLowerCase() === filterBy.toLowerCase()
      );
    }

    // Apply sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const nameA = a.candidate.name || a.candidate.candidate_name || '';
          const nameB = b.candidate.name || b.candidate.candidate_name || '';
          return nameA.localeCompare(nameB);
        case 'recommendation':
          const recOrder = ['highly recommended', 'recommended', 'consider', 'not recommended'];
          return recOrder.indexOf(a.evaluation.recommendation.toLowerCase()) - 
                 recOrder.indexOf(b.evaluation.recommendation.toLowerCase());
        default:
          return a.rank - b.rank;
      }
    });
  }, [results.candidates, sortBy, filterBy]);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{results.summary.total_candidates}</div>
          <div className="text-sm text-gray-600">Total Candidates</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{results.summary.average_match.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Average Match</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">{results.summary.highly_recommended}</div>
          <div className="text-sm text-gray-600">Highly Recommended</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-600">{results.summary.recommended}</div>
          <div className="text-sm text-gray-600">Recommended</div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Filter by:</label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">All Candidates</option>
                <option value="highly recommended">Highly Recommended</option>
                <option value="recommended">Recommended</option>
                <option value="consider">Consider</option>
                <option value="not recommended">Not Recommended</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rank' | 'name' | 'recommendation')}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="rank">Rank</option>
                <option value="name">Name</option>
                <option value="recommendation">Recommendation</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredAndSortedCandidates.length} of {results.summary.total_candidates} candidates
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="space-y-4">
        {filteredAndSortedCandidates.map((candidate) => (
          <CandidateCard
            key={candidate.candidate.id}
            candidate={candidate}
            isExpanded={expandedCandidates.has(candidate.candidate.id)}
            onToggle={() => toggleCandidateExpansion(candidate.candidate.id)}
          />
        ))}
      </div>

      {filteredAndSortedCandidates.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-3m-13 0h3m-3 0h3" />
          </svg>
          <p className="text-gray-500">No candidates match the selected filter.</p>
        </div>
      )}
    </div>
  );
}; 