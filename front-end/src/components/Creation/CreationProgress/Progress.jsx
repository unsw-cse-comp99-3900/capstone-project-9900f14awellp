import React, { useState, useEffect } from "react";
import "./Progress.css";

/**
 * ProgressIndicator component
 * Displays a progress bar and navigation buttons for a multi-step process
 *
 * @param {Object} props
 * @param {Array} props.steps - Array of step labels
 * @param {number} props.currentStep - Current step index
 * @param {function} props.onContinue - Function to call when continuing to next step
 * @param {function} props.onBack - Function to call when going back to previous step
 * @param {number} props.uploadProgress - Upload progress percentage (0-100)
 */
const ProgressIndicator = ({
  steps,
  currentStep,
  onContinue,
  onBack,
  uploadProgress,
}) => {
  // State to track animation progress
  const [animationProgress, setAnimationProgress] = useState(0);

  // Effect to animate progress bar when upload starts
  useEffect(() => {
    if (currentStep === 1 && uploadProgress > 0) {
      const startTime = Date.now();
      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / 1000, 1);
        setAnimationProgress(progress);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [currentStep, uploadProgress]);

  /**
   * Calculate the overall progress percentage
   * @returns {number} Progress percentage (0-100)
   */
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
    return progress;
  };

  return (
    <div className="button-and-progess">
      {/* Navigation buttons */}
      <div className="button-row">
        {/* Back button */}
        <button
          className="back-button"
          style={{ visibility: currentStep === 0 ? "hidden" : "visible" }}
          onClick={onBack}
        >
          Back
        </button>
        {/* Continue/Submit button */}
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

      {/* Progress indicator */}
      <div className="progress-indicator">
        <div className="steps-container">
          {/* Background line for progress bar */}
          <div className="background-line"></div>
          {/* Actual progress line */}
          <div
            className="progress-line"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
          {/* Render each step */}
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="step-wrapper">
                {/* Step circle */}
                <div className={`step ${index <= currentStep ? "active" : ""}`}>
                  <div className="circle">{index + 1}</div>
                </div>
                {/* Step label */}
                <div
                  className={`label ${index <= currentStep ? "active" : ""}`}
                >
                  {step}
                </div>
              </div>
              {/* Connector between steps (except for the last step) */}
              {index < steps.length - 1 && <div className="connector"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
