import React, { useEffect } from 'react'
import { useNavigate} from 'react-router-dom';

import ProgressIndicator from '../../components/Creation/CreationProgress/Progress';
import FileUploader from '../../components/Creation/FileUpload/FileUpload';

export default function Upload() {
  const navigate = useNavigate();
  const steps = ['Select', 'Fill/Upload', 'Done'];
  const currentStep = 1;

  const handleContinue = () => {
    console.log('Continue');
  }
  const handleBack = () => {
    navigate('/create');
  }
  useEffect(() => {
    localStorage.setItem('userId', '3');
  }, []);


  return (
    <div>
        <ProgressIndicator 
          steps={steps} 
          currentStep={currentStep} 
          onContinue={handleContinue}
          onBack={handleBack}
        />
        <FileUploader />
    </div>
    
  )
}
