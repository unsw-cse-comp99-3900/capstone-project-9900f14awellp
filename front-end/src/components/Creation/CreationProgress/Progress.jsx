import React, { useState, useEffect } from "react";
import "./Progress.css";

const ProgressIndicator = ({
  steps,
  currentStep,
  onContinue,
  onBack,
  uploadProgress,
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    // console.log(
    //   "ProgressIndicator useEffect. Current step:",
    //   currentStep,
    //   "Upload progress:",
    //   uploadProgress
    // );
    if (currentStep === 1 && uploadProgress > 0) {
      const startTime = Date.now();
      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / 1000, 1);
        setAnimationProgress(progress);
        // console.log("Animation progress:", progress);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [currentStep, uploadProgress]);

  const calculateProgress = () => {
    let progress;
    if (currentStep === 0) {
      progress = 0;
    } else if (currentStep === 1) {
      if (uploadProgress === 0) {
        progress = 50;
      } else {
        progress = 50 + (uploadProgress / 100) * 50;
      }
    } else {
      progress = 100;
    }
    // console.log(
    //   "Calculated progress:",
    //   progress,
    //   "Current step:",
    //   currentStep,
    //   "Upload progress:",
    //   uploadProgress
    // );
    return progress;
  };

  return (
    <div className="button-and-progess">
      <div className="button-row">
        <button
          className="back-button"
          style={{ visibility: currentStep === 0 ? "hidden" : "visible" }}
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="continue-button"
          onClick={onContinue}
          style={{
            visibility: currentStep === steps.length - 1 ? "hidden" : "visible",
          }}
        >
          {currentStep === 1 ? "Submit" : "Continue"}
        </button>
      </div>
      <div className="progress-indicator">
        <div className="steps-container">
          <div className="background-line"></div>
          <div
            className="progress-line"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="step-wrapper">
                <div className={`step ${index <= currentStep ? "active" : ""}`}>
                  <div className="circle">{index + 1}</div>
                </div>
                <div
                  className={`label ${index <= currentStep ? "active" : ""}`}
                >
                  {step}
                </div>
              </div>
              {index < steps.length - 1 && <div className="connector"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
