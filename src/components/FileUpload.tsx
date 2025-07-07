import React, { useCallback, useEffect } from 'react';

interface FileUploadProps {
  onUpload: (files: Array<{ name: string; url: string }>) => void;
  existingFiles: Array<{ name: string; url: string }>;
  onDelete: (index: number) => void;
  disabled?: boolean;
  maxFileSize?: number; 
  allowedFileTypes?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  existingFiles,
  onDelete,
  disabled = false,
  maxFileSize = 5 * 1024 * 1024, 
  allowedFileTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
}) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const filesArray = Array.from(e.target.files);
    const validFiles: Array<{ name: string; url: string }> = [];
    const invalidFiles: string[] = [];

    filesArray.forEach((file) => {
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!allowedFileTypes.includes(fileExtension)) {
        invalidFiles.push(`${file.name} - Invalid file type`);
        return;
      }

      if (file.size > maxFileSize) {
        invalidFiles.push(`${file.name} - File too large (max ${maxFileSize / 1024 / 1024}MB)`);
        return;
      }

      validFiles.push({
        name: file.name,
        url: URL.createObjectURL(file),
      });
    });

    if (invalidFiles.length > 0) {
      alert(`Some files were rejected:\n${invalidFiles.join('\n')}`);
    }

    if (validFiles.length > 0) {
      onUpload(validFiles);
    }
  }, [onUpload, maxFileSize, allowedFileTypes]);


  useEffect(() => {
    return () => {
      existingFiles.forEach((file) => {
        if (file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [existingFiles]);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700" htmlFor="file-upload">
          Upload Files
        </label>
        <span className="text-xs text-gray-500">
          Max {maxFileSize / 1024 / 1024}MB • {allowedFileTypes.join(', ')}
        </span>
      </div>

      <div className="flex items-center">
        <label
          htmlFor="file-upload"
          className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          Select Files
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            multiple
            disabled={disabled}
            accept={allowedFileTypes.join(',')}
          />
        </label>
      </div>

      {existingFiles.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Uploaded Files</h4>
          <ul className="border rounded-md divide-y divide-gray-200">
            {existingFiles.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
              >
                <div className="flex items-center min-w-0">
                  <span className="truncate">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      {file.name}
                    </a>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(index)}
                  className="ml-4 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={disabled}
                  aria-label={`Remove ${file.name}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};