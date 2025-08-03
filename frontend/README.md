# RecruitAI Frontend

React TypeScript frontend for the RecruitAI recruitment automation system.

## Features

- Modern React 18 with TypeScript
- Tailwind CSS for styling
- Drag-and-drop file upload
- Real-time loading states
- Responsive design
- Advanced filtering and sorting
- Comprehensive results display

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Technologies Used

- **React 18**: Latest React with concurrent features
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **React Hooks**: Modern state management

## Components

- `Header`: Application header with branding
- `JobDescriptionForm`: Job requirements input
- `FileUpload`: Drag-and-drop Excel file upload
- `ResultsDisplay`: Comprehensive results visualization
- `LoadingSpinner`: Loading state indicator

## Features

### File Upload
- Drag-and-drop interface
- File type validation (.xlsx, .xls)
- Visual feedback for upload status

### Results Display
- Candidate ranking and scoring
- Expandable candidate details
- Filtering by recommendation level
- Sorting by multiple criteria
- Summary statistics

### Responsive Design
- Mobile-friendly interface
- Optimized for all screen sizes
- Modern UI patterns

## API Integration

The frontend connects to the FastAPI backend at `http://localhost:8000` and handles:
- File uploads with progress tracking
- Error handling and validation
- Real-time updates during processing
