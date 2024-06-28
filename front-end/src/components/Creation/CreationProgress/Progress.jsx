import React from 'react';
import './Progress.css';

const ProgressIndicator = ({ steps, currentStep, onContinue, onBack }) => {
    return (
      <div className='button-and-progess'>
        <div className='button-row'>
        <button className='back-button' style={{visibility: currentStep === 0 ? 'hidden' : 'visible'}} onClick={onBack}>Back</button>
        <button className='continue-button' onClick={onContinue} style={{visibility: currentStep === 3 ? 'hidden' : 'visible'}}>Continue</button>
        </div>
        <div className="progress-indicator">
          <div className="steps-container">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="step-wrapper">
                  <div className={`step ${index <= currentStep ? 'active' : ''}`}>
                    <div className="circle">{index+1}</div>
                  </div>
                  <div className={`label ${index <= currentStep ? 'active' : ''}`}>{step}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`connector ${index < currentStep ? 'active' : ''}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default ProgressIndicator;