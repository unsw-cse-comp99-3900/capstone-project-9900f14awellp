import React, { useEffect } from 'react'

import FileUploader from '../../components/Creation/FileUpload/FileUpload';

export default function Upload() {

  useEffect(() => {
    localStorage.setItem('userId', '3');
  }, []);


  return (
    <div>
        <FileUploader />
    </div>
    
  )
}
