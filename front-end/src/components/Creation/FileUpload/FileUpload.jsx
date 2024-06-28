import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { uploadFile } from '../../../apis/upload';
import './FileUpload.css';

import UploadProgress from '../FileInfo/FileInfo';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function FileUploader(){
	const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [title, setTitle] = useState('');
  const fileInputRef = useRef(null);
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFileSize((selectedFile.size / (1024 * 1024)).toFixed(2));
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      setError(null);
    } else {
      setError('Invalid file format. Please upload a PDF file.');
      setFile(null);
      setFileName(null);
      setFileSize(null);
      setTitle('');
    }
  };

  
  const handleCancel = () => {
    setFile(null);
    setFileName(null);
    setFileSize(null);
    setTitle('');
  };

	const handleDrop = (event) => {
		event.preventDefault();
		const droppedFile = event.dataTransfer.files[0];
		handleFileChange(droppedFile);
	};

	const handleDragOver = (event) => {
		event.preventDefault();
	};

  const handleUpload = async () => {
    console.log('handleUpload called');
    setDebugInfo('Attempting to upload...');
    if (!file) {
      console.log('No file selected');
      setError('Please select a file to upload.');
      setDebugInfo('Upload failed: No file selected');
      return;
    }

    if (!title.trim()) {
      console.log('No title entered');
      setError('Please enter a title for the file.');
      setDebugInfo('Upload failed: No title entered');
      return;
    }

    try {
      console.log('Attempting to upload file:', file.name);
      setDebugInfo(`Uploading file: ${file.name}`);
      const response = await uploadFile(file, title);
      console.log('File uploaded successfully:', response.data);
      setDebugInfo(`Upload successful: ${response.data}`);
      navigate('/home');
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      setError('Failed to upload file. Please try again.');
      setDebugInfo(`Upload failed: ${error.message}`);
    }
  };

  useEffect(() => {
    const handleUploadEvent = () => {
      console.log('Upload event received');
      setDebugInfo('Upload event received');
      handleUpload();
    };

    window.addEventListener('uploadFile', handleUploadEvent);

    return () => {
      window.removeEventListener('uploadFile', handleUploadEvent);
    };
  }, [file, title]); // 确保这里包含了 file 和 title

	return (
		<div className="upload-container">
			<div className="upload-title-container">
				<div>Upload File</div>
			</div>
			<div
				className="dropZone"
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onClick={() => fileInputRef.current.click()}
			>
				<input
					type="file"
					ref={fileInputRef}
					style={{ display: 'none' }}
					accept=".pdf"
					onChange={(e) => handleFileChange(e.target.files[0])}
				/>
				<UploadFileIcon className="upload-icon" fontSize="large" />
				<div className="drop-text">Drag and Drop file here or Choose file</div>
			</div>
      <div className='remind-info-container'>
          <div>Supported format: PDF</div>
          <div>Maximum size: 25MB</div>
        </div>
        <div className={`file-info ${!file ? 'hidden' : ''}`}>
          <UploadProgress fileName={fileName} 
          fileSize={`${fileSize} MB`}
          onCancel={handleCancel}/>
        </div>
      <div className='button-groups'>
        <button className='preview-button' disabled={!file}>Prieview</button>
      </div>
		</div>
	);
};
