/**
 * EXAMPLE: How to integrate CareerRecommendationForm into EmployeeProfile.jsx
 * 
 * This shows exactly where and how to add the career recommendation form
 * to your existing employee profile component.
 */

// ============================================================================
// STEP 1: Add imports at the top of EmployeeProfile.jsx
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Box, Tabs, Tab } from '@mui/material';

// NEW IMPORT: Add this line
import CareerRecommendationForm from './CareerRecommendationForm';

// ... existing imports ...


// ============================================================================
// STEP 2: Inside EmployeeProfile component, add state for tabs
// ============================================================================

export default function EmployeeProfile() {
  // ... existing state variables ...
  
  const [skills, setSkills] = useState(getStoredSkills);
  const [languages, setLanguages] = useState(getStoredLanguages);
  
  // NEW: Add tab state for switching between sections
  const [activeTab, setActiveTab] = useState(0);
  
  // ... rest of existing code ...


// ============================================================================
// STEP 3: Add useEffect to prepare skills for the form
// ============================================================================

  // This effect converts skill objects to string format for the form
  useEffect(() => {
    // Skills are already stored as objects with {id, name, level, experience}
    // The form will use just the names
  }, []);


// ============================================================================
// STEP 4: Add tab handler
// ============================================================================

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };


// ============================================================================
// STEP 5: In the JSX, add tab navigation and form section
// ============================================================================

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Employee Profile
      </Typography>

      {/* Tab Navigation */}
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label="Personal Info" />
        <Tab label="Skills" />
        <Tab label="Languages" />
        <Tab label="Checklist" />
        <Tab label="Career Path" />  {/* NEW TAB */}
      </Tabs>

      {/* Tab Content: Personal Info */}
      {activeTab === 0 && (
        <Box>
          {/* Existing personal info content */}
          {profile && (
            <Box>
              <TextField label="Name" value={profile.name} disabled />
              {/* ... other personal info fields ... */}
            </Box>
          )}
        </Box>
      )}

      {/* Tab Content: Skills */}
      {activeTab === 1 && (
        <Box>
          {/* Existing skills content */}
          {/* ... existing skill management code ... */}
        </Box>
      )}

      {/* Tab Content: Languages */}
      {activeTab === 2 && (
        <Box>
          {/* Existing languages content */}
          {/* ... existing language management code ... */}
        </Box>
      )}

      {/* Tab Content: Checklist */}
      {activeTab === 3 && (
        <Box>
          {/* Existing checklist content */}
          {/* ... existing checklist code ... */}
        </Box>
      )}

      {/* Tab Content: Career Path - NEW */}
      {activeTab === 4 && (
        <Box sx={{ mt: 2 }}>
          <CareerRecommendationForm 
            employeeSkills={skills.map(s => s.name)} 
          />
        </Box>
      )}
    </Box>
  );
}


// ============================================================================
// ALTERNATIVE: Add as a separate card/section (not in tabs)
// ============================================================================

/*

// If you don't want to use tabs, you can add it as a separate section:

export default function EmployeeProfile() {
  const [skills, setSkills] = useState(getStoredSkills);
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Employee Profile
      </Typography>

      {/* Personal Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* ... existing personal info ... */}
        </CardContent>
      </Card>

      {/* Skills Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* ... existing skills ... */}
        </CardContent>
      </Card>

      {/* NEW: Career Recommendation Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <CareerRecommendationForm 
            employeeSkills={skills.map(s => s.name)} 
          />
        </CardContent>
      </Card>
    </Box>
  );
}

*/


// ============================================================================
// INTEGRATION WITH CV EXTRACTION (Optional)
// ============================================================================

/*

// If you have CV extraction implemented:

const extractSkillsFromCV = async (cvFile) => {
  try {
    // Call your CV parsing service
    const response = await fetch('/api/cv/extract-skills', {
      method: 'POST',
      body: cvFile,
    });
    
    const extractedSkills = await response.json();
    
    // Convert extracted skills to skill objects
    const skillObjects = extractedSkills.map((skill, index) => ({
      id: index + 1,
      name: skill,
      level: 'Intermediate',
      experience: 2
    }));
    
    // Update skills state
    setSkills(skillObjects);
    localStorage.setItem('employeeSkills', JSON.stringify(skillObjects));
    
  } catch (error) {
    console.error('Error extracting skills:', error);
  }
};

// Then use it after CV upload:
async function uploadCv() {
  // ... existing upload code ...
  
  if (uploadResponse.ok) {
    // Extract skills after successful upload
    await extractSkillsFromCV(file);
  }
}

*/


// ============================================================================
// SUMMARY
// ============================================================================

/*

WHAT TO CHANGE IN YOUR EmployeeProfile.jsx:

1. At the top, add:
   import CareerRecommendationForm from './CareerRecommendationForm';

2. Inside the component, prepare skills for the form:
   const skillsArray = skills.map(s => s.name);

3. Where you want to display the form (inside return/JSX), add:
   <CareerRecommendationForm employeeSkills={skillsArray} />

THAT'S IT!

The form will:
✅ Display all input fields
✅ Validate user input against dataset
✅ Call the FastAPI microservice
✅ Display results with career path
✅ Show confidence scores
✅ Let users get multiple recommendations

*/
