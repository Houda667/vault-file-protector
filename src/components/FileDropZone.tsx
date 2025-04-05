
import React, { useState, useCallback } from 'react';
import { Upload, File as FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropZoneProps {
  onFileSelect: (files: File[]) => void;
  mode: 'encrypt' | 'decrypt';
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileSelect, mode }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const filesArray = Array.from(e.dataTransfer.files);
        onFileSelect(filesArray);
      }
    },
    [onFileSelect]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const filesArray = Array.from(e.target.files);
        onFileSelect(filesArray);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col items-center justify-center border-2 border-vault-card rounded-lg p-10 transition-all cursor-pointer bg-vault-card/30",
        isDragActive && "file-drop-active"
      )}
    >
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="w-full h-full cursor-pointer">
        <div className="flex flex-col items-center">
          <div className="p-4 mb-4 rounded-full bg-gradient-vault text-white">
            {mode === 'encrypt' ? (
              <Upload size={24} />
            ) : (
              <FileIcon size={24} />
            )}
          </div>
          <p className="mb-2 text-lg font-medium text-vault-text">
            {isDragActive
              ? "Drop files here"
              : mode === 'encrypt'
                ? "Drag files to encrypt"
                : "Drag encrypted files to decrypt"
            }
          </p>
          <p className="text-sm text-vault-text-muted">
            or <span className="text-vault-accent">browse</span> to select files
          </p>
        </div>
      </label>
    </div>
  );
};

export default FileDropZone;
