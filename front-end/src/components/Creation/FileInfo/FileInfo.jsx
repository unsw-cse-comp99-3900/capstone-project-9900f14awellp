import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import PDFicon from '../../../assets/pdf.svg';
import './FileInfo.css';

export default function FileUploadProgress({ fileName, fileSize, onCancel }) {
	return (
		<div className="file-upload-progress">
			<div className="file-row">
				<div className="file-name-icon-container">
					<img src={PDFicon} className="image-icon" alt="pdf" />
					<div className="file-info">
						<div className="file-name">{fileName}</div>
						<div className="file-size">{fileSize}</div>
					</div>
				</div>
				<IconButton size="small" onClick={onCancel} aria-label="cancel">
					<CloseIcon />
				</IconButton>
			</div>
		</div>
	);
}
