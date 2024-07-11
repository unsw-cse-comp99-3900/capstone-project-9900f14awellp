import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import FileUploader from '../../components/Creation/FileUpload/FileUpload';

export default function Upload() {
	const { showAlert, setShowAlert } = useOutletContext();
	return (
		<div>
			<FileUploader showAlert={showAlert} />
		</div>
	);
}
