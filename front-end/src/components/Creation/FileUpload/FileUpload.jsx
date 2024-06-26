import React, { useState, useRef } from 'react';
import axios from 'axios';
import { uploadFile } from '../../../apis/upload';

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const cancelTokenSource = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('请选择 PDF 文件');
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      setError('请选择文件并输入标题');
      return;
    }

    setError(null);
    cancelTokenSource.current = axios.CancelToken.source();

    setUploading(true);
    try {
      await uploadFile(
        file,
        title,
        (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
        cancelTokenSource.current.token
      );
      alert('上传成功');
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('上传已取消');
      } else {
        console.error('上传错误:', error);
        if (error.response && error.response.data) {
          setError(JSON.stringify(error.response.data));
        } else {
          setError('上传失败，请重试');
        }
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handlePause = () => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel('上传已暂停');
    }
  };

  const handleCancel = () => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel('上传已取消');
      setFile(null);
      setProgress(0);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <input 
        type="text" 
        placeholder="输入标题" 
        value={title} 
        onChange={handleTitleChange}
      />
      {file && (
        <div>
          <p>选中的文件: {file.name}</p>
          <button onClick={handleUpload} disabled={uploading}>
            上传
          </button>
          {uploading && (
            <>
              <button onClick={handlePause}>暂停</button>
              <button onClick={handleCancel}>取消</button>
              <progress value={progress} max="100" />
              <span>{progress}%</span>
            </>
          )}
        </div>
      )}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
};

export default FileUploader;