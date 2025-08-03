import React from 'react';

interface JobDescriptionFormProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Job Description</h3>
          <p className="text-sm text-gray-600">Enter the job requirements and qualifications</p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter the job description, required skills, qualifications, and any specific requirements for the role..."
          className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:text-gray-500"
        />
        
        <div className="text-sm text-gray-500">
          <p>💡 <strong>Tips:</strong></p>
          <ul className="ml-4 space-y-1 text-xs">
            <li>• Include required technical skills and experience level</li>
            <li>• Mention preferred qualifications and certifications</li>
            <li>• Specify soft skills and cultural fit requirements</li>
            <li>• Add any specific industry experience needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 