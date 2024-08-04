import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import { uploadFile } from "@/apis/upload";
import UploadProgress from "../FileInfo/FileInfo";

import "./FileUpload.css";

// FileUploader component for handling file uploads
export default function FileUploader({ showAlert }) {
  // Get setUploadProgress function from context
  const { setUploadProgress } = useOutletContext();

  // State variables for file management
  const [file, setFile] = useState(null);
  const [uuid, setUuid] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileSize, setFileSize] = useState(null);

  // Reference to the file input element
  const fileInputRef = useRef(null);

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFileSize((selectedFile.size / (1024 * 1024)).toFixed(2)); // Convert to MB
      setUuid(uuidv4());
    } else {
      // Reset state if file is invalid
      setFile(null);
      setFileName(null);
      setFileSize(null);
      setUuid(null);
    }
  };

  // Clear file selection
  const handleCancel = () => {
    setFile(null);
    setFileName(null);
    setFileSize(null);
  };

  // Handle file drop event
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  // Prevent default behavior for drag over event
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      console.log("No file selected");
      showAlert("Select a file before submitting:)", "error");
      return;
    }

    try {
      const uuid = uuidv4().substring(0, 30);
      setUploadProgress(1); // Set initial progress to 1%
      const response = await uploadFile(file, uuid);
      console.log("File uploaded successfully:", response.data);
      setUploadProgress(100); // Set progress to 100% on completion
      navigate("/success");
    } catch (error) {
      console.error("Error uploading file:", error);
      showAlert(error.message, "error");
      setUploadProgress(0); // Reset progress on failure
    }
  };

  // Effect to listen for custom 'uploadFile' event
  useEffect(() => {
    const handleUploadEvent = () => {
      console.log("Upload event received");
      handleUpload();
    };

    window.addEventListener("uploadFile", handleUploadEvent);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("uploadFile", handleUploadEvent);
    };
    // eslint-disable-next-line
  }, [file, uuid]);

  return (
    <div className="upload-container">
      <div className="upload-title-container">
        <div>Upload File</div>
      </div>
      {/* Drop zone for file upload */}
      <div
        className="dropZone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current.click()}
      >
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept=".pdf"
          onChange={(e) => handleFileChange(e.target.files[0])}
        />
        <UploadFileIcon className="upload-icon" fontSize="large" />
        <div className="drop-text">Drag and Drop file here or Choose file</div>
      </div>
      {/* File format and size reminders */}
      <div className="remind-info-container">
        <div>Supported format: PDF</div>
        <div>Maximum size: 25MB</div>
      </div>
      {/* File information display */}
      <div className={`file-info ${!file ? "hidden" : ""}`}>
        <UploadProgress
          fileName={fileName}
          fileSize={`${fileSize} MB`}
          onCancel={handleCancel}
        />
      </div>
      {/* Preview button */}
      <div className="button-groups">
        <button className="preview-button" disabled={!file}>
          Preview
        </button>
      </div>
    </div>
  );
}
