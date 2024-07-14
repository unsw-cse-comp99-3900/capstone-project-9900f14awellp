import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import { uploadFile } from '../../../apis/upload';
import UploadProgress from '../FileInfo/FileInfo';

import './FileUpload.css';

export default function FileUploader({ showAlert }) {
	const [file, setFile] = useState(null);
	const [uuid, setUuid] = useState(null);
	const [fileName, setFileName] = useState(null);
	const [fileSize, setFileSize] = useState(null);
	const fileInputRef = useRef(null);
	const navigate = useNavigate();

	const handleFileChange = (selectedFile) => {
		if (selectedFile && selectedFile.type === 'application/pdf') {
			setFile(selectedFile);
			setFileName(selectedFile.name);
			setFileSize((selectedFile.size / (1024 * 1024)).toFixed(2));
			setUuid(uuidv4());
		} else {
			setFile(null);
			setFileName(null);
			setFileSize(null);
			setUuid(null);
		}
	};

	const handleCancel = () => {
		setFile(null);
		setFileName(null);
		setFileSize(null);
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
		if (!file) {
			console.log('No file selected');
			showAlert('Select a file before submitting:)', 'error');
			return;
		}

		try {
			const uuid = uuidv4().substring(0, 30);
			const response = await uploadFile(file, uuid);
			console.log('File uploaded successfully:', response.data);
			showAlert('File uploaded successfully!', 'success');
			//TODO: 在这里加上成功上传的动画效果，使用@magicui Confetti组件
			setTimeout(() => {
				navigate('/home');
			}, 1000);
		} catch (error) {
			console.error('Error uploading file:', error);
			showAlert(error.message, 'error');
		}
	};

	// 监听uploadFile事件，触发文件上传
	useEffect(() => {
		const handleUploadEvent = () => {
			console.log('Upload event received');
			handleUpload();
		};

		window.addEventListener('uploadFile', handleUploadEvent);

		return () => {
			window.removeEventListener('uploadFile', handleUploadEvent);
		};
		// eslint-disable-next-line
	}, [file, uuid]);

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
			<div className="remind-info-container">
				<div>Supported format: PDF</div>
				<div>Maximum size: 25MB</div>
			</div>
			<div className={`file-info ${!file ? 'hidden' : ''}`}>
				<UploadProgress
					fileName={fileName}
					fileSize={`${fileSize} MB`}
					onCancel={handleCancel}
				/>
			</div>
			<div className="button-groups">
				<button className="preview-button" disabled={!file}>
					Prieview
				</button>
			</div>
		</div>
	);
}
