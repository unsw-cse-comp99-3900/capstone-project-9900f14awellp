// Import necessary components from Material-UI
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

// Import custom PDF icon and CSS styles
import PDFicon from "../../../assets/pdf.svg";
import "./FileInfo.css";

/**
 * FileUploadProgress Component
 *
 * This component displays information about an uploaded file, including its name,
 * size, and provides an option to cancel the upload.
 *
 * @param {Object} props - Component props
 * @param {string} props.fileName - The name of the uploaded file
 * @param {string} props.fileSize - The size of the uploaded file
 * @param {Function} props.onCancel - Callback function to handle cancellation
 * @returns {JSX.Element} Rendered component
 */
export default function FileUploadProgress({ fileName, fileSize, onCancel }) {
  return (
    <div className="file-upload-progress">
      <div className="file-row">
        {/* Container for file icon and information */}
        <div className="file-name-icon-container">
          {/* Display PDF icon */}
          <img src={PDFicon} className="image-icon" alt="pdf" />
          {/* Container for file name and size */}
          <div className="file-info">
            {/* Display file name */}
            <div className="file-name">{fileName}</div>
            {/* Display file size */}
            <div className="file-size">{fileSize}</div>
          </div>
        </div>
        {/* Cancel button */}
        <IconButton size="small" onClick={onCancel} aria-label="cancel">
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  );
}
